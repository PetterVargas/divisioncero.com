import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/site-layout';

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <SiteLayout askAIPrompt="¿Qué es CyberAcademy de DivisionCero (divisioncero.com/cyberacademy) y qué formación en ciberseguridad ofrece, como las rutas CyberUsuario y CyberGuardián?">
      {children}
    </SiteLayout>
  );
}
