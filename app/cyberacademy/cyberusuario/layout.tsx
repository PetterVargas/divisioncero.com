import { cyberusuarioSource } from '@/lib/cyberacademy/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, getAllTabs, getCyberusuarioSubTabs } from '@/lib/cyberacademy/layout.shared';
import { SubSectionPicker } from '@/components/sub-section-picker';

export default function Layout({ children }: LayoutProps<'/cyberacademy/cyberusuario'>) {
  return (
    <DocsLayout
      tree={cyberusuarioSource.getPageTree()}
      tabs={getAllTabs()}
      sidebar={{ banner: <SubSectionPicker tabs={getCyberusuarioSubTabs()} placeholder="Seleccionar curso" /> }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
