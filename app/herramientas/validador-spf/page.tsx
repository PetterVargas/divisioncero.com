import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { SPFValidatorComponent } from './spf-validator-component';

const title = 'Validador SPF';
const description =
  'Valida el registro SPF de tu dominio gratis: consulta su DNS, revisa sintaxis y mecanismos, y protege tu correo contra la suplantación y el spam.';
const path = '/validador-spf';

export const generateMetadata = toolMetadata({ title, description, path });

export default function SpfValidatorPage() {
  return (
    <div>
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Validador SPF"
        subtitle="Verifica y valida los registros SPF de tu dominio para mejorar la seguridad del email"
      />

      <ToolFullscreen className="container mx-auto">
        <div className="flex flex-1 flex-col items-center justify-center py-12">
          <SPFValidatorComponent />
        </div>
      </ToolFullscreen>
    </div>
  );
}
