import type { Metadata } from 'next';

export const appName = 'DivisionCero';

export const appDescription = 'Simplificando juntos la Ciberseguridad de LatAm';

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://divisioncero.com';

export const cyberacademyRoute = '/docs/cyberacademy';
export const cyberacademyImageRoute = '/og/cyberacademy';
export const cyberacademyContentRoute = '/llms.mdx/cyberacademy';

export const ciberseguridadEmpresarialRoute = '/docs/ciberseguridad-empresarial';
export const ciberseguridadEmpresarialImageRoute = '/og/ciberseguridad-empresarial';
export const ciberseguridadEmpresarialContentRoute = '/llms.mdx/ciberseguridad-empresarial';

export const blogImageRoute = '/og/blog';
export const releasesImageRoute = '/og/releases';

export const gitConfig = {
  user: 'PetterVargas',
  repo: 'divisioncero-docs',
  branch: 'main',
};

export const rssAlternateTypes = {
  'application/rss+xml': [{ title: appName, url: `${baseUrl}/rss.xml` }],
};

/**
 * Builds consistent canonical + Open Graph + Twitter Card metadata for a page.
 * Pages that don't pass `images` inherit the site-wide default from app/opengraph-image.tsx.
 *
 * Next.js reemplaza `alternates`, `openGraph` y `twitter` completos por segmento
 * (no los fusiona con el layout), así que aquí se repiten title/description,
 * siteName/locale y el feed RSS para que no se pierdan.
 */
export function pageMetadata({
  path,
  title,
  description,
  images,
  type = 'website',
  publishedTime,
  authors,
  robots,
}: {
  path: string;
  title: string;
  description?: string;
  images?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
  robots?: Metadata['robots'];
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
      types: rssAlternateTypes,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${path}`,
      siteName: appName,
      locale: 'es_419',
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@divisioncero',
      title,
      description,
      ...(images ? { images } : {}),
    },
    ...(robots ? { robots } : {}),
  };
}

export const cookieConsentKey = 'dc-cookie-consent';
