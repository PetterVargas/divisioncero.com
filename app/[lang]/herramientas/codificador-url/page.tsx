import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { UrlEncoderComponent } from './url-encoder-component';

const title = 'Codificador/Decodificador URL';
const description =
  'Codifica y decodifica URLs online (percent-encoding): convierte espacios, tildes y caracteres especiales en enlaces válidos y seguros, gratis y en tu navegador.';
const path = '/codificador-url';

export const generateMetadata = toolMetadata({ title, description, path });

export default function UrlEncoderPage() {
  return (
    <div>
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Codificador/Decodificador URL"
        subtitle="Convierte caracteres especiales en URLs de forma segura"
      />

      <ToolFullscreen className="container mx-auto">
        <div className="flex flex-1 flex-col items-center justify-center py-12">
          <UrlEncoderComponent />
        </div>
      </ToolFullscreen>
    </div>
  );
}
