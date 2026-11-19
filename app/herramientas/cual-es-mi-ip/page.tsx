import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { ToolFaq } from '@/components/herramientas/tool-faq';
import { toolMetadata } from '@/lib/herramientas/seo';
import { IpInfoComponent } from './ip-info-component';

const title = '¿Cuál es mi IP?';
const description =
  'Descubre tu dirección IP pública, tu ubicación aproximada, los encabezados HTTP que recibe un servidor y los datos de tu navegador. Consúltala también desde la terminal con curl y descarga un reporte en PDF con su hash SHA-256.';
const path = '/cual-es-mi-ip';

export const generateMetadata = toolMetadata({ title, description, path });

export default function CualEsMiIpPage() {
  return (
    <div>
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="¿Cuál es mi IP?"
        subtitle="Consulta la información pública que expone tu conexión al visitar esta página."
      />

      <ToolFullscreen className="container mx-auto">
        <div className="flex flex-1 flex-col items-center justify-center py-12">
          <IpInfoComponent />
        </div>
      </ToolFullscreen>
      <ToolFaq path={path} />
    </div>
  );
}
