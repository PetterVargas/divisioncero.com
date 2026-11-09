import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';

import { CountdownTimer } from './_components/countdown-timer';

const title = 'Temporizador';
const description =
  'Temporizador de cuenta regresiva para charlas, clases y transmisiones: define los minutos, proyéctalo en pantalla completa y cambia de color en los últimos 10 segundos.';
const path = '/temporizador';

export const generateMetadata = toolMetadata({ title, description, path });

export default function TemporizadorPage() {
  return (
    <div className="flex flex-col space-y-8">
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Temporizador"
        subtitle="Cuenta regresiva para tus sesiones: elige el tiempo, ponlo en pantalla completa y comienza."
      />

      <div className="container mx-auto max-w-6xl px-4 pb-12">
        <CountdownTimer />
      </div>
    </div>
  );
}
