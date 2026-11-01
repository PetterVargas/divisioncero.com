import { ciberseguridadEmpresarialSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, getSectionTabs } from '@/lib/layout.shared';

export default function Layout({ children }: LayoutProps<'/docs/ciberseguridad-empresarial'>) {
  return (
    <DocsLayout
      tree={ciberseguridadEmpresarialSource.getPageTree()}
      tabs={getSectionTabs()}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
