import type { Metadata } from 'next';
import { appName, baseUrl, homeImageRoute, rssAlternateTypes } from './shared';
import { localizeUrl, stripLocale } from '@/lib/i18n';

// Next.js replaces `openGraph`/`twitter` wholesale per route segment instead of
// deep-merging with the parent, so every page must restate its own title and
// description here or it silently falls back to the root layout's. The same
// goes for siteName, locale and the fallback image.
export function buildPageMetadata(opts: {
  title: string;
  description?: string;
  /** Ruta de la página; con prefijo `/en` si es la versión en inglés. */
  path: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  authors?: string[];
}): Metadata {
  const { title, description, path, image, type = 'website', publishedTime, authors } = opts;
  const url = `${baseUrl}${path}`;
  const images = image ?? homeImageRoute;
  const esPath = stripLocale(path);
  const isEnglish = esPath !== path;

  return {
    title,
    description,
    authors: authors?.map((name) => ({ name })),
    alternates: {
      canonical: url,
      languages: { es: esPath, en: localizeUrl(esPath, 'en'), 'x-default': esPath },
      types: rssAlternateTypes,
    },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: appName,
      locale: isEnglish ? 'en_US' : 'es_419',
      images,
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}
