'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface Trace {
  // Celdas (columna, fila) de origen y destino.
  from: [number, number];
  to: [number, number];
  horizontalFirst: boolean;
  start: number;
  // Trazas que convergen hacia "Comenzar": no marcan la celda destino (queda bajo el botón).
  converge: boolean;
}

interface Probe {
  col: number;
  row: number;
  start: number;
}

interface Wave {
  col: number;
  row: number;
  start: number;
  // Radio máximo en celdas.
  reach: number;
}

const CELL = 11;
const BRAND = '77, 174, 132';
const MAX_TRACES = 5;
const TRACE_INTERVAL = 700;
const TRACE_MS = 1500;
const HOLD_MS = 1100;
const FADE_MS = 800;
const PROBE_INTERVAL = 90;
const PROBE_MS = 900;

// Efecto de "Comenzar": con el cursor cerca, las correlaciones convergen al botón y salen ondas de celdas.
const CTA_PROXIMITY = 260;
const CTA_MAX_TRACES = 14;
const CTA_TRACE_INTERVAL = 140;
const CTA_TRACE_MS = 900;
const WAVE_INTERVAL = 1100;
const WAVE_MS = 1600;
const WAVE_REACH = 18;
const CLICK_WAVE_REACH = 45;

/**
 * Fondo decorativo de cuadrícula para el hero: celdas que se "revisan" al azar
 * y trazas que recorren la cuadrícula de una celda a otra hasta encontrar la
 * correlación, que se marca al llegar. Al acercar el cursor al elemento
 * `[data-hero-cta]` ("Comenzar"), las trazas convergen hacia él y emite ondas
 * de celdas; al hacer clic, una onda mayor. Con movimiento reducido se dibuja
 * solo la cuadrícula estática.
 */
