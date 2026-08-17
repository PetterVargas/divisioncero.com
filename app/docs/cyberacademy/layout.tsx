import { cyberacademySource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, sectionTabs } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs/cyberacademy'>) {
  return (
    <DocsLayout
      tree={cyberacademySource.getPageTree()}
      tabs={sectionTabs}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
