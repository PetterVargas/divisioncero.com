// Genera los índices de búsqueda estáticos (Orama) en `public/search/<idioma>/<sección>.json`.
// Antes los servían las rutas `api/search` de la app; como el navegador descarga el índice y
// busca en local, no hace falta que el Worker de Cloudflare cargue el código ni el contenido.
// Se ejecuta antes de `next build` (ver `build:next` en package.json).
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { createSearchAPI } from 'fumadocs-core/search/server';
import { i18n } from '@/lib/i18n';
import { cyberacademySource, ciberseguridadEmpresarialSource, selfHostingSource } from '@/lib/source';
import { frameworkSource, sgxSource } from '@/lib/kudo/source';
import { cyberusuarioSource, cyberguardianSource, allDomainSources } from '@/lib/cyberacademy/source';

type Page = {
  url: string;
  data: { title?: string; description?: string; structuredData: { headings: unknown[]; contents: unknown[] } };
};
type Source = { getPages: (lang: string) => Page[] };

// Kudo y CyberAcademy tienen su propio índice; el resto del sitio comparte el de divisioncero.com.
// El cliente elige el índice en `components/search.tsx`.
const indexes: { name: string; sources: Source[] }[] = [
  { name: 'site', sources: [cyberacademySource, ciberseguridadEmpresarialSource, selfHostingSource] },
  { name: 'kudo', sources: [frameworkSource, sgxSource] },
  { name: 'cyberacademy', sources: [cyberusuarioSource, cyberguardianSource, ...allDomainSources] },
];

async function main() {
  for (const lang of i18n.languages) {
    for (const { name, sources } of indexes) {
      const { staticGET } = createSearchAPI('advanced', {
        indexes: sources.flatMap((source) =>
          source.getPages(lang).map((page) => ({
            id: page.url,
            title: page.data.title ?? '',
            description: page.data.description,
            url: page.url,
            structuredData: page.data.structuredData as never,
          })),
        ),
        language: 'english',
      });
      const file = join('public', 'search', lang, `${name}.json`);
      await mkdir(dirname(file), { recursive: true });
      await writeFile(file, await (await staticGET()).text());
    }
  }
  console.log(`[search] ${i18n.languages.length * indexes.length} índices generados en public/search/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
