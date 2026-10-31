'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/herramientas/ui/card';
import type { ComparisonItem } from '../_lib/comparisons';
import { useToolT, useTranslated } from '@/lib/herramientas/i18n/use-tool-t';
import { en } from '../i18n';

function ComparisonGrid({ items }: { items: ComparisonItem[] }) {
  const t = useToolT(en);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className={`text-base ${item.color}`}>{item.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">{item.definition}</p>

            <div>
              <p className="text-foreground text-xs font-semibold">{t('Ejemplo')}</p>
              <p className="text-muted-foreground">{item.example}</p>
            </div>

            <div>
              <p className="text-foreground text-xs font-semibold">{t('Cuándo usarlo')}</p>
              <p className="text-muted-foreground">{item.whenToUse}</p>
            </div>

            <div>
              <p className="text-foreground text-xs font-semibold">{t('Riesgo principal')}</p>
              <p className="text-muted-foreground">{item.risk}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ComparisonCards({
  title,
  items,
}: {
  title: string;
  items: ComparisonItem[];
}) {
  const t = useToolT(en);
  const translatedItems = useTranslated(items, en);
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t(title)}</h3>
      <ComparisonGrid items={translatedItems} />
    </div>
  );
}
