import { cipSource, getCipPageMarkdownUrl, getLLMText } from '@/lib/cyberacademy/source';
import { notFound } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/cyberacademy/llms.mdx/cip/[[...slug]]'>) {
  const { slug } = await params;
  const page = cipSource.getPage(slug?.slice(0, -1));
  if (!page) notFound();
  return new Response(await getLLMText(page), { headers: { 'Content-Type': 'text/markdown' } });
}

export function generateStaticParams() {
  return cipSource.getPages(defaultLocale).map((page) => ({ slug: getCipPageMarkdownUrl(page).segments }));
}
