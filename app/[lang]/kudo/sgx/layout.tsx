import { sgxSource } from '@/lib/kudo/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, getSectionTabs, getSgxSubTabs } from '@/lib/kudo/layout.shared';
import { SubSectionPicker } from '@/components/sub-section-picker';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/kudo/sgx'>) {
  const { lang } = await params;
  return (
    <DocsLayout
      tree={sgxSource.getPageTree(lang)}
      tabs={getSectionTabs(lang)}
      sidebar={{ banner: <SubSectionPicker key="sgx-subtabs" tabs={getSgxSubTabs(lang)} /> }}
      {...baseOptions(lang)}
    >
      {children}
    </DocsLayout>
  );
}
