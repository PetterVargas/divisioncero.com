import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/site-layout';

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <SiteLayout lang={lang} askAIPrompt="¿Qué es el Framework Kudo de DivisionCero (divisioncero.com/kudo) y cómo ayuda a una organización a implementar y gestionar su programa de ciberseguridad?">
      {children}
    </SiteLayout>
  );
}
