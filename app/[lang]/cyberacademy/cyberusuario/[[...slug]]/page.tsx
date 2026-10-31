import { cyberusuarioSource, getCyberusuarioPageImage, getCyberusuarioPageMarkdownUrl } from '@/lib/cyberacademy/source';
import { renderDomainPage, generateDomainMetadata } from '@/lib/cyberacademy/domain-page';
import type { Metadata } from 'next';

export default async function Page(props: PageProps<'/[lang]/cyberacademy/cyberusuario/[[...slug]]'>) {
  const { slug, lang } = await props.params;
  return renderDomainPage(
    cyberusuarioSource,
    { getPageImage: getCyberusuarioPageImage, getPageMarkdownUrl: getCyberusuarioPageMarkdownUrl },
    'cyberusuario',
    slug,
    lang,
  );
}

export async function generateStaticParams() {
  return cyberusuarioSource.generateParams();
}

export async function generateMetadata(props: PageProps<'/[lang]/cyberacademy/cyberusuario/[[...slug]]'>): Promise<Metadata> {
  const { slug, lang } = await props.params;
  return generateDomainMetadata(
    cyberusuarioSource,
    { getPageImage: getCyberusuarioPageImage, getPageMarkdownUrl: getCyberusuarioPageMarkdownUrl },
    slug,
    lang,
  );
}
