import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// El contenido solo cambia al desplegar: las páginas prerenderizadas (docs, cursos, blog en
// ambos idiomas) se sirven desde los assets del worker sin volver a renderizar el MDX.
const config = defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});

export default {
  ...config,
  // `build:next` usa webpack: Turbopack duplica el índice de contenido MDX en varios chunks y
  // el Worker pasa el límite de 64 MiB de Cloudflare (67,5 MiB vs ~51 MiB con webpack).
  // defineCloudflareConfig() no reenvía `buildCommand`: sin esto OpenNext ejecuta
  // `pnpm build`, que a su vez es `opennextjs-cloudflare build` (bucle infinito).
  buildCommand: 'pnpm run build:next',
};
