import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { LinkTitles } from '@/components/kudo/link-titles';
import { appName, appDescription, defaultOpenGraph, homeImageRoute } from '@/lib/kudo/shared';

const metadata: Metadata = {
  // `absolute` evita que el template de divisioncero.com (`%s | DivisionCero`) se aplique encima.
  title: {
    template: `%s | ${appName}`,
    absolute: 'Kudo Framework de Ciberseguridad por y para LatAm - DivisionCero',
  },
  description: appDescription,
  keywords: [
    'framework de ciberseguridad',
    'ciberseguridad LatAm',
    'SGX',
    'SGSI',
    'SGC',
    'OSCAL',
    'controles de ciberseguridad',
    'políticas de seguridad de la información',
    'DivisionCero',
    'Kudo',
  ],
  openGraph: {
    ...defaultOpenGraph,
    type: 'website',
    title: 'Kudo - Framework de Ciberseguridad por y para LatAm',
    description: appDescription,
    images: homeImageRoute,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@divisioncero',
    creator: '@divisioncero',
    title: 'Kudo - Framework de Ciberseguridad por y para LatAm',
    description: appDescription,
    images: homeImageRoute,
  },
  robots: {
    googleBot: {
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

const enTitle = 'Kudo - Cybersecurity Framework by and for LatAm';
const enDescription =
  "Kudo is LatAm's open cybersecurity framework: SGX, 35 controls adapted to OSCAL and 25+ policy templates ready to implement.";

export async function generateMetadata(props: LayoutProps<'/[lang]/kudo'>): Promise<Metadata> {
  const { lang } = await props.params;
  if (lang !== 'en') return metadata;
  return {
    ...metadata,
    title: { template: `%s | ${appName}`, absolute: 'Kudo Cybersecurity Framework by and for LatAm - DivisionCero' },
    description: enDescription,
    openGraph: { ...metadata.openGraph, title: enTitle, description: enDescription, locale: 'en_US' },
    twitter: { ...metadata.twitter, title: enTitle, description: enDescription },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <LinkTitles />
      {children}
    </>
  );
}
