import { corSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default function Layout({ children }: LayoutProps<'/cyberacademy/cor'>) {
  return <DomainDocsLayout tree={corSource.getPageTree()}>{children}</DomainDocsLayout>;
}
