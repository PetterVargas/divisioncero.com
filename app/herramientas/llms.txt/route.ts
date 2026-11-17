import { baseUrl } from '@/lib/shared';
import { textos } from '@/lib/herramientas/textos';
import { internalTools, toolsMarkdown } from '@/lib/herramientas/llms';
import { textResponse } from '@/lib/llms';

export const revalidate = false;

export function GET() {
  const content = `# Herramientas de Ciberseguridad de DivisionCero

> ${textos.meta.siteDescription}

Catálogo: ${baseUrl}/herramientas. Son ${internalTools.length} herramientas gratuitas y en español, sin registro. La mayoría procesa los datos en el navegador del usuario (contraseñas, hashes, archivos, codificadores); algunas consultan un servicio externo (cuál es mi IP, WHOIS, validador SPF). Otras son recursos educativos y de concientización con quizzes (phishing, grooming, sexting, sextorsión, PII, tríada CIA).

${toolsMarkdown()}
`;

  return textResponse(content);
}
