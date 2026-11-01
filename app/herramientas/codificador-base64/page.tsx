import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { Base64EncoderComponent } from './base64-encoder-component';

const title = 'Codificador/Decodificador Base64';
const description =
  'Codifica y decodifica Base64 online gratis: convierte texto plano a Base64 y viceversa directamente en tu navegador, sin enviar tus datos a ningún servidor.';
const path = '/codificador-base64';

export const generateMetadata = toolMetadata({ title, description, path });

export default function Base64Page() {
  return (
    <div>
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Codificador/Decodificador Base64"
        subtitle="Convierte texto plano a Base64 y viceversa de forma segura"
      />

      <ToolFullscreen className="container mx-auto">
        <div className="flex flex-1 flex-col items-center justify-center py-12">
          <Base64EncoderComponent />
        </div>
      </ToolFullscreen>
    </div>
  );
}
