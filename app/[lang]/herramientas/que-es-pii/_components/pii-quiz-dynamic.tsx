'use client';

import dynamic from 'next/dynamic';

import { Card, CardContent } from '@/components/herramientas/ui/card';
import { useToolT } from '@/lib/herramientas/i18n/use-tool-t';
import { en } from '../i18n';

function Loading() {
  const t = useToolT(en);
  return (
    <Card>
      <CardContent className="text-muted-foreground py-12 text-center text-sm">
        {t('Cargando escenarios...')}
      </CardContent>
    </Card>
  );
}

export const PiiQuizDynamic = dynamic(() => import('./pii-quiz').then((m) => m.PiiQuiz), {
  ssr: false,
  loading: () => <Loading />,
});
