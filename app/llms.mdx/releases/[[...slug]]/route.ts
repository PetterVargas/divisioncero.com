import { releases, getReleasePageMarkdownUrl, getLLMText } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/llms.mdx/releases/[[...slug]]'>) {
  const { slug } = await params;
  const page = releases.getPage(slug?.slice(0, -1));
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}

export function generateStaticParams() {
  return releases.getPages().map((page) => ({
    slug: getReleasePageMarkdownUrl(page).segments,
  }));
}
