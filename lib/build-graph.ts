import { cyberacademySource, ciberseguridadEmpresarialSource } from '@/lib/source';
import type { Graph } from '../components/graph-view';

export function buildGraph(): Graph {
  const sources = [cyberacademySource, ciberseguridadEmpresarialSource];
  const graph: Graph = { links: [], nodes: [] };

  for (const source of sources) {
    for (const page of source.getPages()) {
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
          ciberseguridadEmpresarialSource.getPageByHref(ref.href);
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
