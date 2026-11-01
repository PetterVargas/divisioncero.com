import type { Metadata } from 'next';
import { appDescription, homeImageRoute, defaultOpenGraph, kudoRoute } from '@/lib/kudo/shared';
import { HomeContent } from './home-content';

export function generateMetadata(): Metadata {
  const url = kudoRoute;
  const title = 'Kudo - Framework de Ciberseguridad por y para LatAm';
  const description = appDescription;

  return {
    title: {
      absolute: 'Kudo Framework de Ciberseguridad por y para LatAm - DivisionCero',
    },
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...defaultOpenGraph,
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
