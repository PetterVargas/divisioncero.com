import { ccnSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/cyberacademy/ccn'>) {
  const { lang } = await params;
  return <DomainDocsLayout lang={lang} tree={ccnSource.getPageTree(lang)}>{children}</DomainDocsLayout>;
}
