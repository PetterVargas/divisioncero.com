'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';

import { Button } from '@/components/herramientas/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/herramientas/ui/card';
import { cn } from '@/lib/herramientas/utils';

import { pillars as pillarsBase, type Pillar } from '../_lib/pillars';
import { scenarios as scenariosBase } from '../_lib/scenarios';
import { useToolT, useTranslated } from '@/lib/herramientas/i18n/use-tool-t';
import { en } from '../i18n';

function sameSet(a: Pillar[], b: Pillar[]) {
  if (a.length !== b.length) return false;
  const setB = new Set(b);
  return a.every((p) => setB.has(p));
}

export function CiaQuiz() {
  const t = useToolT(en);
  const pillars = useTranslated(pillarsBase, en);
  const scenarios = useTranslated(scenariosBase, en);
  const [order] = useState(() => [...scenarios].sort(() => Math.random() - 0.5));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<Pillar[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const scenario = order[index];
  const isLast = index === order.length - 1;
  const isCorrect = useMemo(
    () => submitted && sameSet(selected, scenario.pillars),
    [submitted, selected, scenario],
  );

  const togglePillar = (pillar: Pillar) => {
    if (submitted) return;
    setSelected((prev) =>
      prev.includes(pillar) ? prev.filter((p) => p !== pillar) : [...prev, pillar],
    );
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;
    setSubmitted(true);
    if (sameSet(selected, scenario.pillars)) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    setIndex((i) => i + 1);
    setSelected([]);
    setSubmitted(false);
  };

  const handleRestart = () => {
    setIndex(0);
    setSelected([]);
    setSubmitted(false);
    setScore(0);
  };

  if (index >= order.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('¡Quiz completado!')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Obtuviste <span className="font-bold">{score}</span> de{' '}
            <span className="font-bold">{order.length}</span> escenarios correctos.
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-normal text-muted-foreground">
          {t('Escenario {n} de {total}', { n: index + 1, total: order.length })}
        </CardTitle>
        <span className="text-sm font-semibold">
          {t('Puntaje: {score}/{total}', { score, total: order.length })}
        </span>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted rounded-lg p-6">
          <p className="text-lg leading-relaxed font-medium">{scenario.text}</p>
        </div>

        <div>
          <p className="text-muted-foreground mb-3 text-sm">
            {t('¿Qué pilar(es) de la tríada CIA se ven afectados? (selecciona uno o más)')}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {pillars.map((pillar) => {
              const isSelected = selected.includes(pillar.id);
              const isRight = submitted && scenario.pillars.includes(pillar.id);
              const isWrongPick = submitted && isSelected && !scenario.pillars.includes(pillar.id);

              return (
                <button
                  key={pillar.id}
                  onClick={() => togglePillar(pillar.id)}
                  disabled={submitted}
                  data-test={`quiz-option-${pillar.id}`}
                  className={cn(
                    'rounded-lg border-2 p-4 text-left transition-all',
                    !submitted && isSelected && `${pillar.ring} ring-2 border-transparent`,
                    !submitted && !isSelected && 'border-border hover:bg-muted',
                    isRight && 'border-green-500 bg-green-100 dark:bg-green-950',
                    isWrongPick && 'border-red-500 bg-red-100 dark:bg-red-950',
                    submitted && !isSelected && !isRight && 'border-border opacity-60',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn('font-semibold', pillar.color)}>{pillar.name}</span>
                    {isRight && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    {isWrongPick && <XCircle className="h-4 w-4 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {submitted && (
          <div
            className={cn(
              'rounded-lg border-2 p-4 text-sm',
              isCorrect
                ? 'border-green-500 bg-green-50 dark:bg-green-950/50'
                : 'border-red-500 bg-red-50 dark:bg-red-950/50',
            )}
          >
            <p className="mb-1 font-semibold">{isCorrect ? t('¡Correcto!') : t('No del todo.')}</p>
            <p className="text-muted-foreground">{scenario.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="gap-3">
        {!submitted ? (
          <Button onClick={handleSubmit} disabled={selected.length === 0}>
            {t('Comprobar respuesta')}
          </Button>
        ) : (
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
