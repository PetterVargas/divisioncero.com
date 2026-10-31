import { frameworkSource } from '@/lib/kudo/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, getSectionTabs, getFrameworkSubTabs } from '@/lib/kudo/layout.shared';
import { SubSectionPicker } from '@/components/sub-section-picker';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/kudo/framework'>) {
  const { lang } = await params;
  return (
    <DocsLayout
      tree={frameworkSource.getPageTree(lang)}
      tabs={getSectionTabs(lang)}
      sidebar={{ banner: <SubSectionPicker key="framework-subtabs" tabs={getFrameworkSubTabs(lang)} /> }}
      {...baseOptions(lang)}
    >
      {children}
    </DocsLayout>
  );
}
