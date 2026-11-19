'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

const COMMANDS = {
  pnpm: 'pnpm create @divisioncero/kudo-app',
  npm: 'npm create @divisioncero/kudo-app@latest',
  yarn: 'yarn create @divisioncero/kudo-app',
} as const;

type PackageManager = keyof typeof COMMANDS;

/** Comando de instalación rápida de Kudo con selector de gestor de paquetes y botón de copiar. */
export function InstallCommand({ className = '' }: { className?: string }) {
  const [pm, setPm] = useState<PackageManager>('pnpm');
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const command = COMMANDS[pm];

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permiso de portapapeles: el comando sigue visible para copiarlo a mano.
    }
  };

  return (
    <div className={`w-full max-w-xl mx-auto ${className}`}>
      <div className="flex items-center justify-center gap-1 mb-2" role="tablist" aria-label="Gestor de paquetes">
        {(Object.keys(COMMANDS) as PackageManager[]).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={pm === key}
            onClick={() => setPm(key)}
            className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
              pm === key
                ? 'bg-fd-muted text-fd-foreground'
                : 'text-fd-muted-foreground hover:text-fd-foreground'
            }`}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-fd-border bg-fd-card/70 backdrop-blur-sm pl-4 pr-2 py-2.5 text-left shadow-sm">
        <Terminal className="h-4 w-4 shrink-0 text-[#4DAE84]" aria-hidden="true" />
        <code className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap font-mono text-sm text-fd-foreground [scrollbar-width:none]">
          {command}
        </code>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-md text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground transition-colors"
          aria-label={copied ? 'Comando copiado' : 'Copiar comando de instalación'}
          title={copied ? 'Copiado' : 'Copiar'}
        >
          {copied ? <Check className="h-4 w-4 text-[#4DAE84]" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <p className="mt-2 text-xs text-fd-muted-foreground">
        Instalación rápida · Node.js 20+ ·{' '}
        <a href="/kudo/sgx/aprovisionamiento" className="underline underline-offset-2 hover:text-fd-foreground">
          guía de aprovisionamiento
        </a>
      </p>
    </div>
  );
}
