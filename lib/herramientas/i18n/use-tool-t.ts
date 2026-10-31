'use client';

import { useMemo } from 'react';
import { useI18n } from '@/components/herramientas/i18n-provider';
import { getT, type Dictionary } from '@/lib/site-translations';
import { en as common } from './common';

/**
 * Traductor para el interior de una herramienta. Igual que en el resto del sitio, la clave es
 * el texto en español y `en` declara su traducción; si falta, se muestra el español.
 */
export function useToolT(en: Dictionary) {
  const { locale } = useI18n();
  return getT(locale, { ...common, ...en });
}

/** Elige la versión de unos datos (listas, fichas didácticas) según el idioma activo. */
export function useLocalized<T>(data: { es: T; en: T }): T {
  const { locale } = useI18n();
  return locale === 'en' ? data.en : data.es;
}

/**
 * Traduce en profundidad las cadenas de unos datos (arrays/objetos definidos a nivel de módulo
 * en español). Solo cambia las cadenas presentes en el diccionario; ids y claves no se tocan.
 */
export function translateDeep<T>(value: T, t: (text: string) => string): T {
  if (typeof value === 'string') return t(value) as T;
  if (Array.isArray(value)) return value.map((item) => translateDeep(item, t)) as T;
  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) out[key] = translateDeep(item, t);
    return out as T;
  }
  return value;
}

/** `translateDeep` memorizado con el traductor de la herramienta. */
export function useTranslated<T>(value: T, en: Dictionary): T {
  const { locale } = useI18n();
  return useMemo(() => (locale === 'es' ? value : translateDeep(value, getT(locale, en))), [value, en, locale]);
}
