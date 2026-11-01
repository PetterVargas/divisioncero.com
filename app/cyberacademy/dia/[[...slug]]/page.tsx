import { diaSource, getDiaPageImage, getDiaPageMarkdownUrl } from '@/lib/cyberacademy/source';
import { renderDomainPage, generateDomainMetadata } from '@/lib/cyberacademy/domain-page';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/cyberacademy/dia/[[...slug]]'>) {
  const { slug } = await props.params;
  return renderDomainPage(diaSource, { getPageImage: getDiaPageImage, getPageMarkdownUrl: getDiaPageMarkdownUrl }, 'dia', slug);
}

export async function generateStaticParams() {
  return diaSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/cyberacademy/dia/[[...slug]]'>): Promise<Metadata> {
  const { slug } = await props.params;
  return generateDomainMetadata(diaSource, { getPageImage: getDiaPageImage, getPageMarkdownUrl: getDiaPageMarkdownUrl }, slug);
}
