import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { HexViewer } from './_components/hex-viewer';

const title = 'Visor Hexadecimal';
const description =
  'Sube cualquier archivo (hasta 10 MB) y visualiza su contenido byte a byte en hexadecimal y ASCII, con búsqueda de texto o bytes. Todo ocurre en tu navegador.';
const path = '/visor-hexadecimal';

export const generateMetadata = toolMetadata({ title, description, path });

export default function VisorHexadecimalPage() {
  return (
    <div className="flex flex-col space-y-8">
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Visor Hexadecimal"
        subtitle="Inspecciona el contenido crudo de cualquier archivo, byte a byte, con vista hexadecimal y ASCII."
      />

      <ToolFullscreen className="container mx-auto flex flex-col items-center px-4 py-8">
        <HexViewer />
      </ToolFullscreen>
    </div>
  );
}
