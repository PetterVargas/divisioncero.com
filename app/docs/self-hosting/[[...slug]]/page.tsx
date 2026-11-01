
import { selfHostingSource, getSelfHostingPageImage, getSelfHostingPageMarkdownUrl } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig, pageMetadata } from '@/lib/shared';
import { Feedback } from '@/components/feedback/client';

export default async function Page(props: PageProps<'/docs/self-hosting/[[...slug]]'>) {
  const params = await props.params;
  const page = selfHostingSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getSelfHostingPageMarkdownUrl(page).url;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/self-hosting/${page.path}`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(selfHostingSource, page),
          })}
        />
      </DocsBody>
      <Feedback />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return selfHostingSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/self-hosting/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = selfHostingSource.getPage(params.slug);
  if (!page) notFound();

  return pageMetadata({
    // Sin traducción propia, la canónica es la versión en español.
    path: page.url,
    title: page.data.title,
    description: page.data.description,
    images: getSelfHostingPageImage(page).url,
  });
}
