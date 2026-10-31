'use client';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { CheckIcon, ChevronDownIcon, LanguagesIcon } from 'lucide-react';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from 'fumadocs-ui/components/ui/popover';
import { cn } from '@/lib/cn';
import { getT, type Dictionary } from '@/lib/site-translations';
import { defaultLocale, localizeUrl } from '@/lib/i18n';

/** Traduce un texto en español al idioma activo (ver `lib/site-translations.ts`). */
export function useT(extra?: Dictionary) {
  const { locale } = useI18n();
  return getT(locale ?? defaultLocale, extra);
}

/** Prefija una ruta interna con el idioma activo (`/kudo` → `/en/kudo`). */
export function useLocalizeUrl() {
  const { locale } = useI18n();
  return (url: string) => localizeUrl(url, locale ?? defaultLocale);
}

/** Versión en componente de `useT()`, útil en configuraciones que se renderizan en el servidor. */
export function T({ children }: { children: string }) {
  return useT()(children);
}

/** Selector de idioma del footer; usa los idiomas y el cambio de idioma de Fumadocs. */
export function LanguageSelect() {
  const { locale, locales = [], onChange } = useI18n();
  const label = useT()('Elige un idioma');
  const current = locales.find((item) => item.locale === locale);

  return (
    <Popover>
      <PopoverTrigger
        aria-label={label}
        title={label}
        className="inline-flex items-center gap-1.5 rounded-md border bg-fd-background px-2 py-1 text-xs text-fd-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
      >
        <LanguagesIcon className="size-4 text-fd-muted-foreground" aria-hidden="true" />
        {current?.name ?? locale}
        <ChevronDownIcon className="size-3 text-fd-muted-foreground" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent align="start" className="flex min-w-32 flex-col p-1">
        <p className="px-2 py-1.5 text-xs font-medium text-fd-muted-foreground">{label}</p>
        {locales.map((item) => {
          const active = item.locale === locale;
          return (
            <PopoverClose
              key={item.locale}
              aria-current={active ? 'true' : undefined}
              onClick={() => {
                if (!active) onChange?.(item.locale);
              }}
              className={cn(
                'flex items-center justify-between gap-4 rounded-md px-2 py-1.5 text-start text-sm transition-colors',
                active
                  ? 'bg-fd-primary/10 font-medium text-fd-primary'
                  : 'text-fd-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
              )}
            >
              {item.name}
              {active && <CheckIcon className="size-3.5" aria-hidden="true" />}
            </PopoverClose>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
