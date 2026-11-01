'use client';

import { useEffect, useState } from 'react';
import { BookOpen, GraduationCap, Radar, Sparkles, ArrowUp, Loader2 } from 'lucide-react';

type Source = 'kudo' | 'conan' | 'academy';
type Status = 'ok' | 'progress' | 'blocked' | 'done';

interface Row {
  id: string;
  source: Source;
  title: string;
  meta: string;
  status: Status;
  time: string;
}

const sourceIcon = { kudo: BookOpen, conan: Radar, academy: GraduationCap } as const;
const sourceLabel = { kudo: 'Kudo', conan: 'Conan', academy: 'CyberAcademy' } as const;

const statusLabel: Record<Status, string> = {
  ok: 'Cumple',
  progress: 'En progreso',
  blocked: 'Bloqueada',
  done: 'Completado',
};

const statusClass: Record<Status, string> = {
  ok: 'bg-[#4DAE84]/15 text-[#2f8a63] dark:text-[#5fc79a]',
  progress: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  blocked: 'bg-red-500/15 text-red-600 dark:text-red-400',
  done: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
};

// Feed de actividad: cada cierto tiempo entra la siguiente fila arriba, primero "analizando" y luego resuelta.
const pool: Row[] = [
  { id: 'CIP-2', source: 'kudo', title: 'Ciberseguridad en Autenticación', meta: 'ISO 27001 A.8.5', status: 'ok', time: '2m' },
  { id: '185.220.101.4', source: 'conan', title: 'Escaneo desde nodo de salida Tor', meta: 'DE · AS205100', status: 'blocked', time: '4m' },
  { id: 'THP-1', source: 'academy', title: 'Curso: Detección de phishing', meta: '18/20', status: 'done', time: '9m' },
  { id: 'ADR-2', source: 'kudo', title: 'Gestión de Vulnerabilidades', meta: 'CIS 7 · NIST ID.RA', status: 'progress', time: '12m' },
  { id: '45.155.205.33', source: 'conan', title: 'Fuerza bruta contra el VPN', meta: 'NL · AS48090', status: 'blocked', time: '15m' },
  { id: 'COR-2', source: 'kudo', title: 'Mapeo de Cumplimiento Regulatorio', meta: 'Ley 21.663', status: 'ok', time: '21m' },
  { id: 'CIP-1', source: 'kudo', title: 'Inventario de Identidad', meta: 'ISO 27001 A.5.16', status: 'progress', time: '26m' },
];

const questions = [
  {
    q: '¿Qué controles nos faltan para ISO 27001?',
    lead: 'Te faltan 3 controles críticos:',
    chips: ['ADR-2', 'CIP-1', 'THP-1'],
  },
  {
    q: '¿Quién no ha completado la capacitación?',
    lead: '2 personas de Finanzas tienen pendiente:',
    chips: ['THP-1', 'Phishing'],
  },
];

const VISIBLE_ROWS = 4;
const ROW_INTERVAL = 2800;
const ANALYZE_MS = 1200;
const TYPE_MS = 45;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);
  return reduced;
}

/**
 * Mockup animado del panel de DivisionCero para el hero (inspirado en span.app):
 * métricas, un feed en vivo que mezcla controles de Kudo, detecciones de Conan y
 * avance de CyberAcademy, y una barra de preguntas que se escribe y responde sola.
 * Es decorativo; con movimiento reducido se muestra estático.
 */
