export const locales = ['es', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

export const localeNames: Record<Locale, string> = {
  es: 'Español',
  en: 'English',
};

export const hasLocale = (value: string | undefined | null): value is Locale =>
  !!value && (locales as readonly string[]).includes(value);

/**
 * Elige el primer idioma soportado de un header `Accept-Language`
 * (ej. "en-US,en;q=0.9,es;q=0.8"), respetando los pesos `q`.
 */
export function matchAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return defaultLocale;

  const preferred = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return { lang: tag.trim().toLowerCase().split('-')[0], q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter(({ q }) => !Number.isNaN(q) && q > 0)
    .sort((a, b) => b.q - a.q);

  const match = preferred.find(({ lang }) => hasLocale(lang));
  return match ? (match.lang as Locale) : defaultLocale;
}
