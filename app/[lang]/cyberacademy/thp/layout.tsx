import { thpSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/cyberacademy/thp'>) {
  const { lang } = await params;
  return <DomainDocsLayout lang={lang} tree={thpSource.getPageTree(lang)}>{children}</DomainDocsLayout>;
}
