import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { legal } from '@/lib/source';
import { appName, baseUrl } from '@/lib/shared';

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = legal.getPage([params.slug]);

  if (!page) notFound();
  const Mdx = page.data.body;

  return (
    <>
      <div className="w-full max-w-(--fd-layout-width) mx-auto px-4 flex flex-col items-center py-16">
        <h1 className="mb-3 text-center text-4xl font-bold tracking-tight">{page.data.title}</h1>
        <p className="mb-2 text-center text-lg text-fd-muted-foreground">{page.data.description}</p>
        <p className="text-sm text-fd-muted-foreground/70">Vigente desde: {page.data.effectiveDate}</p>
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
  return legal.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = legal.getPage([params.slug]);
  if (!page) notFound();

  const description = page.data.description ?? `Documento legal de ${appName}`;

  return {
    title: page.data.title,
    description,
    alternates: {
      canonical: page.url,
    },
    openGraph: {
      url: `${baseUrl}${page.url}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}
