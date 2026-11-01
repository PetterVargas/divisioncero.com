import type { Metadata } from 'next';
import { SiteLayout } from '@/components/site-layout';
import { Toaster } from '@/components/herramientas/ui/sonner';
import { textos } from '@/lib/herramientas/textos';
import { toolsImage } from '@/lib/herramientas/seo';

const { meta } = textos;

export const metadata: Metadata = (() => {
  const url = '/herramientas';

  return {
    title: {
      // `absolute` evita que el template de divisioncero.com (`%s | DivisionCero`) se aplique encima.
      absolute: meta.siteName,
      template: '%s · DivisionCero',
    },
    description: meta.siteDescription,
    keywords: meta.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: meta.ogLocale,
      url,
      siteName: meta.siteName,
      title: meta.siteName,
      description: meta.siteDescription,
      images: toolsImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.siteName,
      description: meta.siteDescription,
      images: toolsImage,
    },
  };
})();

/** Herramientas de Ciberseguridad (antes herramientas.divisioncero.com). */
export default function Layout({ children }: LayoutProps<'/herramientas'>) {
  return (
    <SiteLayout askAIPrompt={textos.footer.askAi.prompt}>
      <Toaster position="top-center" />
      <div className="flex flex-1 flex-col">{children}</div>
    </SiteLayout>
  );
}
