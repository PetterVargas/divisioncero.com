import { selfHostingSource, getSelfHostingPageMarkdownUrl, getLLMText } from '@/lib/source';
import { notFound } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/self-hosting/[[...slug]]'>) {
  const { slug } = await params;
  const page = selfHostingSource.getPage(slug?.slice(0, -1));
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  return selfHostingSource.getPages(defaultLocale).map((page) => ({
    slug: getSelfHostingPageMarkdownUrl(page).segments,
  }));
}
