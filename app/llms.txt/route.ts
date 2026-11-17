import {
  blog,
  ciberseguridadEmpresarialSource,
  getBlogPageMarkdownUrl,
  selfHostingSource,
} from '@/lib/source';
import { llms } from 'fumadocs-core/source';
import { appDescription, baseUrl } from '@/lib/shared';
import { internalTools, toolsMarkdown } from '@/lib/herramientas/llms';
import { absoluteLinks as absolute, nestSection as nested, textResponse } from '@/lib/llms';

export const revalidate = false;

// Índice raíz según https://llmstxt.org: qué es DivisionCero, dónde está cada
// proyecto y su versión en Markdown para LLMs.
export async function GET() {
  const [empresas, selfHosting] = await Promise.all([
    llms(ciberseguridadEmpresarialSource).index(),
    llms(selfHostingSource).index(),
  ]);

  const posts = blog
    .getPages()
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .map(
      (page) =>
        `- [${page.data.title}](${baseUrl}${page.url}): ${page.data.description ?? ''} (Markdown: ${baseUrl}${getBlogPageMarkdownUrl(page).url})`,
    )
    .join('\n');

  const content = `# DivisionCero

> DivisionCero es una comunidad y plataforma de Ciberseguridad para Latinoamérica (${appDescription}). Publica el Kudo Framework (framework de ciberseguridad open-source), CyberAcademy (cursos gratuitos de ciberseguridad en español), herramientas gratuitas de ciberseguridad y servicios de ciberseguridad para empresas.

Todo el contenido está en español. Cada sección tiene su propio llms.txt (índice) y llms-full.txt (texto completo en Markdown).

## Proyectos

- [Kudo Framework](${baseUrl}/kudo): framework de ciberseguridad open-source por y para LatAm, con dominios, controles, cuestionarios de autoevaluación y adaptación a OSCAL. Índice: ${baseUrl}/kudo/llms.txt · Completo: ${baseUrl}/kudo/llms-full.txt
- [CyberAcademy](${baseUrl}/cyberacademy): cursos gratuitos de ciberseguridad en español (CyberUsuario, CyberGuardián y los dominios del Kudo Framework), con diplomas y presentaciones. Índice: ${baseUrl}/cyberacademy/llms.txt · Completo: ${baseUrl}/cyberacademy/llms-full.txt
- [Herramientas de Ciberseguridad](${baseUrl}/herramientas): ${internalTools.length} herramientas gratuitas en español. Índice: ${baseUrl}/herramientas/llms.txt
- [Ciberseguridad empresarial](${baseUrl}/docs/ciberseguridad-empresarial): servicios de ciberseguridad como servicio (CSaaS) y su API.
- [Precios](${baseUrl}/precios): planes de DivisionCero.
- [Open source](${baseUrl}/open-source): proyectos abiertos de DivisionCero.

## Herramientas

${absolute(toolsMarkdown({ headingLevel: 3 }))}

## Blog

${posts}

## Documentación: Ciberseguridad empresarial

${absolute(nested(empresas))}

## Documentación: Self-hosting

${absolute(nested(selfHosting))}

## Optional

- [Releases](${baseUrl}/releases): lanzamientos y actualizaciones de la plataforma.
- [Legal](${baseUrl}/legal): términos, privacidad y demás documentos legales.
- [RSS](${baseUrl}/rss.xml): feed del blog y releases.
- [Contenido completo de la documentación](${baseUrl}/llms-full.txt)
`;

  return textResponse(content);
}
