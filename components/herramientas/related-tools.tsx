'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ToolCard } from '@/components/herramientas/tool-card';
import { tools, type Tool } from '@/lib/herramientas/tools';

const MAX_RELATED = 6;

/** Herramientas propias que comparten más categorías con `current`, en el orden del catálogo. */
function getRelatedTools(current: Tool): Tool[] {
  return tools
    .filter((tool) => tool.slug !== current.slug && !tool.external)
    .map((tool, index) => ({
      tool,
      index,
      shared: tool.categories.filter((c) => current.categories.includes(c)).length,
    }))
    .sort((a, b) => b.shared - a.shared || a.index - b.index)
    .slice(0, MAX_RELATED)
    .map(({ tool }) => tool);
}

/**
 * Enlaces a herramientas relacionadas al final de cada herramienta. Se prerenderiza
 * en el HTML estático, así los buscadores encuentran y relacionan las herramientas
 * entre sí en lugar de llegar a cada una solo desde el catálogo.
 */
export function RelatedTools() {
  const pathname = usePathname()?.replace(/\/$/, '');
  const current = tools.find((tool) => tool.href === pathname);
  if (!current) return null;

  const related = getRelatedTools(current);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="herramientas-relacionadas" className="border-t border-border">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="herramientas-relacionadas" className="text-xl font-semibold tracking-tight">
            Herramientas relacionadas
          </h2>
          <Link href="/herramientas" className="text-sm font-medium text-primary hover:underline">
            Ver todas las herramientas
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} heading="h3" />
          ))}
        </div>
      </div>
    </section>
  );
}
