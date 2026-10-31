import type { Metadata } from 'next';
import { appDescription, homeImageRoute, defaultOpenGraph, kudoRoute } from '@/lib/kudo/shared';
import { localizeUrl } from '@/lib/i18n';
import { getT, type Dictionary } from '@/lib/site-translations';
import { HomeContent } from './home-content';

const en: Dictionary = {
  'Kudo Framework de Ciberseguridad por y para LatAm - DivisionCero': 'Kudo Cybersecurity Framework by and for LatAm - DivisionCero',
  'Kudo - Framework de Ciberseguridad por y para LatAm': 'Kudo - Cybersecurity Framework by and for LatAm',
  [appDescription]:
    "Kudo is LatAm's open cybersecurity framework: SGX, 35 controls adapted to OSCAL and 25+ policy templates ready to implement.",
};

export async function generateMetadata(props: PageProps<'/[lang]/kudo'>): Promise<Metadata> {
  const { lang } = await props.params;
  const t = getT(lang, en);
  const url = localizeUrl(kudoRoute, lang);
  const title = t('Kudo - Framework de Ciberseguridad por y para LatAm');
  const description = t(appDescription);

  return {
    title: {
      absolute: t('Kudo Framework de Ciberseguridad por y para LatAm - DivisionCero'),
    },
    description,
    alternates: {
      canonical: url,
      languages: { es: kudoRoute, en: localizeUrl(kudoRoute, 'en'), 'x-default': kudoRoute },
    },
    openGraph: {
      ...defaultOpenGraph,
      locale: lang === 'en' ? 'en_US' : defaultOpenGraph.locale,
      type: 'website',
      url,
      title,
      description,
      images: {
        url: homeImageRoute,
        width: 1200,
        height: 630,
        alt: title,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function HomePage() {
  return <HomeContent />;
}
