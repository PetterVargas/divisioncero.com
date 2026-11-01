import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { SecureSiteAnimation } from './_components/secure-site-animation';

const title = '¿Es Seguro Este Sitio?';
const description =
  'Animación paso a paso que muestra cómo verificar que un sitio web es seguro: HTTPS, dominio, certificado y más.';
const path = '/verificar-sitio-seguro';

export const generateMetadata = toolMetadata({ title, description, path });

export default function VerificarSitioSeguroPage() {
  return (
    <div className="flex flex-col space-y-8">
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="¿Es Seguro Este Sitio?"
        subtitle="Una animación paso a paso de las señales que confirman que un sitio web es seguro."
      />

      <ToolFullscreen className="container mx-auto flex flex-col items-center px-4 py-8">
        <SecureSiteAnimation />
      </ToolFullscreen>
    </div>
  );
}
