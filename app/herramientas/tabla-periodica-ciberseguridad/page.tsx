import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { PeriodicTable } from './_components/periodic-table';

const title = 'Tabla Periódica de Ciberseguridad';
const description =
  'Explora la Tabla Periódica de Ciberseguridad basada en el Framework KUDO: 36 controles organizados en 8 dominios de seguridad de la información.';
const path = '/tabla-periodica-ciberseguridad';

export const generateMetadata = toolMetadata({ title, description, path });

export default function TablaPeriodicaPage() {
  return (
    <>
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Tabla Periódica de Ciberseguridad"
        subtitle="Basado en el Framework Kudo aplicado para el contexto de LatAm"
      />

      <ToolFullscreen className="container mx-auto py-6">
        <PeriodicTable />
      </ToolFullscreen>
    </>
  );
}
