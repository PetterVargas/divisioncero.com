import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { ChecklistGroup } from '@/components/herramientas/checklist-group';
import { toolMetadata } from '@/lib/herramientas/seo';
import { teamChecklistSections } from './_lib/checklist-data';
import { en } from './i18n';

const title = 'Checklist de Buenas Prácticas del Equipo';
const description =
  'Verifica como líder que tu equipo y sus equipos de cómputo cumplan con las buenas prácticas y protecciones básicas de ciberseguridad.';
const path = '/checklist-buenas-practicas-equipo';

export const generateMetadata = toolMetadata({ title, description, path });

export default function ChecklistBuenasPracticasEquipoPage() {
  return (
    <div className="flex flex-col space-y-8">
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Checklist de Buenas Prácticas del Equipo"
        subtitle="Verifica que tu equipo y sus colaboradores cumplan con las protecciones básicas de ciberseguridad. Tu progreso se guarda en este navegador."
      />

      <ToolFullscreen className="container mx-auto max-w-3xl px-4 py-8">
        <ChecklistGroup
          storageKey="herramientas:checklist-buenas-practicas-equipo"
          sections={teamChecklistSections}
          en={en}
        />
      </ToolFullscreen>
    </div>
  );
}
