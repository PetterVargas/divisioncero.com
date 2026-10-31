import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { appName, academyUrl, academyRoute, baseUrl, homeImageRoute, rssAlternateTypes } from '@/lib/cyberacademy/shared';
import { localizeUrl } from '@/lib/i18n';
import { JsonLd, organizationJsonLd } from '@/lib/cyberacademy/json-ld';

const title = 'CyberAcademy: cursos de Ciberseguridad gratis en español';
const description = 'Aprende Ciberseguridad gratis en español con el Kudo Framework de DivisionCero: cursos para CyberUsuarios y CyberGuardianes cubriendo identidad, infraestructura, aplicaciones, datos e IA, y respuesta a incidentes.';

const metadata: Metadata = {
  // `absolute` evita que el template de divisioncero.com (`%s | DivisionCero`) se aplique encima.
  title: {
    absolute: title,
    template: `%s | ${appName}`,
  },
  description,
  keywords: [
    'ciberseguridad',
    'ciberseguridad en español',
    'cursos de ciberseguridad',
    'ciberseguridad LatAm',
    'CyberAcademy',
    'DivisionCero',
    'Kudo Framework',
    'CyberUsuario',
    'CyberGuardian',
    'seguridad de la información',
    'seguridad informática',
    'phishing',
    'seguridad de identidad',
    'seguridad de infraestructura',
    'seguridad de aplicaciones',
    'continuidad del negocio',
    'respuesta a incidentes',
    'seguridad de datos e inteligencia artificial',
    'cursos gratis de ciberseguridad',
  ],
  openGraph: {
    title,
    description,
    siteName: appName,
    url: academyUrl,
    type: 'website',
    locale: 'es_419',
    images: homeImageRoute,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@divisioncero',
    title,
    description,
    images: homeImageRoute,
  },
  alternates: {
    canonical: academyUrl,
    types: rssAlternateTypes,
  },
};

const enTitle = 'CyberAcademy: free cybersecurity courses in Spanish';
const enDescription =
  "Learn cybersecurity for free in Spanish with DivisionCero's Kudo Framework: courses for CyberUsuarios and CyberGuardianes covering identity, infrastructure, applications, data and AI, and incident response.";

export async function generateMetadata(props: LayoutProps<'/[lang]/cyberacademy'>): Promise<Metadata> {
  const { lang } = await props.params;
  if (lang !== 'en') return metadata;
  const url = `${baseUrl}${localizeUrl(academyRoute, lang)}`;
  return {
    ...metadata,
    title: { absolute: enTitle, template: `%s | ${appName}` },
    description: enDescription,
    openGraph: { ...metadata.openGraph, title: enTitle, description: enDescription, url, locale: 'en_US' },
    twitter: { ...metadata.twitter, title: enTitle, description: enDescription },
    alternates: { ...metadata.alternates, canonical: url },
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      {children}
    </>
  );
}
