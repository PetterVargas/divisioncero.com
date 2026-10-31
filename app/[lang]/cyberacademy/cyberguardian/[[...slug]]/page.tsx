import { cyberguardianSource, getCyberguardianPageImage, getCyberguardianPageMarkdownUrl } from '@/lib/cyberacademy/source';
import { renderDomainPage, generateDomainMetadata } from '@/lib/cyberacademy/domain-page';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/[lang]/cyberacademy/cyberguardian/[[...slug]]'>) {
  const { slug, lang } = await props.params;
  return renderDomainPage(cyberguardianSource, { getPageImage: getCyberguardianPageImage, getPageMarkdownUrl: getCyberguardianPageMarkdownUrl }, 'cyberguardian', slug, lang);
}

export async function generateStaticParams() {
  return cyberguardianSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/[lang]/cyberacademy/cyberguardian/[[...slug]]'>): Promise<Metadata> {
  const { slug, lang } = await props.params;
  return generateDomainMetadata(cyberguardianSource, { getPageImage: getCyberguardianPageImage, getPageMarkdownUrl: getCyberguardianPageMarkdownUrl }, slug, lang);
}
