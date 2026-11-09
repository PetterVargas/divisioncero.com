'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { Button } from '@/components/herramientas/ui/button';
import { Input } from '@/components/herramientas/ui/input';
import { Label } from '@/components/herramientas/ui/label';
import { cn } from '@/lib/herramientas/utils';

const PRESETS_MIN = [1, 3, 5, 10, 15];
const WARNING_MS = 10_000;
const DEFAULT_MS = 3 * 60_000;
const MAX_MINUTES = 999;

const pad = (n: number) => String(n).padStart(2, '0');

/** Pitido corto con Web Audio; no requiere archivos de sonido. */
function beep(times: number) {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    for (let i = 0; i < times; i++) {
      const start = ctx.currentTime + i * 0.35;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    }
    setTimeout(() => ctx.close(), times * 400 + 200);
  } catch {
    // Sin soporte de audio: el temporizador sigue funcionando.
  }
}

export function CountdownTimer() {
  const [totalMs, setTotalMs] = useState(DEFAULT_MS);
  const [remainingMs, setRemainingMs] = useState(DEFAULT_MS);
  const [running, setRunning] = useState(false);
  const [minutesInput, setMinutesInput] = useState('3');
  const [secondsInput, setSecondsInput] = useState('0');
  const [heading, setHeading] = useState('Comenzamos en');
  const [tagline, setTagline] = useState('Simplificando juntos la Ciberseguridad de LatAm');
  const [sound, setSound] = useState(true);

  const endAtRef = useRef(0);
  const frameRef = useRef(0);
  const soundRef = useRef(sound);
  soundRef.current = sound;

  const finished = remainingMs <= 0;
  const warning = remainingMs > 0 && remainingMs <= WARNING_MS;

  const setDuration = useCallback((ms: number) => {
    setRunning(false);
    setTotalMs(ms);
    setRemainingMs(ms);
  }, []);

  // Bucle de animación: se calcula contra una hora de fin para no acumular desfase.
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const left = Math.max(0, endAtRef.current - Date.now());
      setRemainingMs(left);
      if (left <= 0) {
        setRunning(false);
        if (soundRef.current) beep(3);
        return;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running]);

  const toggle = useCallback(() => {
    if (running) {
      setRunning(false);
      return;
    }
    const base = remainingMs > 0 ? remainingMs : totalMs;
    if (base <= 0) return;
    if (remainingMs <= 0) setRemainingMs(totalMs);
    endAtRef.current = Date.now() + base;
    setRunning(true);
  }, [running, remainingMs, totalMs]);

  const reset = useCallback(() => {
    setRunning(false);
    setRemainingMs(totalMs);
  }, [totalMs]);

  // Atajos: espacio inicia/pausa, R reinicia (ignorados al escribir en un campo).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'r' || e.key === 'R') {
        reset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, reset]);

  const applyCustom = () => {
    const m = Math.min(MAX_MINUTES, Math.max(0, Math.floor(Number(minutesInput) || 0)));
    const s = Math.min(59, Math.max(0, Math.floor(Number(secondsInput) || 0)));
    setMinutesInput(String(m));
    setSecondsInput(String(s));
    const ms = (m * 60 + s) * 1000;
    if (ms > 0) setDuration(ms);
  };

  const displaySeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(displaySeconds / 60);
  const seconds = displaySeconds % 60;
  const progress = totalMs > 0 ? remainingMs / totalMs : 0;

  return (
    <div className="space-y-6">
      <ToolFullscreen className="rounded-xl">
        <TimerDisplay
          minutes={minutes}
          seconds={seconds}
          progress={progress}
          warning={warning}
          finished={finished}
          running={running}
          heading={heading}
          tagline={tagline}
          onClick={toggle}
        />
      </ToolFullscreen>

      <div className="grid gap-6 rounded-xl border p-4 md:grid-cols-2 md:p-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={toggle} className="min-w-32">
              {running ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {running ? 'Pausar' : finished ? 'Reiniciar' : remainingMs < totalMs ? 'Continuar' : 'Iniciar'}
            </Button>
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reiniciar
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSound((v) => !v)}
              title={sound ? 'Silenciar alarma' : 'Activar alarma'}
              aria-label={sound ? 'Silenciar alarma' : 'Activar alarma'}
            >
              {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Tiempo rápido</Label>
            <div className="flex flex-wrap gap-2">
              {PRESETS_MIN.map((m) => (
                <Button
                  key={m}
                  size="sm"
                  variant={totalMs === m * 60_000 ? 'default' : 'outline'}
                  onClick={() => {
                    setMinutesInput(String(m));
                    setSecondsInput('0');
                    setDuration(m * 60_000);
                  }}
                >
                  {m} min
                </Button>
              ))}
            </div>
          </div>

          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              applyCustom();
            }}
          >
            <div className="space-y-1">
              <Label htmlFor="timer-min">Minutos</Label>
              <Input
                id="timer-min"
                type="number"
                min={0}
                max={MAX_MINUTES}
                value={minutesInput}
                onChange={(e) => setMinutesInput(e.target.value)}
                className="w-24"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="timer-sec">Segundos</Label>
              <Input
                id="timer-sec"
                type="number"
                min={0}
                max={59}
                value={secondsInput}
                onChange={(e) => setSecondsInput(e.target.value)}
                className="w-24"
              />
            </div>
            <Button type="submit" variant="secondary">
              Establecer
            </Button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="timer-heading">Título</Label>
            <Input id="timer-heading" value={heading} maxLength={40} onChange={(e) => setHeading(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="timer-tagline">Mensaje inferior</Label>
            <Input id="timer-tagline" value={tagline} maxLength={80} onChange={(e) => setTagline(e.target.value)} />
          </div>
          <p className="text-muted-foreground text-sm">
            Atajos: <kbd className="rounded border px-1">Espacio</kbd> inicia o pausa,{' '}
            <kbd className="rounded border px-1">R</kbd> reinicia. También puedes hacer clic sobre el reloj. Usa el
            botón de la esquina para proyectarlo en pantalla completa. Faltando 10 segundos el reloj cambia a rojo.
          </p>
        </div>
      </div>
    </div>
  );
}

