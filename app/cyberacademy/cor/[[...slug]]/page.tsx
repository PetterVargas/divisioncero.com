import { corSource, getCorPageImage, getCorPageMarkdownUrl } from '@/lib/cyberacademy/source';
import { renderDomainPage, generateDomainMetadata } from '@/lib/cyberacademy/domain-page';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/cyberacademy/cor/[[...slug]]'>) {
  const { slug } = await props.params;
  return renderDomainPage(corSource, { getPageImage: getCorPageImage, getPageMarkdownUrl: getCorPageMarkdownUrl }, 'cor', slug);
}

export async function generateStaticParams() {
  return corSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/cyberacademy/cor/[[...slug]]'>): Promise<Metadata> {
  const { slug } = await props.params;
  return generateDomainMetadata(corSource, { getPageImage: getCorPageImage, getPageMarkdownUrl: getCorPageMarkdownUrl }, slug);
}
