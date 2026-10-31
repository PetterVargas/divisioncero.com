import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { HexEncoderComponent } from './hex-encoder-component';

const title = 'Codificador/Decodificador Hexadecimal';
const description = 'Convierte texto plano a hexadecimal y viceversa de forma segura, directamente en tu navegador.';
const path = '/codificador-hexadecimal';

export const generateMetadata = toolMetadata({ title, description, path });

export default function CodificadorHexadecimalPage() {
  return (
    <div>
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Codificador/Decodificador Hexadecimal"
        subtitle="Convierte texto plano a hexadecimal y viceversa de forma segura"
      />

      <ToolFullscreen className="container mx-auto">
        <div className="flex flex-1 flex-col items-center justify-center py-12">
          <HexEncoderComponent />
        </div>
      </ToolFullscreen>
    </div>
  );
}
