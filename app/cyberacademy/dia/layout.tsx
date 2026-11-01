import { diaSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default function Layout({ children }: LayoutProps<'/cyberacademy/dia'>) {
  return <DomainDocsLayout tree={diaSource.getPageTree()}>{children}</DomainDocsLayout>;
}
