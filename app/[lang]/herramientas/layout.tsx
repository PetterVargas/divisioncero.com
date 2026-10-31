import type { Metadata } from 'next';
import { SiteLayout } from '@/components/site-layout';
import { I18nProvider } from '@/components/herramientas/i18n-provider';
import { Toaster } from '@/components/herramientas/ui/sonner';
import { getDictionary, toLocale } from '@/lib/herramientas/i18n/server';
import { toolsImage } from '@/lib/herramientas/seo';
import { localizeUrl } from '@/lib/i18n';

export async function generateMetadata(props: LayoutProps<'/[lang]/herramientas'>): Promise<Metadata> {
  const { lang } = await props.params;
  const { meta } = getDictionary(lang);
  const url = localizeUrl('/herramientas', lang);

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
}

/** Herramientas de Ciberseguridad (antes herramientas.divisioncero.com). */
export default async function Layout({ children, params }: LayoutProps<'/[lang]/herramientas'>) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return (
    <SiteLayout lang={lang} askAIPrompt={dict.footer.askAi.prompt}>
      <I18nProvider locale={toLocale(lang)} dict={dict}>
        <Toaster position="top-center" />
        <div className="flex flex-1 flex-col">{children}</div>
      </I18nProvider>
    </SiteLayout>
  );
}
