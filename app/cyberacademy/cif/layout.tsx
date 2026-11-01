import { cifSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default function Layout({ children }: LayoutProps<'/cyberacademy/cif'>) {
  return <DomainDocsLayout tree={cifSource.getPageTree()}>{children}</DomainDocsLayout>;
}
