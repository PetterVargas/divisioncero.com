import { ccnSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default function Layout({ children }: LayoutProps<'/cyberacademy/ccn'>) {
  return <DomainDocsLayout tree={ccnSource.getPageTree()}>{children}</DomainDocsLayout>;
}
