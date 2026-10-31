import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { IncidentChecklist } from './_components/incident-checklist';

const title = 'Checklist de Mitigación de Incidentes';
const description =
  'Pasos inmediatos ante un incidente de seguridad, tanto para el colaborador involucrado como para el líder del equipo.';
const path = '/checklist-incidente-seguridad';

export const generateMetadata = toolMetadata({ title, description, path });

export default function ChecklistIncidenteSeguridadPage() {
  return (
    <div className="flex flex-col space-y-8">
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Checklist de Mitigación de Incidentes"
        subtitle="Qué hacer de inmediato ante un incidente de seguridad, como colaborador o como líder del equipo. Tu progreso se guarda en este navegador."
      />

      <ToolFullscreen className="container mx-auto max-w-3xl px-4 py-8">
        <IncidentChecklist />
      </ToolFullscreen>
    </div>
  );
}
