import { capSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default function Layout({ children }: LayoutProps<'/cyberacademy/cap'>) {
  return <DomainDocsLayout tree={capSource.getPageTree()}>{children}</DomainDocsLayout>;
}
