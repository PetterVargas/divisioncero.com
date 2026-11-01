import { sgxSource } from '@/lib/kudo/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, getSectionTabs, getSgxSubTabs } from '@/lib/kudo/layout.shared';
import { SubSectionPicker } from '@/components/sub-section-picker';

export default function Layout({ children }: LayoutProps<'/kudo/sgx'>) {
  return (
    <DocsLayout
      tree={sgxSource.getPageTree()}
      tabs={getSectionTabs()}
      sidebar={{ banner: <SubSectionPicker key="sgx-subtabs" tabs={getSgxSubTabs()} /> }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
