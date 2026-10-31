import { cifSource, getCifPageImage, getCifPageMarkdownUrl } from '@/lib/cyberacademy/source';
import { renderDomainPage, generateDomainMetadata } from '@/lib/cyberacademy/domain-page';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/[lang]/cyberacademy/cif/[[...slug]]'>) {
  const { slug, lang } = await props.params;
  return renderDomainPage(cifSource, { getPageImage: getCifPageImage, getPageMarkdownUrl: getCifPageMarkdownUrl }, 'cif', slug, lang);
}

export async function generateStaticParams() {
  return cifSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/[lang]/cyberacademy/cif/[[...slug]]'>): Promise<Metadata> {
  const { slug, lang } = await props.params;
  return generateDomainMetadata(cifSource, { getPageImage: getCifPageImage, getPageMarkdownUrl: getCifPageMarkdownUrl }, slug, lang);
}
