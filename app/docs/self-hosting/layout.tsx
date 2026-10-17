import { selfHostingSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, sectionTabs } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs/self-hosting'>) {
  return (
    <DocsLayout
      tree={selfHostingSource.getPageTree()}
      tabs={sectionTabs}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
