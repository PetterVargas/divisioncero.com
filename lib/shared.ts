import type { Metadata } from 'next';

export const appName = 'DivisionCero';

export const appDescription = 'Simplificando juntos la Ciberseguridad de LatAm';

const whatsappNumber = '573046307327';

export function whatsappUrl(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://divisioncero.com';

export const cyberacademyRoute = '/docs/cyberacademy';
export const cyberacademyImageRoute = '/og/cyberacademy';
export const cyberacademyContentRoute = '/llms.mdx/cyberacademy';

export const ciberseguridadEmpresarialRoute = '/docs/ciberseguridad-empresarial';
export const ciberseguridadEmpresarialImageRoute = '/og/ciberseguridad-empresarial';
export const ciberseguridadEmpresarialContentRoute = '/llms.mdx/ciberseguridad-empresarial';

export const selfHostingRoute = '/docs/self-hosting';
export const selfHostingImageRoute = '/og/self-hosting';
export const selfHostingContentRoute = '/llms.mdx/self-hosting';

export const homeImageRoute = '/og/home/image.png';
export const blogImageRoute = '/og/blog';
export const releasesImageRoute = '/og/releases';

export const gitConfig = {
  user: 'PetterVargas',
  repo: 'divisioncero.com',
  branch: 'main',
};

export const rssAlternateTypes = {
  'application/rss+xml': [{ title: appName, url: `${baseUrl}/rss.xml` }],
};

/**
 * Builds consistent canonical + Open Graph + Twitter Card metadata for a page.
 * Pages that don't pass `images` get the site-wide default (`homeImageRoute`).
 *
 * Next.js reemplaza `alternates`, `openGraph` y `twitter` completos por segmento
 * (no los fusiona con el layout), así que aquí se repiten title/description,
 * siteName/locale y el feed RSS para que no se pierdan.
 */
export function pageMetadata({
  path,
  title,
  description,
  images = homeImageRoute,
  type = 'website',
  publishedTime,
  authors,
  robots,
}: {
  /** Ruta de la página. */
  path: string;
  title: string;
  description?: string;
  images?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
  robots?: Metadata['robots'];
}): Metadata {
  const canonical = path;
  return {
    title,
    description,
    alternates: {
      canonical,
      types: rssAlternateTypes,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${canonical}`,
      siteName: appName,
      locale: 'es_419',
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
      images,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@divisioncero',
      title,
      description,
      images,
    },
    ...(robots ? { robots } : {}),
  };
}

export const cookieConsentKey = 'dc-cookie-consent';
