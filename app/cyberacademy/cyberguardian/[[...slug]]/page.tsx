import { cyberguardianSource, getCyberguardianPageImage, getCyberguardianPageMarkdownUrl } from '@/lib/cyberacademy/source';
import { renderDomainPage, generateDomainMetadata } from '@/lib/cyberacademy/domain-page';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/cyberacademy/cyberguardian/[[...slug]]'>) {
  const { slug } = await props.params;
  return renderDomainPage(cyberguardianSource, { getPageImage: getCyberguardianPageImage, getPageMarkdownUrl: getCyberguardianPageMarkdownUrl }, 'cyberguardian', slug);
}

export async function generateStaticParams() {
  return cyberguardianSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/cyberacademy/cyberguardian/[[...slug]]'>): Promise<Metadata> {
  const { slug } = await props.params;
  return generateDomainMetadata(cyberguardianSource, { getPageImage: getCyberguardianPageImage, getPageMarkdownUrl: getCyberguardianPageMarkdownUrl }, slug);
}
