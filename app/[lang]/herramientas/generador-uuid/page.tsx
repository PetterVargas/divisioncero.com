import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { UuidGeneratorComponent } from './uuid-generator-component';

const title = 'Generador de UUID';
const description =
  'Genera UUID v4 (GUID) aleatorios online gratis: identificadores únicos universales listos para copiar en bases de datos, APIs y desarrollo de software.';
const path = '/generador-uuid';

export const generateMetadata = toolMetadata({ title, description, path });

export default function UuidGeneratorPage() {
  return (
    <div>
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Generador de UUID"
        subtitle="Genera identificadores únicos universales (UUID v4) aleatorios"
      />

      <ToolFullscreen className="container mx-auto">
        <div className="flex flex-1 flex-col items-center justify-center py-12">
          <UuidGeneratorComponent />
        </div>
      </ToolFullscreen>
    </div>
  );
}
