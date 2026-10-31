import { cyberacademySource, ciberseguridadEmpresarialSource, selfHostingSource } from '@/lib/source';
import type { Graph } from '../components/graph-view';
import { defaultLocale } from '@/lib/i18n';

export function buildGraph(): Graph {
  const sources = [cyberacademySource, ciberseguridadEmpresarialSource, selfHostingSource];
  const graph: Graph = { links: [], nodes: [] };

  for (const source of sources) {
    for (const page of source.getPages(defaultLocale)) {
      graph.nodes.push({
        id: page.url,
        url: page.url,
        text: page.data.title,
        description: page.data.description,
      });

      const { extractedReferences = [] } = page.data;
      for (const ref of extractedReferences) {
        const refPage =
          cyberacademySource.getPageByHref(ref.href) ??
          ciberseguridadEmpresarialSource.getPageByHref(ref.href) ??
          selfHostingSource.getPageByHref(ref.href);
        if (!refPage) continue;

        graph.links.push({
          source: page.url,
          target: refPage.page.url,
        });
      }
    }
  }

  return graph;
}
