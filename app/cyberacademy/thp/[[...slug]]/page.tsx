import { thpSource, getThpPageImage, getThpPageMarkdownUrl } from '@/lib/cyberacademy/source';
import { renderDomainPage, generateDomainMetadata } from '@/lib/cyberacademy/domain-page';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/cyberacademy/thp/[[...slug]]'>) {
  const { slug } = await props.params;
  return renderDomainPage(thpSource, { getPageImage: getThpPageImage, getPageMarkdownUrl: getThpPageMarkdownUrl }, 'thp', slug);
}

export async function generateStaticParams() {
  return thpSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/cyberacademy/thp/[[...slug]]'>): Promise<Metadata> {
  const { slug } = await props.params;
  return generateDomainMetadata(thpSource, { getPageImage: getThpPageImage, getPageMarkdownUrl: getThpPageMarkdownUrl }, slug);
}
