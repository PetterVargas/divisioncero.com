import { cipSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default function Layout({ children }: LayoutProps<'/cyberacademy/cip'>) {
  return <DomainDocsLayout tree={cipSource.getPageTree()}>{children}</DomainDocsLayout>;
}
