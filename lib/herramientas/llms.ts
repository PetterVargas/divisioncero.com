import { baseUrl } from '@/lib/shared';
import { categories, tools } from '@/lib/herramientas/tools';

/** Herramientas propias de divisioncero.com (las externas enlazan a otros sitios). */
export const internalTools = tools.filter((tool) => !tool.external && tool.href.startsWith('/herramientas/'));

function toolLine(tool: (typeof tools)[number]) {
  const url = tool.external ? tool.href : `${baseUrl}${tool.href}`;
  return `- [${tool.title}](${url}): ${tool.description}`;
}

/** Catálogo de herramientas en Markdown, agrupado por categoría (para llms.txt). */
export function toolsMarkdown({ headingLevel = 2 }: { headingLevel?: number } = {}) {
  const hashes = '#'.repeat(headingLevel);
  return categories
    .map((category) => {
      const items = tools.filter((tool) => tool.categories[0] === category);
      if (items.length === 0) return '';
      return `${hashes} ${category}\n\n${items.map(toolLine).join('\n')}`;
    })
    .filter(Boolean)
    .join('\n\n');
}
