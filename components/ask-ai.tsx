'use client';
import { ExternalLink } from 'lucide-react';
import { useT } from '@/components/i18n';

/**
 * Sección "Pregúntale a la IA" del footer: abre ChatGPT, Claude o Google (AI Mode)
 * con una pregunta inicial sobre DivisionCero específica de cada proyecto.
 */
const providers = [
  { name: 'ChatGPT', url: (q: string) => `https://chatgpt.com/?q=${q}` },
  { name: 'Claude', url: (q: string) => `https://claude.ai/new?q=${q}` },
  { name: 'Google', url: (q: string) => `https://www.google.com/search?udm=50&q=${q}` },
];

export function AskAI({ prompt }: { prompt: string }) {
  const t = useT();
  const q = encodeURIComponent(prompt);
  return (
    <div className="mt-10 border-t pt-6 flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
      <h3 className="font-bold text-sm">{t('Pregúntale a la IA')}</h3>
      <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
        {providers.map(({ name, url }) => (
          <li key={name}>
            <a
              href={url(q)}
              title={t('Pregúntale a {name} sobre DivisionCero', { name })}
              className="text-sm hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('Pregúntale a')} <b>{name}</b> {t('sobre DivisionCero')}
              <ExternalLink className="ml-1 inline-block size-3.5 align-[-0.125em]" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
