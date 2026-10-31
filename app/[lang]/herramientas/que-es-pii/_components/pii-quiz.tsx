'use client';

import { useState } from 'react';
import { CircleHelp, RotateCcw, ShieldOff, UserRoundSearch } from 'lucide-react';

import { Badge } from '@/components/herramientas/ui/badge';
import { Button } from '@/components/herramientas/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/herramientas/ui/card';
import { cn } from '@/lib/herramientas/utils';

import { categories as categoriesBase } from '../_lib/categories';
import { scenarios as scenariosBase } from '../_lib/scenarios';
import { useToolT, useTranslated } from '@/lib/herramientas/i18n/use-tool-t';
import { en } from '../i18n';

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

const categoryBadgeVariant = {
  directa: 'info',
  indirecta: 'warning',
  sensible: 'destructive',
} as const;

export function PiiQuiz() {
  const t = useToolT(en);
  const categories = useTranslated(categoriesBase, en);
  const scenarios = useTranslated(scenariosBase, en);
  // Este componente se carga con next/dynamic({ ssr: false }), así que solo
  // se renderiza en el cliente: es seguro barajar con Math.random() en el
  // estado inicial sin riesgo de mismatch de hidratación.
  const [order, setOrder] = useState(() => shuffle(scenarios));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const handleRestart = () => {
    setOrder(shuffle(scenarios));
    setIndex(0);
    setAnswer(null);
    setScore(0);
  };

  if (index >= order.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('¡Práctica completada!')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            {t('Identificaste correctamente')} <span className="font-bold">{score}</span> de{' '}
            <span className="font-bold">{order.length}</span> escenarios.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRestart} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const scenario = order[index];
  const isLast = index === order.length - 1;
  const answered = answer !== null;
  const isCorrect = answered && answer === scenario.isPii;
  const category = scenario.category ? categories.find((c) => c.id === scenario.category) : undefined;

  const handleAnswer = (saysPii: boolean) => {
    if (answered) return;
    setAnswer(saysPii);
    if (saysPii === scenario.isPii) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setIndex((i) => i + 1);
    setAnswer(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-normal text-muted-foreground">
          {t('Escenario {n} de {total}', { n: index + 1, total: order.length })}
        </CardTitle>
        <span className="text-sm font-semibold">
          {t('Puntaje: {score}/{total}', { score: score, total: order.length })}
        </span>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted flex items-start gap-3 rounded-lg p-6">
          <CircleHelp className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-lg leading-relaxed font-medium">{scenario.text}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className={cn(
              answered && scenario.isPii && 'border-green-500 bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-400',
              answered && answer === true && !scenario.isPii && 'border-red-500 bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-400',
            )}
            disabled={answered}
            onClick={() => handleAnswer(true)}
            data-test="answer-pii"
          >
            <UserRoundSearch className="mr-2 h-4 w-4" />
            {t('Es PII')}
          </Button>
          <Button
            variant="outline"
            className={cn(
              answered && !scenario.isPii && 'border-green-500 bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-400',
              answered && answer === false && scenario.isPii && 'border-red-500 bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-400',
            )}
            disabled={answered}
            onClick={() => handleAnswer(false)}
            data-test="answer-no-pii"
          >
            <ShieldOff className="mr-2 h-4 w-4" />
            {t('No es PII')}
          </Button>
        </div>

        {answered && (
          <div
            className={cn(
              'rounded-lg border-2 p-4 text-sm',
              isCorrect
                ? 'border-green-500 bg-green-50 dark:bg-green-950/50'
                : 'border-red-500 bg-red-50 dark:bg-red-950/50',
            )}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="font-semibold">{isCorrect ? t('¡Correcto!') : t('No exactamente.')}</p>
              {category && (
                <Badge variant={categoryBadgeVariant[category.id]}>{category.name}</Badge>
              )}
            </div>
            <p className="text-muted-foreground">{scenario.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-3">
        {answered && (
          <Button onClick={handleNext}>{isLast ? t('Ver resultados') : t('Siguiente escenario')}</Button>
        )}
        <Button onClick={handleRestart} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          {t('Reiniciar')}
        </Button>
      </CardFooter>
    </Card>
  );
}
