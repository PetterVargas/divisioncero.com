import { cyberusuarioSource, cyberguardianSource, allDomainSources } from '@/lib/cyberacademy/source';
import { llms } from 'fumadocs-core/source';
import { baseUrl } from '@/lib/shared';
import { absoluteLinks, nestSection, textResponse } from '@/lib/llms';

export const revalidate = false;

export async function GET() {
  const sections = await Promise.all([
    llms(cyberusuarioSource).index(),
    llms(cyberguardianSource).index(),
    ...allDomainSources.map((s) => llms(s).index()),
  ]);

  const content = `# CyberAcademy

> Cursos gratuitos de Ciberseguridad en español de DivisionCero, organizados según los dominios del Kudo Framework.

CyberAcademy (${baseUrl}/cyberacademy) incluye las rutas CyberUsuario y CyberGuardián y contenido por cada dominio del Kudo Framework (COR, CIP, CIF, CAP, CCN, THP, DIA, ADR). Catálogo de cursos: ${baseUrl}/cyberacademy/cursos. Texto completo en Markdown: ${baseUrl}/cyberacademy/llms-full.txt. Índice general de DivisionCero: ${baseUrl}/llms.txt.

${sections.map((section) => absoluteLinks(nestSection(section))).join('\n\n')}
`;

  return textResponse(content);
}
