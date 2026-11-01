import { ccnSource, getCcnPageImage, getCcnPageMarkdownUrl } from '@/lib/cyberacademy/source';
import { renderDomainPage, generateDomainMetadata } from '@/lib/cyberacademy/domain-page';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/cyberacademy/ccn/[[...slug]]'>) {
  const { slug } = await props.params;
  return renderDomainPage(ccnSource, { getPageImage: getCcnPageImage, getPageMarkdownUrl: getCcnPageMarkdownUrl }, 'ccn', slug);
}

export async function generateStaticParams() {
  return ccnSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/cyberacademy/ccn/[[...slug]]'>): Promise<Metadata> {
  const { slug } = await props.params;
  return generateDomainMetadata(ccnSource, { getPageImage: getCcnPageImage, getPageMarkdownUrl: getCcnPageMarkdownUrl }, slug);
}
