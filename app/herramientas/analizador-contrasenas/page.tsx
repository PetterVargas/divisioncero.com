import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { PasswordAnalyzer } from './_components/password-analyzer';

const title = 'Analizador de Contraseñas';
const description =
  'Descubre cuánto tardaría un atacante en descifrar tu contraseña con la tecnología actual.';
const path = '/analizador-contrasenas';

export const generateMetadata = toolMetadata({ title, description, path });

export default function AnalizadorContrasenasPage() {
  return (
    <div>
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Analizador de Contraseñas"
        subtitle="Descubre cuánto tardaría un atacante en descifrar tu contraseña con la tecnología actual."
      />

      <ToolFullscreen className="container mx-auto">
        <div className="flex flex-1 flex-col items-center justify-center py-12">
          <PasswordAnalyzer />
        </div>
      </ToolFullscreen>
    </div>
  );
}
