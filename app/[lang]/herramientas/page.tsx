import { HeroBackground } from '@/components/herramientas/hero-background';
import { ToolsSearch } from '@/components/herramientas/tools-search';
import { ToolsByCategory } from '@/components/herramientas/tools-by-category';
import { SupportSection } from '@/components/herramientas/support-section';
import type { Tool } from '@/lib/herramientas/tools';
import { getDictionary, toLocale } from '@/lib/herramientas/i18n/server';
import { localizeUrl } from '@/lib/i18n';
import { getTools } from '@/lib/herramientas/i18n/tools';

const baseUrl = 'https://divisioncero.com';

function getJsonLd(meta: { siteName: string; shortDescription: string }, tools: Tool[], lang: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: meta.siteName,
        url: `${baseUrl}${localizeUrl('/herramientas', lang)}`,
        description: meta.shortDescription,
        publisher: {
          '@type': 'Organization',
          name: 'DivisionCero',
          url: 'https://divisioncero.com',
        },
      },
      {
        '@type': 'ItemList',
        itemListElement: tools.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.title,
          description: tool.description,
          url: tool.external ? tool.href : `${baseUrl}${localizeUrl(tool.href, lang)}`,
        })),
      },
    ],
  };
}

export default async function Home(props: PageProps<'/[lang]/herramientas'>) {
  const { lang } = await props.params;
  const dict = getDictionary(lang);
  const tools = getTools(toLocale(lang));
  const jsonLd = getJsonLd(dict.meta, tools, lang);

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
      <HeroBackground className="fixed inset-0 w-full h-full pointer-events-none opacity-90" />

      <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 py-20 sm:py-28">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-primary mb-3">{dict.home.eyebrow}</p>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            {dict.home.title}
          </h1>
        </div>

        <ToolsSearch tools={tools} />
      </div>

      <SupportSection lang={lang} />

      <ToolsByCategory tools={tools} />
    </main>
  );
}
