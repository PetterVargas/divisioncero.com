import { adrSource, getAdrPageImage, getAdrPageMarkdownUrl } from '@/lib/cyberacademy/source';
import { renderDomainPage, generateDomainMetadata } from '@/lib/cyberacademy/domain-page';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/[lang]/cyberacademy/adr/[[...slug]]'>) {
  const { slug, lang } = await props.params;
  return renderDomainPage(adrSource, { getPageImage: getAdrPageImage, getPageMarkdownUrl: getAdrPageMarkdownUrl }, 'adr', slug, lang);
}

export async function generateStaticParams() {
  return adrSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/[lang]/cyberacademy/adr/[[...slug]]'>): Promise<Metadata> {
  const { slug, lang } = await props.params;
  return generateDomainMetadata(adrSource, { getPageImage: getAdrPageImage, getPageMarkdownUrl: getAdrPageMarkdownUrl }, slug, lang);
}
