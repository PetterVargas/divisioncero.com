import { ciberseguridadEmpresarialSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, sectionTabs } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs/ciberseguridad-empresarial'>) {
  return (
    <DocsLayout
      tree={ciberseguridadEmpresarialSource.getPageTree()}
      tabs={sectionTabs}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
