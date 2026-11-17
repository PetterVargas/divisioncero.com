import { siteUrl, toolImage } from '@/lib/herramientas/seo';
import { tools } from '@/lib/herramientas/tools';

const homeUrl = 'https://divisioncero.com';

// Misma entidad que el JSON-LD del layout raíz (`app/layout.tsx`).
const publisher = {
  '@type': 'Organization',
  '@id': `${homeUrl}/#organization`,
  name: 'DivisionCero',
  url: homeUrl,
};

/**
 * `kind="app"` para herramientas interactivas (WebApplication) y
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
  const url = `${siteUrl}${path}`;
  const image = `${homeUrl}${toolImage(path)}`;
  const tool = tools.find((t) => t.href === `/herramientas${path}`);
  const about = tool?.categories.map((name) => ({ '@type': 'Thing', name }));

  const common = {
    '@id': `${url}#main`,
    description,
    url,
    image,
    inLanguage: 'es',
    isAccessibleForFree: true,
    publisher,
    isPartOf: { '@type': 'CollectionPage', '@id': `${siteUrl}#coleccion`, url: siteUrl, name: 'Herramientas de Ciberseguridad' },
    ...(about?.length ? { about } : {}),
  };

  const mainEntity =
    kind === 'article'
      ? {
          '@type': 'Article',
          ...common,
          headline: title,
          mainEntityOfPage: url,
          author: publisher,
        }
      : {
          '@type': 'WebApplication',
          ...common,
          name: title,
          applicationCategory: 'SecurityApplication',
          operatingSystem: 'Any',
          browserRequirements: 'Requiere JavaScript. Funciona en cualquier navegador moderno.',
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
          { '@type': 'ListItem', position: 1, name: 'DivisionCero', item: homeUrl },
          { '@type': 'ListItem', position: 2, name: 'Herramientas', item: siteUrl },
          { '@type': 'ListItem', position: 3, name: title, item: url },
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
