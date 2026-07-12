import { ciberseguridadEmpresarialSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, sectionTabs, getCiberseguridadEmpresarialSubTabs } from '@/lib/layout.shared';
import { SubSectionPicker } from '@/components/sub-section-picker';

export default function Layout({ children }: LayoutProps<'/docs/ciberseguridad-empresarial'>) {
  return (
    <DocsLayout
      tree={ciberseguridadEmpresarialSource.getPageTree()}
      tabs={sectionTabs}
      sidebar={{ banner: <SubSectionPicker tabs={getCiberseguridadEmpresarialSubTabs()} /> }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
