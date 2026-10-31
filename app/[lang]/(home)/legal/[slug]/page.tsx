import { defaultLocale, isTranslatedPage } from '@/lib/i18n';
import { getT } from '@/lib/site-translations';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { legal } from '@/lib/source';
import { appName, pageMetadata } from '@/lib/shared';

export default async function Page(props: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const params = await props.params;
  const page = legal.getPage([params.slug], params.lang);

  if (!page) notFound();
  const Mdx = page.data.body;

  return (
    <>
      <div className="w-full max-w-(--fd-layout-width) mx-auto px-4 flex flex-col items-center py-16">
        <h1 className="mb-3 text-center text-4xl font-bold tracking-tight">{page.data.title}</h1>
        <p className="mb-2 text-center text-lg text-fd-muted-foreground">{page.data.description}</p>
        <p className="text-sm text-fd-muted-foreground/70">{getT(params.lang)('Vigente desde:')} {page.data.effectiveDate}</p>
      </div>
      <article className="w-full max-w-(--fd-layout-width) mx-auto px-4 flex flex-col py-8">
        <div className="prose max-w-3xl mx-auto min-w-0">
          <InlineTOC items={page.data.toc} />
          <Mdx components={defaultMdxComponents} />
        </div>
      </article>
    </>
  );
}

export function generateStaticParams(): { slug: string }[] {
  return legal.getPages(defaultLocale).map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = legal.getPage([params.slug], params.lang);
  if (!page) notFound();

  const description = page.data.description ?? `Documento legal de ${appName}`;

  return pageMetadata({
    // Sin traducción propia, la canónica es la versión en español.
    lang: isTranslatedPage(page) ? params.lang : defaultLocale,
    path: page.url,
    title: page.data.title,
    description,
    type: 'article',
  });
}
