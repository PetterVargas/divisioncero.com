import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { releases } from '@/lib/source';
import { ViewOptions } from '@/components/page-actions';

const owner = 'PetterVargas';
const repo = 'divisioncero-docs';

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = releases.getPage([params.slug]);

  if (!page) notFound();
  const Mdx = page.data.body;

  return (
    <>
      <div className="w-full max-w-(--fd-layout-width) mx-auto px-4 flex flex-col items-center py-12">
        <Link
          href="/releases"
          className="self-start mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-fd-muted-foreground hover:text-fd-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Releases
        </Link>
        <span className="mb-3 inline-flex items-center justify-center text-xs font-mono font-semibold px-2 py-1 rounded-md bg-fd-primary/10 text-fd-primary">
          {page.data.version}
        </span>
        <h1 className="mb-2 text-center text-3xl font-bold">{page.data.title}</h1>
        <p className="mb-2 text-center text-fd-muted-foreground">{page.data.description}</p>
        <div className="flex flex-row gap-2 items-center border-b mb-6 pb-4">
          <ViewOptions
            markdownUrl={`/api/mdx${page.url}`}
            githubUrl={`https://github.com/${owner}/${repo}/blob/main/content/release/${page.path}`}
          />
        </div>
        <div className="flex flex-col items-center gap-1 text-sm">
          <span className="text-fd-muted-foreground">
            {new Date(page.data.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>
      <article className="w-full max-w-(--fd-layout-width) mx-auto px-4 flex flex-col py-8">
        <div className="prose mx-auto min-w-0">
          <InlineTOC items={page.data.toc} />
          <Mdx components={defaultMdxComponents} />
        </div>
      </article>
    </>
  );
}

export function generateStaticParams(): { slug: string }[] {
  return releases.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
