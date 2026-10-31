import type { Metadata } from 'next';
import { getTools } from './i18n/tools';
import { toLocale } from './i18n/server';

export const siteName = 'Herramientas de Ciberseguridad - DivisionCero';
/** Raíz de las herramientas dentro de divisioncero.com. */
export const toolsRoute = '/herramientas';
export const siteUrl = `https://divisioncero.com${toolsRoute}`;
/** Imagen Open Graph de las herramientas (la genera `scripts/og-generate.tsx`). */
export const toolsImage = `${toolsRoute}/og/image.png`;

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
  lang = 'es',
}: {
  title: string;
  description: string;
  path: string;
  lang?: string;
}): Metadata {
  const prefix = lang === 'en' ? '/en' : '';
  const url = `https://divisioncero.com${prefix}${toolsRoute}${path}`;
  const ogTitle = lang === 'en' ? `${title} · Tools · DivisionCero` : `${title} · Herramientas · DivisionCero`;

  return {
    title,
    description,
    alternates: {
      canonical: `${prefix}${toolsRoute}${path}`,
      languages: { es: `${toolsRoute}${path}`, en: `/en${toolsRoute}${path}`, 'x-default': `${toolsRoute}${path}` },
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: lang === 'en' ? 'Cybersecurity Tools - DivisionCero' : siteName,
      type: 'website',
      locale: lang === 'en' ? 'en_US' : 'es_419',
      images: toolsImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: toolsImage,
    },
  };
}

/** Título y descripción de una herramienta en el idioma pedido (en inglés, los del catálogo traducido). */
export function localizedTool(lang: string, { title, description, path }: { title: string; description: string; path: string }) {
  if (toLocale(lang) === 'es') return { title, description };
  const slug = path.split('/').filter(Boolean).at(-1);
  const tool = getTools(toLocale(lang)).find((item) => item.slug === slug);
  return { title: tool?.title ?? title, description: tool?.description ?? description };
}

/** `generateMetadata` de una herramienta: metadata en el idioma de la ruta (`/herramientas` o `/en/herramientas`). */
export function toolMetadata(tool: { title: string; description: string; path: string }) {
  return async (props: { params: Promise<{ lang: string }> }): Promise<Metadata> => {
    const { lang } = await props.params;
    return buildMetadata({ ...localizedTool(lang, tool), path: tool.path, lang });
  };
}
