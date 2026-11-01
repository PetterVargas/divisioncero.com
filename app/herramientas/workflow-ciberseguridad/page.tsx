import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { WorkflowDiagram } from './_components/workflow-diagram';

const title = 'Workflow de Ciberseguridad';
const description =
  'Un overview de cómo funciona, capacitar, optimizar y automatizar tus procesos de Ciberseguridad.';
const path = '/workflow-ciberseguridad';

export const generateMetadata = toolMetadata({ title, description, path });

export default function WorkflowPage() {
  return (
    <div className="flex flex-col space-y-12">
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Workflow de Ciberseguridad"
        subtitle="Un overview de cómo funciona, capacitar, optimizar y automatizar tus procesos de Ciberseguridad."
      />

      <ToolFullscreen className="w-full">
        <WorkflowDiagram />
      </ToolFullscreen>
    </div>
  );
}
