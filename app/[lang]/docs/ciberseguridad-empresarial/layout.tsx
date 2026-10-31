import { ciberseguridadEmpresarialSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, getSectionTabs } from '@/lib/layout.shared';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/docs/ciberseguridad-empresarial'>) {
  const { lang } = await params;
  return (
    <DocsLayout
      tree={ciberseguridadEmpresarialSource.getPageTree(lang)}
      tabs={getSectionTabs(lang)}
      {...baseOptions(lang)}
    >
      {children}
    </DocsLayout>
  );
}
