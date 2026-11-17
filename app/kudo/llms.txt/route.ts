import { frameworkSource, sgxSource } from '@/lib/kudo/source';
import { appDescription } from '@/lib/kudo/shared';
import { llms } from 'fumadocs-core/source';
import { baseUrl } from '@/lib/shared';
import { absoluteLinks, nestSection, textResponse } from '@/lib/llms';

export const revalidate = false;

export async function GET() {
  const sections = await Promise.all([llms(frameworkSource).index(), llms(sgxSource).index()]);

  const content = `# Kudo Framework

> ${appDescription}

Sitio: ${baseUrl}/kudo (en español). Texto completo en Markdown: ${baseUrl}/kudo/llms-full.txt. Índice general de DivisionCero: ${baseUrl}/llms.txt.

${sections.map((section) => absoluteLinks(nestSection(section))).join('\n\n')}
`;

  return textResponse(content);
}
