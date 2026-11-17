import { HeroGridBackdrop } from '@/components/hero-grid-page';
import { ToolsSearch } from '@/components/herramientas/tools-search';
import { ToolsByCategory } from '@/components/herramientas/tools-by-category';
import { SupportSection } from '@/components/herramientas/support-section';
import type { Tool } from '@/lib/herramientas/tools';
import { tools } from '@/lib/herramientas/tools';
import { textos } from '@/lib/herramientas/textos';

const baseUrl = 'https://divisioncero.com';

// Una sola entidad WebSite por dominio (la del layout raíz): el catálogo es una
// CollectionPage cuyo contenido principal es la lista de herramientas.
function getJsonLd(meta: { siteName: string; shortDescription: string }, tools: Tool[]) {
  const url = `${baseUrl}/herramientas`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${url}#coleccion`,
        name: meta.siteName,
        url,
        description: meta.shortDescription,
        inLanguage: 'es',
        isPartOf: { '@id': `${baseUrl}/#website` },
        publisher: { '@id': `${baseUrl}/#organization` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: tools.length,
          itemListElement: tools.map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: tool.title,
            description: tool.description,
            url: tool.external ? tool.href : `${baseUrl}${tool.href}`,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DivisionCero', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Herramientas', item: url },
        ],
      },
    ],
  };
}

export default function Home() {
  const jsonLd = getJsonLd(textos.meta, tools);

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Mismo fondo que el hero de la página principal, en el primer pantallazo. */}
      <HeroGridBackdrop />

      <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 py-20 sm:py-28">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-primary mb-3">{textos.home.eyebrow}</p>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            {textos.home.title}
          </h1>
        </div>

        <ToolsSearch tools={tools} />
      </div>

      <SupportSection />

      <ToolsByCategory tools={tools} />
    </main>
  );
}
