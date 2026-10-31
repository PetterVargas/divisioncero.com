// Genera las páginas MDX de la referencia de la API a partir de
// openapi/divisioncero-api.json. Se ejecuta con `pnpm openapi:generate`.
import { rmSync } from 'node:fs';
import { generateFiles } from 'fumadocs-openapi';
import { openapi } from '../lib/openapi';

const output = './content/ciberseguridad-empresarial/api';

// Las carpetas por tag se regeneran completas; index.mdx y meta.json se mantienen.
for (const tag of ['risks', 'incidents', 'controls', 'policies', 'assets', 'third-parties', 'projects', 'audit-findings']) {
  rmSync(`${output}/${tag}`, { recursive: true, force: true });
}

await generateFiles({
  input: openapi,
  output,
  per: 'operation',
  groupBy: 'tag',
  includeDescription: true,
  // `risks.create` → `create`: un punto en la URL haría que el hosting
  // estático lo tome como extensión y no sirva el `.html` exportado.
  name(output) {
    if (output.type !== 'operation') return output.item.name;
    const { path, method } = output.item;
    const operationId = this.document.paths?.[path]?.[method]?.operationId ?? `${method}-${path}`;
    return operationId
      .split('.')
      .pop()!
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .toLowerCase();
  },
});
