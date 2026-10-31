import { adrSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/cyberacademy/adr'>) {
  const { lang } = await params;
  return <DomainDocsLayout lang={lang} tree={adrSource.getPageTree(lang)}>{children}</DomainDocsLayout>;
}
