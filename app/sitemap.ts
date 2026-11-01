import type { MetadataRoute } from 'next';
import { execFileSync } from 'node:child_process';
import { cyberacademySource, ciberseguridadEmpresarialSource, selfHostingSource, blog, releases, legal } from '@/lib/source';
import { frameworkSource, sgxSource } from '@/lib/kudo/source';
import { cyberusuarioSource, cyberguardianSource, allDomainSources } from '@/lib/cyberacademy/source';
import { domains } from '@/lib/cyberacademy/shared';
import { getDeckGroups } from '@/lib/cyberacademy/presentaciones';
import { baseUrl } from '@/lib/shared';
import { tools } from '@/lib/herramientas/tools';

export const revalidate = false;

// Fecha del último commit que tocó la ruta, para no reportar en cada build que
// todo el sitio cambió. Si git no está disponible se omite el campo.
function getGitLastModified(path: string): Date | undefined {
  try {
    const output = execFileSync('git', ['log', '-1', '--format=%cI', '--', path], {
      cwd: process.cwd(),
      encoding: 'utf-8',
    }).trim();
    return output ? new Date(output) : undefined;
  } catch {
    return undefined;
  }
}

// Páginas propias del sitio.
const staticRoutes: { path: string; source: string }[] = [
  { path: '', source: 'app/(home)/page.tsx' },
  { path: '/docs', source: 'app/(home)/docs/page.tsx' },
  { path: '/precios', source: 'app/(home)/precios/page.tsx' },
  { path: '/open-source', source: 'app/(home)/open-source/page.tsx' },
  { path: '/legal', source: 'content/legal' },
  { path: '/blog', source: 'content/blog' },
  { path: '/releases', source: 'content/release' },
  { path: '/kudo', source: 'app/kudo/(home)' },
  { path: '/cyberacademy', source: 'content/cyberacademy' },
  { path: '/cyberacademy/cursos', source: 'content/cyberacademy' },
  { path: '/cyberacademy/que-quieres-aprender-hoy', source: 'app/cyberacademy/(home)/que-quieres-aprender-hoy' },
  { path: '/cyberacademy/presentaciones', source: 'cyberacademy/presentaciones/decks.json' },
  { path: '/herramientas', source: 'app/herramientas' },
];

/** Entrada del sitemap de una ruta. */
function entry(path: string, lastModified?: Date): MetadataRoute.Sitemap {
  return [{ url: `${baseUrl}${path || '/'}`, lastModified }];
}

// Secciones de Kudo y CyberAcademy con el directorio de su contenido.
const projectSources = [
  { source: frameworkSource, dir: 'content/kudo/framework' },
  { source: sgxSource, dir: 'content/kudo/sgx' },
  { source: cyberusuarioSource, dir: 'content/cyberacademy/cyberusuario' },
  { source: cyberguardianSource, dir: 'content/cyberacademy/cyberguardian' },
  ...allDomainSources.map((source, i) => ({ source, dir: `content/cyberacademy/${domains[i].slug}` })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticRoutes.flatMap(({ path, source }) =>
    entry(path, getGitLastModified(source)),
  );

  const docsEntries = [
    { source: cyberacademySource, dir: 'content/docs/cyberacademy' },
    { source: ciberseguridadEmpresarialSource, dir: 'content/ciberseguridad-empresarial' },
    { source: selfHostingSource, dir: 'content/self-hosting' },
  ].flatMap(({ source, dir }) =>
    source.getPages().flatMap((page) => entry(page.url, getGitLastModified(`${dir}/${page.path}`))),
  );

  const projectEntries = projectSources.flatMap(({ source, dir }) =>
    source
      .getPages()
      .flatMap((page: { url: string; path: string }) => entry(page.url, getGitLastModified(`${dir}/${page.path}`))),
  );

  // Cada presentación (Slidev) se publica en /cyberacademy/presentaciones/<slug>/.
  const deckLastModified = getGitLastModified('cyberacademy/presentaciones/slides');
  const deckEntries: MetadataRoute.Sitemap = getDeckGroups().flatMap((group) =>
    group.decks
      .filter((deck) => !deck.noindex)
      .map((deck) => ({ url: `${baseUrl}${deck.url}`, lastModified: deckLastModified })),
  );

  const postEntries = [...blog.getPages(), ...releases.getPages()].flatMap((page) =>
    entry(page.url, new Date(page.data.date)),
  );

  const legalEntries = legal
    .getPages()
    .flatMap((page) => entry(page.url, getGitLastModified(`content/legal/${page.path}`)));

  // Herramientas propias (las externas del catálogo enlazan a otros sitios).
  const toolsLastModified = getGitLastModified('app/herramientas');
  const toolEntries = tools
    .filter((tool) => !tool.external && tool.href.startsWith('/herramientas/'))
    .flatMap((tool) => entry(tool.href, toolsLastModified));

  return [
    ...staticEntries,
    ...docsEntries,
    ...projectEntries,
    ...deckEntries,
    ...postEntries,
    ...legalEntries,
    ...toolEntries,
  ];
}
