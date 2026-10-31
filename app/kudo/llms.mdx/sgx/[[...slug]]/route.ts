import { sgxSource, getSgxPageMarkdownUrl, getLLMText } from '@/lib/kudo/source';
import { notFound } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/kudo/llms.mdx/sgx/[[...slug]]'>) {
  const { slug } = await params;
  const page = sgxSource.getPage(slug?.slice(0, -1));
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  return sgxSource.getPages(defaultLocale).map((page) => ({
    slug: getSgxPageMarkdownUrl(page).segments,
  }));
}
