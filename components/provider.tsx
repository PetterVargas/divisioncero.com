'use client';
import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { uiTranslations } from '@/lib/ui-translations';
import type { ReactNode } from 'react';

const i18n = { locale: 'es', translations: uiTranslations };

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider search={{ SearchDialog }} i18n={i18n}>
      {children}
    </RootProvider>
  );
}
