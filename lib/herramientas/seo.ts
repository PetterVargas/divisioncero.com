import type { Metadata } from 'next';

export const siteName = 'Herramientas de Ciberseguridad - DivisionCero';
/** Raíz de las herramientas dentro de divisioncero.com. */
export const toolsRoute = '/herramientas';
export const siteUrl = `https://divisioncero.com${toolsRoute}`;
/** Imagen Open Graph de las herramientas (la genera `scripts/og-generate.tsx`). */
export const toolsImage = `${toolsRoute}/og/image.png`;

/** Imagen Open Graph propia de una herramienta (`/cybermap` → `/herramientas/og/cybermap.png`). */
export function toolImage(path: string) {
  return `${toolsRoute}/og${path}.png`;
}

/**
 * Metadata por página: además del title/description para buscadores, define
 * openGraph/twitter propios para que los links compartidos (WhatsApp, Slack,
 * LinkedIn, X...) muestren el título y la descripción de la herramienta en
 * lugar de heredar siempre los genéricos de la home.
 */
export function buildMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = `https://divisioncero.com${toolsRoute}${path}`;
  const ogTitle = `${title} · Herramientas · DivisionCero`;
  const images = { url: toolImage(path), width: 1200, height: 630, alt: title };

  return {
    title,
    description,
    alternates: {
      canonical: `${toolsRoute}${path}`,
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: siteName,
      type: 'website',
      locale: 'es_419',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@divisioncero',
      title: ogTitle,
      description,
      images,
    },
  };
}

/** `generateMetadata` de una herramienta. */
export function toolMetadata(tool: { title: string; description: string; path: string }) {
  return async (): Promise<Metadata> => buildMetadata(tool);
}
