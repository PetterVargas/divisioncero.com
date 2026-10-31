import { cipSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/cyberacademy/cip'>) {
  const { lang } = await params;
  return <DomainDocsLayout lang={lang} tree={cipSource.getPageTree(lang)}>{children}</DomainDocsLayout>;
}
