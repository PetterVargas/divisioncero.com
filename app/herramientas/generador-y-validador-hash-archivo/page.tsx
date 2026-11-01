import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { FileHashCalculator } from './_components/file-hash-calculator';

const title = 'Generador y Validador de Hash de Archivo';
const description =
  'Calcula el hash MD5, SHA-1, SHA-256 y SHA-512 de un archivo y descarga el resultado en PDF, sin subirlo a ningún servidor: todo ocurre en tu navegador.';
const path = '/generador-y-validador-hash-archivo';

export const generateMetadata = toolMetadata({ title, description, path });

export default function HashArchivoPage() {
  return (
    <div className="flex flex-col space-y-8">
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Generador y Validador de Hash de Archivo"
        subtitle="Sube un archivo y obtén su MD5, SHA-1, SHA-256 y SHA-512. Todo el cálculo ocurre en tu navegador; el archivo nunca se envía a ningún servidor."
      />

      <ToolFullscreen className="container mx-auto flex flex-col items-center px-4 py-8">
        <FileHashCalculator />
      </ToolFullscreen>
    </div>
  );
}