const TICKS = Array.from({ length: 120 }, (_, i) => i);

function TimerDisplay({
  minutes,
  seconds,
  progress,
  warning,
  finished,
  running,
  heading,
  tagline,
  onClick,
}: {
  minutes: number;
  seconds: number;
  progress: number;
  warning: boolean;
  finished: boolean;
  running: boolean;
  heading: string;
  tagline: string;
  onClick: () => void;
}) {
  const danger = warning || finished;
  const r = 42;
  const c = 2 * Math.PI * r;
  const angle = 2 * Math.PI * progress;
  const dotX = 50 + r * Math.sin(angle);
  const dotY = 50 - r * Math.cos(angle);
  // El anillo mide 80cqh; los dígitos se ajustan para quedar dentro del círculo.
  const digitsSize = minutes >= 100 ? '12cqh' : '15cqh';

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label={`${minutes} minutos ${seconds} segundos`}
      onClick={onClick}
      className={cn(
        'bg-card text-card-foreground relative w-full cursor-pointer overflow-hidden rounded-xl border select-none',
        'aspect-video [:fullscreen_&]:aspect-auto [:fullscreen_&]:h-full [:fullscreen_&]:rounded-none [:fullscreen_&]:border-0',
        danger ? 'text-destructive' : 'text-primary',
      )}
      style={{
        containerType: 'size',
        backgroundImage:
          'radial-gradient(circle at center, color-mix(in oklab, currentColor 8%, transparent) 0%, transparent 55%)',
      }}
    >
      {/* Anillo: hereda el color de acento (primario o destructivo) vía currentColor */}
      <svg
        viewBox="0 0 100 100"
        className="absolute top-1/2 left-1/2 h-[80cqh] w-[80cqh] -translate-x-1/2 -translate-y-[54%] transition-colors"
        aria-hidden
      >
        {TICKS.map((i) => {
          const a = (i / TICKS.length) * 2 * Math.PI;
          const long = i % 10 === 0;
          const active = i / TICKS.length < progress;
          const r1 = 45.5;
          const r2 = long ? 48.5 : 47;
          return (
            <line
              key={i}
              x1={50 + r1 * Math.sin(a)}
              y1={50 - r1 * Math.cos(a)}
              x2={50 + r2 * Math.sin(a)}
              y2={50 - r2 * Math.cos(a)}
              stroke="currentColor"
              strokeOpacity={active ? 0.6 : 0.15}
              strokeWidth={long ? 0.35 : 0.2}
            />
          );
        })}
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.6" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          strokeDasharray={`${c * progress} ${c}`}
          transform="rotate(-90 50 50)"
        />
        {progress > 0 && progress < 1 && (
          <circle cx={dotX} cy={dotY} r="1.2" className="fill-foreground" />
        )}
      </svg>

      {/* Contenido central */}
      <div className="absolute inset-x-0 top-1/2 flex -translate-y-[54%] flex-col items-center">
        <p className="text-muted-foreground mb-[2.5cqh] max-w-[50cqh] truncate text-[2.6cqh] tracking-[0.3em] uppercase">
          {finished ? '¡Comenzamos!' : heading}
        </p>
        <div
          className={cn(
            'flex items-center font-mono leading-none font-bold tabular-nums transition-colors',
            danger ? 'text-destructive' : 'text-foreground',
            warning && running && 'animate-pulse',
          )}
          style={{ fontSize: digitsSize }}
        >
          <span>{pad(minutes)}</span>
          <span className={cn('mx-[0.5cqh]', danger ? 'text-destructive' : 'text-primary')}>:</span>
          <span>{pad(seconds)}</span>
        </div>
        <div className="text-muted-foreground mt-[3cqh] flex gap-[10cqh] font-mono text-[1.8cqh] tracking-widest">
          <span>MIN</span>
          <span>SEG</span>
        </div>
      </div>

      {tagline && (
        <p className="text-foreground absolute inset-x-0 bottom-[3.5cqh] px-4 text-center text-[3.4cqh] font-medium">
          {tagline}
        </p>
      )}
    </div>
  );
}
