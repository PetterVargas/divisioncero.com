import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';
import { VulnerabilityQuizDynamic } from './_components/vulnerability-quiz-dynamic';

const title = 'Detector de Código Vulnerable';
const description =
  'Analiza fragmentos de código reales y decide si son vulnerables o seguros: OWASP Top 10, Top 10 de IA/LLM, secretos hardcodeados, SCA, SAST, DAST y pentesting.';
const path = '/detector-codigo-vulnerable';

export const generateMetadata = toolMetadata({ title, description, path });

export default function DetectorCodigoVulnerablePage() {
  return (
    <div className="flex flex-col space-y-8">
      <ToolJsonLd title={title} description={description} path={path} />
      <ToolPageHeader
        title="Detector de Código Vulnerable"
        subtitle="Revisa cada fragmento de código y decide si es vulnerable o seguro. Un fallo reinicia la práctica desde el inicio, con los ejemplos en orden aleatorio."
      />

      <ToolFullscreen className="container mx-auto max-w-2xl px-4 py-8">
        <VulnerabilityQuizDynamic />
      </ToolFullscreen>
    </div>
  );
}
