import { adrSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default function Layout({ children }: LayoutProps<'/cyberacademy/adr'>) {
  return <DomainDocsLayout tree={adrSource.getPageTree()}>{children}</DomainDocsLayout>;
}
