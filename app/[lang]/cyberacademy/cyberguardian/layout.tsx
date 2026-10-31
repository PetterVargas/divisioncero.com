import { cyberguardianSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/cyberacademy/cyberguardian'>) {
  const { lang } = await params;
  return <DomainDocsLayout lang={lang} tree={cyberguardianSource.getPageTree(lang)}>{children}</DomainDocsLayout>;
}
