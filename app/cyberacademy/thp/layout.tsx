import { thpSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default function Layout({ children }: LayoutProps<'/cyberacademy/thp'>) {
  return <DomainDocsLayout tree={thpSource.getPageTree()}>{children}</DomainDocsLayout>;
}
