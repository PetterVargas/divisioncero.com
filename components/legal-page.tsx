import type { ReactNode } from 'react';

export function LegalPage({
  title,
  subtitle,
  effectiveDate,
  children,
}: {
  title: string;
  subtitle: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <main className="grow w-full max-w-(--fd-layout-width) mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3">{title}</h1>
        <p className="text-lg text-fd-muted-foreground mb-2">{subtitle}</p>
        <p className="text-sm text-fd-muted-foreground/70">Vigente desde: {effectiveDate}</p>
      </div>
      <article className="max-w-3xl mx-auto prose">{children}</article>
    </main>
  );
}
