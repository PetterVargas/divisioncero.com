import type { MetadataRoute } from 'next';
import { execFileSync } from 'node:child_process';
import { ciberseguridadEmpresarialSource, blog, releases, legal } from '@/lib/source';
import { baseUrl } from '@/lib/shared';

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

const staticRoutes: { path: string; source: string }[] = [
  { path: '', source: 'app/(home)/page.tsx' },
  { path: '/docs', source: 'app/(home)/docs/page.tsx' },
  { path: '/precios', source: 'app/(home)/precios/page.tsx' },
  { path: '/open-source', source: 'app/(home)/open-source/page.tsx' },
  { path: '/legal', source: 'content/legal' },
  { path: '/blog', source: 'content/blog' },
  { path: '/releases', source: 'content/release' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, source }) => ({
    url: `${baseUrl}${path}`,
    lastModified: getGitLastModified(source),
  }));

  const docsEntries: MetadataRoute.Sitemap = ciberseguridadEmpresarialSource.getPages().map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: getGitLastModified(`content/ciberseguridad-empresarial/${page.path}`),
  }));

  const blogEntries: MetadataRoute.Sitemap = blog.getPages().map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(page.data.date),
  }));

  const releaseEntries: MetadataRoute.Sitemap = releases.getPages().map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(page.data.date),
  }));

  const legalEntries: MetadataRoute.Sitemap = legal.getPages().map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: getGitLastModified(`content/legal/${page.path}`),
  }));

  return [...staticEntries, ...docsEntries, ...blogEntries, ...releaseEntries, ...legalEntries];
}
