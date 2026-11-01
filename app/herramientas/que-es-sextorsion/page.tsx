import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/herramientas/ui/tabs';

import { SextortionPhaseCards } from './_components/sextortion-phase-cards';
import { SextortionGuidance } from './_components/sextortion-guidance';
import { SextortionQuizDynamic } from './_components/sextortion-quiz-dynamic';

const title = '¿Qué es la sextorsión?';
const description =
  'Herramienta educativa para que padres, niños, niñas y adolescentes entiendan cómo funciona la sextorsión, sus fases, señales de alerta y qué hacer si ocurre.';
const path = '/que-es-sextorsion';

export const generateMetadata = toolMetadata({ title, description, path });

export default function QueEsSextorsionPage() {
  return (
    <div className="flex flex-col space-y-8">
      <ToolJsonLd title={title} description={description} path={path} kind="article" />
      <ToolPageHeader
        title="¿Qué es la sextorsión?"
        subtitle="Cómo alguien amenaza con difundir imágenes íntimas —reales o falsas— para exigir dinero o más contenido, y cómo reaccionar."
      />

      <ToolFullscreen className="container mx-auto max-w-5xl space-y-8 px-4 py-8">
        <Tabs defaultValue="aprender">
          <TabsList>
            <TabsTrigger value="aprender" data-test="tab-aprender">
              Aprender
            </TabsTrigger>
            <TabsTrigger value="practicar" data-test="tab-practicar">
              Identificar (quiz)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="aprender" className="space-y-8">
            <SextortionPhaseCards />
            <SextortionGuidance />
          </TabsContent>

          <TabsContent value="practicar">
            <SextortionQuizDynamic />
          </TabsContent>
        </Tabs>
      </ToolFullscreen>
    </div>
  );
}
