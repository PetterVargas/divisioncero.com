import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/site-layout';

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return (
    <SiteLayout lang={lang} askAIPrompt="¿Qué es CyberAcademy de DivisionCero (divisioncero.com/cyberacademy) y qué formación en ciberseguridad ofrece, como las rutas CyberUsuario y CyberGuardián?">
      {children}
    </SiteLayout>
  );
}