export function HeroConsole({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();

  // Índice de la fila más reciente en `pool`; las visibles son las siguientes VISIBLE_ROWS hacia atrás.
  const [head, setHead] = useState(VISIBLE_ROWS - 1);
  const [analyzing, setAnalyzing] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [typed, setTyped] = useState(0);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let analyzeTimer: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setHead((h) => (h + 1) % pool.length);
      setAnalyzing(true);
      analyzeTimer = setTimeout(() => setAnalyzing(false), ANALYZE_MS);
    }, ROW_INTERVAL);
    return () => {
      clearInterval(id);
      clearTimeout(analyzeTimer);
    };
  }, [reduced]);

  const question = questions[qIndex];
  const questionText = question.q;

  useEffect(() => {
    if (reduced) {
      setTyped(questionText.length);
      setAnswered(true);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    if (typed < questionText.length) {
      timer = setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 900 : TYPE_MS);
    } else if (!answered) {
      timer = setTimeout(() => setAnswered(true), 700);
    } else {
      timer = setTimeout(() => {
        setAnswered(false);
        setTyped(0);
        setQIndex((i) => (i + 1) % questions.length);
      }, 4500);
    }
    return () => clearTimeout(timer);
  }, [typed, answered, questionText, reduced]);

  const rows = Array.from({ length: VISIBLE_ROWS }, (_, i) => pool[(head - i + pool.length) % pool.length]);
  const blocked = 1284 + head * 3;

  return (
    <div
      aria-hidden="true"
      className={`relative w-full max-w-4xl mx-auto rounded-2xl border border-fd-border bg-fd-card/80 backdrop-blur-md shadow-2xl shadow-[#4DAE84]/10 text-left overflow-hidden ${className ?? ''}`}
    >
      {/* Barra de ventana */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-fd-border bg-fd-muted/40">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-fd-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-fd-muted-foreground/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-fd-muted-foreground/30" />
        </div>
        <span className="text-xs font-medium text-fd-muted-foreground truncate">Postura de Ciberseguridad</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-[#4DAE84]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#4DAE84] opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4DAE84]" />
          </span>
          En vivo
        </span>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 divide-x divide-fd-border border-b border-fd-border">
        <Metric label="Cumplimiento Kudo" value="72%" bar={72} />
        <Metric label="Amenazas bloqueadas" value={String(blocked)} />
        <Metric label="Personas capacitadas" value="18/20" bar={90} />
      </div>

      {/* Feed */}
      <ul className="divide-y divide-fd-border">
        {rows.map((row, i) => {
          const Icon = sourceIcon[row.source];
          const pending = i === 0 && analyzing;
          return (
            <li
              key={`${row.id}-${head - i}`}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm ${i === 0 && !reduced ? 'motion-safe:animate-[hero-row-in_0.5s_ease-out]' : ''}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#4DAE84]/10">
                <Icon className="h-3.5 w-3.5 text-[#4DAE84]" />
              </span>
              <span className="hidden sm:inline font-mono text-xs text-fd-muted-foreground w-28 shrink-0 truncate">{row.id}</span>
              <span className="min-w-0 flex-1 truncate font-medium">{row.title}</span>
              <span className="hidden md:inline text-xs text-fd-muted-foreground shrink-0">
                {sourceLabel[row.source]} · {row.meta}
              </span>
              {pending ? (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-fd-muted-foreground bg-fd-muted shrink-0">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Analizando…
                </span>
              ) : (
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${statusClass[row.status]}`}>
                  {statusLabel[row.status]}
                </span>
              )}
              <span className="hidden sm:inline w-10 text-right text-xs text-fd-muted-foreground shrink-0">
                {i === 0 ? 'ahora' : row.time}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Barra de preguntas */}
      <div className="border-t border-fd-border p-3 sm:p-4 bg-fd-muted/30">
        <div
          className={`mb-3 flex flex-wrap items-center gap-2 text-sm transition-all duration-500 ${answered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
        >
          <Sparkles className="h-4 w-4 text-[#4DAE84] shrink-0" />
          <span className="text-fd-muted-foreground">{question.lead}</span>
          {question.chips.map((chip) => (
            <span key={chip} className="rounded-md border border-fd-border bg-fd-background px-1.5 py-0.5 font-mono text-xs">
              {chip}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-fd-border bg-fd-background px-3 py-2">
          <span className="min-w-0 flex-1 truncate text-sm">
            {typed === 0 ? (
              <span className="text-fd-muted-foreground">Pregunta lo que quieras</span>
            ) : (
              <>
                {questionText.slice(0, typed)}
                {!answered && <span className="ml-px inline-block h-4 w-px translate-y-0.5 bg-fd-foreground motion-safe:animate-pulse" />}
              </>
            )}
          </span>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4DAE84] text-white">
            <ArrowUp className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, bar }: { label: string; value: string; bar?: number }) {
  return (
    <div className="px-3 py-3 sm:px-4">
      <p className="text-[11px] sm:text-xs text-fd-muted-foreground truncate">{label}</p>
      <p className="mt-1 text-lg sm:text-2xl font-bold tabular-nums">{value}</p>
      {bar !== undefined && (
        <div className="mt-2 h-1 rounded-full bg-fd-muted overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[#4DAE84] to-[#39b298]" style={{ width: `${bar}%` }} />
        </div>
      )}
    </div>
  );
}
