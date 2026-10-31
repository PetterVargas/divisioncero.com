/** Header con el que las herramientas indican a sus APIs el idioma de la página. */
export const LOCALE_HEADER = 'x-locale';

export type ApiLocale = 'es' | 'en';

export function requestLocale(request: Request): ApiLocale {
  return request.headers.get(LOCALE_HEADER) === 'en' ? 'en' : 'es';
}

/** Mensaje de una API en el idioma pedido. */
export function msg(locale: ApiLocale, es: string, en: string): string {
  return locale === 'en' ? en : es;
}
