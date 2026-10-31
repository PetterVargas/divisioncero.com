import { thpSource, getThpPageImage, getThpPageMarkdownUrl } from '@/lib/cyberacademy/source';
import { renderDomainPage, generateDomainMetadata } from '@/lib/cyberacademy/domain-page';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/[lang]/cyberacademy/thp/[[...slug]]'>) {
  const { slug, lang } = await props.params;
  return renderDomainPage(thpSource, { getPageImage: getThpPageImage, getPageMarkdownUrl: getThpPageMarkdownUrl }, 'thp', slug, lang);
}

export async function generateStaticParams() {
  return thpSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/[lang]/cyberacademy/thp/[[...slug]]'>): Promise<Metadata> {
  const { slug, lang } = await props.params;
  return generateDomainMetadata(thpSource, { getPageImage: getThpPageImage, getPageMarkdownUrl: getThpPageMarkdownUrl }, slug, lang);
}
