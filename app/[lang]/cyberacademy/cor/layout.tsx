import { corSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/cyberacademy/cor'>) {
  const { lang } = await params;
  return <DomainDocsLayout lang={lang} tree={corSource.getPageTree(lang)}>{children}</DomainDocsLayout>;
}
