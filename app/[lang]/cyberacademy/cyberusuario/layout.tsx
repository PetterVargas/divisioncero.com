import { cyberusuarioSource } from '@/lib/cyberacademy/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, getAllTabs, getCyberusuarioSubTabs } from '@/lib/cyberacademy/layout.shared';
import { SubSectionPicker } from '@/components/sub-section-picker';
import { getT } from '@/lib/site-translations';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/cyberacademy/cyberusuario'>) {
  const { lang } = await params;
  return (
    <DocsLayout
      tree={cyberusuarioSource.getPageTree(lang)}
      tabs={getAllTabs(lang)}
      sidebar={{ banner: <SubSectionPicker tabs={getCyberusuarioSubTabs(lang)} placeholder={getT(lang)('Seleccionar curso')} /> }}
      {...baseOptions(lang)}
    >
      {children}
    </DocsLayout>
  );
}
