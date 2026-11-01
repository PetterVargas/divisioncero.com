'use client';

import { useEffect, useId, useState } from 'react';
import type { ComponentProps } from 'react';
import { Check, Copy } from 'lucide-react';
import { baseUrl } from '@/lib/shared';

/** Logo de ChatGPT (OpenAI), en `currentColor` para que siga el tema claro u oscuro. */
function ChatGPTIcon(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

/** Logo de Anthropic (Claude), en `currentColor`. */
function AnthropicIcon(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" />
    </svg>
  );
}

/** Logo de Gemini (Google), con su degradado azul-violeta. */
function GeminiIcon(props: ComponentProps<'svg'>) {
  const id = useId();
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <defs>
        <linearGradient id={id} x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1C7DFF" />
          <stop offset="0.52" stopColor="#1C69FF" />
          <stop offset="1" stopColor="#A87FFE" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"
      />
    </svg>
  );
}

// Avatares superpuestos de agentes de IA a los que se puede pegar el prompt.
const agents = [
  { Icon: AnthropicIcon, className: 'bg-[#D97757] text-white' },
  { Icon: GeminiIcon, className: 'bg-fd-background' },
  { Icon: ChatGPTIcon, className: 'bg-fd-background text-fd-foreground' },
];

/**
 * Píldora del hero que copia al portapapeles un prompt para preguntarle a un
 * agente de IA por DivisionCero, apuntando al `llms.txt` del sitio.
 */
export function AskAgent({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    const prompt = `Lee ${`${baseUrl}/llms.txt`} y explícame qué es DivisionCero, qué ofrece (CyberAcademy, Kudo, Conan y Herramientas) y cómo puede ayudar a mejorar la Ciberseguridad de mi empresa.`;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
    } catch {
      // Sin permiso de portapapeles: no hay nada útil que mostrar.
    }
  }

  return (
    <div
      className={`inline-flex max-w-full items-center gap-2 sm:gap-3 rounded-full border border-fd-border bg-fd-card/80 backdrop-blur-sm p-1 pl-3 min-[360px]:pl-1.5 shadow-sm ${className ?? ''}`}
    >
      <div className="hidden min-[360px]:flex shrink-0 -space-x-2" aria-hidden="true">
        {agents.map(({ Icon, className: avatarClass }, i) => (
          <span
            key={i}
            className={`flex h-7 w-7 items-center justify-center rounded-full border border-fd-border ring-2 ring-fd-card ${avatarClass}`}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
        ))}
      </div>
      <span className="whitespace-nowrap text-xs sm:text-sm font-medium text-fd-foreground">Pregúntale a tu agente</span>
      <button
        type="button"
        onClick={copy}
        title="Copia un prompt para preguntarle a tu agente de IA por DivisionCero"
        className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-fd-border bg-fd-background px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-fd-foreground hover:bg-fd-muted transition-colors"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-[#4DAE84]" /> : <Copy className="h-3.5 w-3.5" />}
        <span aria-live="polite">{copied ? '¡Copiado!' : 'Copiar prompt'}</span>
      </button>
    </div>
  );
}
