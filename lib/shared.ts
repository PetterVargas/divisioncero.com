import type { Metadata } from 'next';

export const appName = 'DivisionCero';

export const appDescription = 'Simplificando juntos la Ciberseguridad de LatAm';

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://divisioncero.com';

export const principalWebsiteUtm = 'utm_source=divisioncero.com&utm_medium=text_link&utm_campaign=principal_website';

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

/**
 * Builds consistent canonical + Open Graph + Twitter Card metadata for a static page.
 * Pages that don't pass `images` inherit the site-wide default from app/opengraph-image.tsx.
 */
export function pageMetadata({
  path,
  title,
  description,
  images,
  type = 'website',
}: {
  path: string;
  title: string;
  description: string;
  images?: string;
  type?: 'website' | 'article';
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      url: `${baseUrl}${path}`,
      type,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      ...(images ? { images } : {}),
    },
  };
}
