import { cyberguardianSource } from '@/lib/cyberacademy/source';
import { DomainDocsLayout } from '@/components/cyberacademy/domain-docs-layout';

export default function Layout({ children }: LayoutProps<'/cyberacademy/cyberguardian'>) {
  return <DomainDocsLayout tree={cyberguardianSource.getPageTree()}>{children}</DomainDocsLayout>;
}
