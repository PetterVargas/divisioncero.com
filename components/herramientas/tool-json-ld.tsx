'use client';

import { siteUrl, localizedTool } from '@/lib/herramientas/seo';
import { useI18n } from '@/components/herramientas/i18n-provider';

const publisher = {
  '@type': 'Organization',
  name: 'DivisionCero',
  url: 'https://divisioncero.com',
};

/**
 * `kind="app"` para herramientas interactivas (SoftwareApplication) y
 * `kind="article"` para páginas explicativas/educativas (Article), que es el
 * tipo que corresponde a contenido de lectura como "¿Qué es el grooming?".
 */
export function ToolJsonLd({
  title,
  description,
  path,
  kind = 'app',
}: {
  title: string;
  description: string;
  path: string;
  kind?: 'app' | 'article';
}) {
  const { locale } = useI18n();
  ({ title, description } = localizedTool(locale, { title, description, path }));
  const base = locale === 'en' ? siteUrl.replace('/herramientas', '/en/herramientas') : siteUrl;
  const url = `${base}${path}`;

  const mainEntity =
    kind === 'article'
      ? {
          '@type': 'Article',
          headline: title,
          description,
          url,
          mainEntityOfPage: url,
          inLanguage: locale,
          image: `${siteUrl}/opengraph-image`,
          author: publisher,
          publisher,
        }
      : {
          '@type': 'SoftwareApplication',
          name: title,
          description,
          url,
          inLanguage: locale,
          applicationCategory: 'SecurityApplication',
          operatingSystem: 'Any',
          isAccessibleForFree: true,
          publisher,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      mainEntity,
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: locale === 'en' ? 'Tools' : 'Herramientas', item: base },
          { '@type': 'ListItem', position: 2, name: title, item: url },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
