import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache';

// El contenido solo cambia al desplegar: las páginas prerenderizadas (docs, cursos, blog en
// ambos idiomas) se sirven desde los assets del worker sin volver a renderizar el MDX.
const config = defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  // Sirve las páginas prerenderizadas (HTML y payloads RSC de los prefetch) desde la capa de
  // routing, sin cargar el handler de Next (~51 MiB). Sin esto, cada isolate nuevo evalúa ese
  // bundle completo y la petición gasta ~1 s de CPU aunque la página ya esté en los assets.
  enableCacheInterception: true,
});

export default {
  ...config,
  // `build:next` usa webpack: Turbopack duplica el índice de contenido MDX en varios chunks y
  // el Worker pasa el límite de 64 MiB de Cloudflare (67,5 MiB vs ~51 MiB con webpack).
  // defineCloudflareConfig() no reenvía `buildCommand`: sin esto OpenNext ejecuta
  // `pnpm build`, que a su vez es `opennextjs-cloudflare build` (bucle infinito).
  buildCommand: 'pnpm run build:next',
};
