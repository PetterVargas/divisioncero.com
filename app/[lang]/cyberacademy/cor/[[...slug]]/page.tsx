import { corSource, getCorPageImage, getCorPageMarkdownUrl } from '@/lib/cyberacademy/source';
import { renderDomainPage, generateDomainMetadata } from '@/lib/cyberacademy/domain-page';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/[lang]/cyberacademy/cor/[[...slug]]'>) {
  const { slug, lang } = await props.params;
  return renderDomainPage(corSource, { getPageImage: getCorPageImage, getPageMarkdownUrl: getCorPageMarkdownUrl }, 'cor', slug, lang);
}

export async function generateStaticParams() {
  return corSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/[lang]/cyberacademy/cor/[[...slug]]'>): Promise<Metadata> {
  const { slug, lang } = await props.params;
  return generateDomainMetadata(corSource, { getPageImage: getCorPageImage, getPageMarkdownUrl: getCorPageMarkdownUrl }, slug, lang);
}
