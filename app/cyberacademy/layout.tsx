import { cyberacademySource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, sectionTabs, getCyberacademySubTabs } from '@/lib/layout.shared';
import { SubSectionPicker } from '@/components/sub-section-picker';

export default function Layout({ children }: LayoutProps<'/cyberacademy'>) {
  return (
    <DocsLayout
      tree={cyberacademySource.getPageTree()}
      tabs={sectionTabs}
      sidebar={{ banner: <SubSectionPicker tabs={getCyberacademySubTabs()} /> }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
