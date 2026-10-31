import { diaSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/cyberacademy/dia'>) {
  const { lang } = await params;
  return <DomainDocsLayout lang={lang} tree={diaSource.getPageTree(lang)}>{children}</DomainDocsLayout>;
}
