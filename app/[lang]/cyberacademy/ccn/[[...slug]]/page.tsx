import { ccnSource, getCcnPageImage, getCcnPageMarkdownUrl } from '@/lib/cyberacademy/source';
import { renderDomainPage, generateDomainMetadata } from '@/lib/cyberacademy/domain-page';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/[lang]/cyberacademy/ccn/[[...slug]]'>) {
  const { slug, lang } = await props.params;
  return renderDomainPage(ccnSource, { getPageImage: getCcnPageImage, getPageMarkdownUrl: getCcnPageMarkdownUrl }, 'ccn', slug, lang);
}

export async function generateStaticParams() {
  return ccnSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/[lang]/cyberacademy/ccn/[[...slug]]'>): Promise<Metadata> {
  const { slug, lang } = await props.params;
  return generateDomainMetadata(ccnSource, { getPageImage: getCcnPageImage, getPageMarkdownUrl: getCcnPageMarkdownUrl }, slug, lang);
}
