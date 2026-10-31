'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from '@/lib/herramientas/i18n/config';
import type { Dictionary } from '@/lib/herramientas/i18n/dictionaries/es';

const I18nContext = createContext<{ locale: Locale; dict: Dictionary } | null>(null);

/** Expone a los Client Components el idioma y el diccionario resueltos en el servidor. */
export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: ReactNode;
}) {
  return <I18nContext.Provider value={{ locale, dict }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n debe usarse dentro de <I18nProvider>');
  return value;
}
