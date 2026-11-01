'use client';

import dynamic from 'next/dynamic';

import { Card, CardContent } from '@/components/herramientas/ui/card';

function Loading() {
  return (
    <Card>
      <CardContent className="text-muted-foreground py-12 text-center text-sm">
        Cargando situaciones...
      </CardContent>
    </Card>
  );
}

export const SextortionQuizDynamic = dynamic(() => import('./sextortion-quiz').then((m) => m.SextortionQuiz), {
  ssr: false,
  loading: () => <Loading />,
});
