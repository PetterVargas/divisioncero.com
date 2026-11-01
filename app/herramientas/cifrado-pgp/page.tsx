import { ToolPageHeader } from '@/components/herramientas/tool-page-header';
import { ToolFullscreen } from '@/components/herramientas/tool-fullscreen';
import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';

import { ConceptGlossary } from './_components/concept-glossary';
import { PgpFlowDiagram } from './_components/pgp-flow-diagram';
import { ComparisonCards } from './_components/comparison-cards';
import { purposeComparison, symmetryComparison } from './_lib/comparisons';

const title = 'Cifrado PGP Explicado';
const description =
  'Cómo funciona el cifrado PGP paso a paso: claves públicas y privadas, cifrado híbrido para confidencialidad y firma digital para autenticidad.';
const path = '/cifrado-pgp';

export const generateMetadata = toolMetadata({ title, description, path });

export default function CifradoPgpPage() {
  return (
    <div className="flex flex-col space-y-8">
      <ToolJsonLd title={title} description={description} path={path} kind="article" />
      <ToolPageHeader
        title="Cifrado PGP Explicado"
        subtitle="Entiende paso a paso cómo Alice y Bob usan PGP para cifrar un mensaje confidencial o para firmarlo digitalmente."
      />

      <ToolFullscreen className="container mx-auto max-w-5xl space-y-12 px-4 py-8">
        <ConceptGlossary />

        <div className="flex flex-col items-center">
          <PgpFlowDiagram />
        </div>

        <div className="space-y-10">
          <ComparisonCards title="Cifrar vs. Firmar" items={purposeComparison} />
          <ComparisonCards title="Cifrado simétrico vs. asimétrico" items={symmetryComparison} />
        </div>
      </ToolFullscreen>
    </div>
  );
}
