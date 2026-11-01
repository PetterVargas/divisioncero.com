import { frameworkSource } from '@/lib/kudo/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, getSectionTabs, getFrameworkSubTabs } from '@/lib/kudo/layout.shared';
import { SubSectionPicker } from '@/components/sub-section-picker';

export default function Layout({ children }: LayoutProps<'/kudo/framework'>) {
  return (
    <DocsLayout
      tree={frameworkSource.getPageTree()}
      tabs={getSectionTabs()}
      sidebar={{ banner: <SubSectionPicker key="framework-subtabs" tabs={getFrameworkSubTabs()} /> }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
