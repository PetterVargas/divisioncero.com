import { cifSource, getCifPageImage, getCifPageMarkdownUrl } from '@/lib/cyberacademy/source';
import { renderDomainPage, generateDomainMetadata } from '@/lib/cyberacademy/domain-page';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/cyberacademy/cif/[[...slug]]'>) {
  const { slug } = await props.params;
  return renderDomainPage(cifSource, { getPageImage: getCifPageImage, getPageMarkdownUrl: getCifPageMarkdownUrl }, 'cif', slug);
}

export async function generateStaticParams() {
  return cifSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/cyberacademy/cif/[[...slug]]'>): Promise<Metadata> {
  const { slug } = await props.params;
  return generateDomainMetadata(cifSource, { getPageImage: getCifPageImage, getPageMarkdownUrl: getCifPageMarkdownUrl }, slug);
}