export function HeroGrid({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cta = container.querySelector<HTMLElement>('[data-hero-cta]');

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let offsetX = 0;
    let offsetY = 0;
    let lineColor = '0, 0, 0';
    let traces: Trace[] = [];
    let probes: Probe[] = [];
    let waves: Wave[] = [];
    let lastTraceAt = -Infinity;
    let lastProbeAt = -Infinity;
    let lastWaveAt = -Infinity;
    let activation = 0;
    let smoothed = 0;
    let pendingClick = false;

    const readLineColor = () => {
      // Igual que en HeroUniverse: un elemento de prueba resuelve la variable CSS a rgb().
      const probe = document.createElement('div');
      probe.style.color = 'var(--color-fd-foreground)';
      probe.style.display = 'none';
      container.appendChild(probe);
      const resolved = getComputedStyle(probe).color;
      container.removeChild(probe);
      const match = resolved.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (match) lineColor = `${match[1]}, ${match[2]}, ${match[3]}`;
    };

    const x = (col: number) => offsetX + col * CELL;
    const y = (row: number) => offsetY + row * CELL;
    const randInt = (max: number) => Math.floor(Math.random() * max);
    const clampCol = (col: number) => Math.min(cols - 1, Math.max(0, col));
    const clampRow = (row: number) => Math.min(rows - 1, Math.max(0, row));

    // Celda bajo el centro de "Comenzar", en coordenadas del canvas.
    const ctaCell = (): [number, number] | null => {
      if (!cta) return null;
      const box = cta.getBoundingClientRect();
      const origin = container.getBoundingClientRect();
      const cx = box.left + box.width / 2 - origin.left;
      const cy = box.top + box.height / 2 - origin.top;
      return [clampCol(Math.floor((cx - offsetX) / CELL)), clampRow(Math.floor((cy - offsetY) / CELL))];
    };

    const drawGrid = () => {
      ctx.strokeStyle = `rgba(${lineColor}, 0.05)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        ctx.moveTo(Math.round(x(c)) + 0.5, 0);
        ctx.lineTo(Math.round(x(c)) + 0.5, height);
      }
      for (let r = 0; r <= rows; r++) {
        ctx.moveTo(0, Math.round(y(r)) + 0.5);
        ctx.lineTo(width, Math.round(y(r)) + 0.5);
      }
      ctx.stroke();
    };

    const fillCell = (col: number, row: number, alpha: number) => {
      ctx.fillStyle = `rgba(${BRAND}, ${alpha})`;
      ctx.fillRect(x(col) + 1, y(row) + 1, CELL - 1, CELL - 1);
    };

    const strokeCell = (col: number, row: number, alpha: number) => {
      ctx.strokeStyle = `rgba(${BRAND}, ${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x(col) + 0.5, y(row) + 0.5, CELL, CELL);
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      // Centra la cuadrícula para que quede simétrica respecto al texto del hero.
      offsetX = ((width % CELL) - CELL) / 2;
      offsetY = ((height % CELL) - CELL) / 2;
      traces = [];
      probes = [];
      waves = [];
      readLineColor();
      if (reduced) {
        ctx.clearRect(0, 0, width, height);
        drawGrid();
      }
    };

    const spawnTrace = (now: number) => {
      // El origen se elige en la zona central (el borde lo oculta la máscara del hero).
      const from: [number, number] = [
        Math.floor(cols * 0.1) + randInt(Math.ceil(cols * 0.8)),
        Math.floor(rows * 0.1) + randInt(Math.ceil(rows * 0.8)),
      ];
      const dc = (randInt(16) + 10) * (Math.random() < 0.5 ? -1 : 1);
      const dr = (randInt(10) + 5) * (Math.random() < 0.5 ? -1 : 1);
      const to: [number, number] = [clampCol(from[0] + dc), clampRow(from[1] + dr)];
      if (to[0] === from[0] && to[1] === from[1]) return;
      traces.push({ from, to, horizontalFirst: Math.random() < 0.5, start: now, converge: false });
    };

    const spawnConvergingTrace = (now: number, target: [number, number]) => {
      // Origen en un anillo alrededor del botón, para que las trazas se vean llegar.
      const angle = Math.random() * Math.PI * 2;
      const dist = 25 + randInt(30);
      const from: [number, number] = [
        clampCol(target[0] + Math.round(Math.cos(angle) * dist)),
        clampRow(target[1] + Math.round(Math.sin(angle) * dist * 0.6)),
      ];
      traces.push({ from, to: target, horizontalFirst: Math.random() < 0.5, start: now, converge: true });
    };

    // Punto del recorrido en forma de L (centro de celda a centro de celda) según el progreso 0..1.
    const pointAt = (trace: Trace, t: number) => {
      const ax = x(trace.from[0]) + CELL / 2;
      const ay = y(trace.from[1]) + CELL / 2;
      const bx = x(trace.to[0]) + CELL / 2;
      const by = y(trace.to[1]) + CELL / 2;
      const legA = trace.horizontalFirst ? Math.abs(bx - ax) : Math.abs(by - ay);
      const legB = trace.horizontalFirst ? Math.abs(by - ay) : Math.abs(bx - ax);
      const total = legA + legB || 1;
      const d = t * total;
      const corner = trace.horizontalFirst ? { x: bx, y: ay } : { x: ax, y: by };
      if (d <= legA) {
        const k = legA ? d / legA : 1;
        return { x: ax + (corner.x - ax) * k, y: ay + (corner.y - ay) * k, corner, passed: false };
      }
      const k = legB ? (d - legA) / legB : 1;
      return { x: corner.x + (bx - corner.x) * k, y: corner.y + (by - corner.y) * k, corner, passed: true };
    };

    // Onda cuadrada de celdas (distancia de Chebyshev) que se expande desde el botón.
    const drawWave = (wave: Wave, now: number) => {
      const k = (now - wave.start) / WAVE_MS;
      const radius = Math.round(k * wave.reach);
      const alpha = (1 - k) * 0.35;
      if (radius === 0) {
        fillCell(wave.col, wave.row, alpha);
        return;
      }
      for (let i = -radius; i <= radius; i++) {
        for (const [col, row] of [
          [wave.col + i, wave.row - radius],
          [wave.col + i, wave.row + radius],
          [wave.col - radius, wave.row + i],
          [wave.col + radius, wave.row + i],
        ]) {
          // Huecos al azar para que la onda se vea como un barrido, no como un marco sólido.
          if ((col * 7 + row * 13 + radius) % 3 === 0) continue;
          if (col >= 0 && col < cols && row >= 0 && row < rows) fillCell(col, row, alpha);
        }
      }
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      drawGrid();

      smoothed += (activation - smoothed) * 0.08;
      const target = smoothed > 0.05 || pendingClick ? ctaCell() : null;

      // Celdas candidatas que se revisan brevemente.
      if (now - lastProbeAt > PROBE_INTERVAL) {
        probes.push({ col: randInt(cols), row: randInt(rows), start: now });
        lastProbeAt = now;
      }
      probes = probes.filter((p) => now - p.start < PROBE_MS);
      for (const p of probes) {
        const k = (now - p.start) / PROBE_MS;
        fillCell(p.col, p.row, Math.sin(k * Math.PI) * 0.12);
      }

      if (target && smoothed > 0.3) {
        const max = MAX_TRACES + Math.round(CTA_MAX_TRACES * smoothed);
        if (traces.length < max && now - lastTraceAt > CTA_TRACE_INTERVAL) {
          spawnConvergingTrace(now, target);
          lastTraceAt = now;
        }
        if (smoothed > 0.6 && now - lastWaveAt > WAVE_INTERVAL) {
          waves.push({ col: target[0], row: target[1], start: now, reach: WAVE_REACH });
          lastWaveAt = now;
        }
      } else if (traces.length < MAX_TRACES && now - lastTraceAt > TRACE_INTERVAL) {
        spawnTrace(now);
        lastTraceAt = now;
      }

      if (pendingClick && target) {
        waves.push({ col: target[0], row: target[1], start: now, reach: CLICK_WAVE_REACH });
        for (let i = 0; i < 8; i++) spawnConvergingTrace(now, target);
      }
      pendingClick = false;

      waves = waves.filter((w) => now - w.start < WAVE_MS);
      for (const wave of waves) drawWave(wave, now);

      traces = traces.filter((tr) => {
        const duration = tr.converge ? CTA_TRACE_MS + FADE_MS : TRACE_MS + HOLD_MS + FADE_MS;
        return now - tr.start < duration;
      });

      for (const trace of traces) {
        const travel = trace.converge ? CTA_TRACE_MS : TRACE_MS;
        const hold = trace.converge ? 0 : HOLD_MS;
        const elapsed = now - trace.start;
        const t = Math.min(1, elapsed / travel);
        const eased = 1 - Math.pow(1 - t, 3);
        const fade = elapsed > travel + hold ? 1 - (elapsed - travel - hold) / FADE_MS : 1;
        const head = pointAt(trace, eased);
        const ax = x(trace.from[0]) + CELL / 2;
        const ay = y(trace.from[1]) + CELL / 2;

        fillCell(trace.from[0], trace.from[1], 0.25 * fade);
        strokeCell(trace.from[0], trace.from[1], 0.5 * fade);

        ctx.strokeStyle = `rgba(${BRAND}, ${0.55 * fade})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        if (head.passed) ctx.lineTo(head.corner.x, head.corner.y);
        ctx.lineTo(head.x, head.y);
        ctx.stroke();
        ctx.setLineDash([]);

        if (t < 1) {
          ctx.fillStyle = `rgba(${BRAND}, 0.9)`;
          ctx.beginPath();
          ctx.arc(head.x, head.y, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (!trace.converge) {
          // Correlación encontrada: la celda destino se marca y emite un pulso.
          const since = elapsed - travel;
          fillCell(trace.to[0], trace.to[1], 0.35 * fade);
          strokeCell(trace.to[0], trace.to[1], 0.8 * fade);
          const pulse = Math.min(1, since / 700);
          ctx.strokeStyle = `rgba(${BRAND}, ${(1 - pulse) * 0.5 * fade})`;
          ctx.lineWidth = 1;
          const grow = pulse * CELL * 2;
          ctx.strokeRect(x(trace.to[0]) - grow, y(trace.to[1]) - grow, CELL + grow * 2, CELL + grow * 2);
        }
      }
    };

    resize();

    const tick = (time: number) => draw(time * 1000);
    if (!reduced) gsap.ticker.add(tick);

    const onMove = (e: PointerEvent) => {
      if (!cta) return;
      const box = cta.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (box.left + box.width / 2), e.clientY - (box.top + box.height / 2));
      activation = Math.max(0, Math.min(1, 1 - dist / CTA_PROXIMITY));
    };
    const onClick = () => {
      pendingClick = true;
    };
    if (!reduced && cta) {
      window.addEventListener('pointermove', onMove, { passive: true });
      cta.addEventListener('pointerdown', onClick);
    }

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    // Al cambiar de tema cambia el color de las líneas; se vuelve a leer.
    const themeObserver = new MutationObserver(() => {
      readLineColor();
      if (reduced) {
        ctx.clearRect(0, 0, width, height);
        drawGrid();
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener('pointermove', onMove);
      cta?.removeEventListener('pointerdown', onClick);
      resizeObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
