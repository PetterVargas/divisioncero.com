import { capSource, getCapPageImage, getCapPageMarkdownUrl } from '@/lib/cyberacademy/source';
import { renderDomainPage, generateDomainMetadata } from '@/lib/cyberacademy/domain-page';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/cyberacademy/cap/[[...slug]]'>) {
  const { slug } = await props.params;
  return renderDomainPage(capSource, { getPageImage: getCapPageImage, getPageMarkdownUrl: getCapPageMarkdownUrl }, 'cap', slug);
}

export async function generateStaticParams() {
  return capSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/cyberacademy/cap/[[...slug]]'>): Promise<Metadata> {
  const { slug } = await props.params;
  return generateDomainMetadata(capSource, { getPageImage: getCapPageImage, getPageMarkdownUrl: getCapPageMarkdownUrl }, slug);
}
