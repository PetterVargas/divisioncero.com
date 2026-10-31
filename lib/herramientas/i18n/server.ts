import { hasLocale, defaultLocale, type Locale } from './config';
import { es } from './dictionaries/es';
import { en } from './dictionaries/en';

const dictionaries = { es, en };

/** Idioma de la ruta (`/herramientas` o `/en/herramientas`), resuelto por `proxy.ts`. */
export function toLocale(lang: string): Locale {
  return hasLocale(lang) ? lang : defaultLocale;
}

export function getDictionary(lang: string) {
  return dictionaries[toLocale(lang)];
}
