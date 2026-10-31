import { capSource, getCapPageMarkdownUrl, getLLMText } from '@/lib/cyberacademy/source';
import { notFound } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/cyberacademy/llms.mdx/cap/[[...slug]]'>) {
  const { slug } = await params;
  const page = capSource.getPage(slug?.slice(0, -1));
  if (!page) notFound();
  return new Response(await getLLMText(page), { headers: { 'Content-Type': 'text/markdown' } });
}

export function generateStaticParams() {
  return capSource.getPages(defaultLocale).map((page) => ({ slug: getCapPageMarkdownUrl(page).segments }));
}
