import { cifSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/cyberacademy/cif'>) {
  const { lang } = await params;
  return <DomainDocsLayout lang={lang} tree={cifSource.getPageTree(lang)}>{children}</DomainDocsLayout>;
}
