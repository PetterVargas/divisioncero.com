import { capSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/cyberacademy/cap'>) {
  const { lang } = await params;
  return <DomainDocsLayout lang={lang} tree={capSource.getPageTree(lang)}>{children}</DomainDocsLayout>;
}
