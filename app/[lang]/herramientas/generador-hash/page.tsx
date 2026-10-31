import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { HashGeneratorComponent } from './hash-generator-component';

const title = 'Generador de Hash';
const description =
  'Genera hashes MD5, SHA-1, SHA-256 y SHA-512 de cualquier texto online para verificar integridad. Gratis y calculado en tu navegador, sin enviar datos.';
const path = '/generador-hash';

export const generateMetadata = toolMetadata({ title, description, path });

export default function HashGeneratorPage() {
  return (
    <div>
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Generador de Hash"
        subtitle="Genera hashes MD5, SHA-1, SHA-256 y SHA-512 para verificación de integridad"
      />

      <ToolFullscreen className="container mx-auto">
        <div className="flex flex-1 flex-col items-center justify-center py-12">
          <HashGeneratorComponent />
        </div>
      </ToolFullscreen>
    </div>
  );
}
