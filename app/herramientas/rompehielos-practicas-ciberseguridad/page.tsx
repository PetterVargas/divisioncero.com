import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { PracticeGrid } from './_components/practice-grid';

const title = 'Rompehielos: Buenas y Malas Prácticas';
const description =
  'Dinámica de equipo para discutir si cada práctica sobre dispositivos, contraseñas, red, correo y procesos es buena o mala, y descubrir por qué.';
const path = '/rompehielos-practicas-ciberseguridad';

export const generateMetadata = toolMetadata({ title, description, path });

export default function RompehielosPracticasCiberseguridadPage() {
  return (
    <div className="flex flex-col space-y-8">
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Rompehielos: Buenas y Malas Prácticas"
        subtitle="Discutan en equipo si cada práctica de ciberseguridad es buena o mala, y descubran por qué."
      />

      <ToolFullscreen className="container mx-auto max-w-7xl py-8">
        <PracticeGrid />
      </ToolFullscreen>
    </div>
  );
}
