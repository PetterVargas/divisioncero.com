import type { MetadataRoute } from 'next';
import { cyberacademySource, ciberseguridadEmpresarialSource, blog, releases, legal } from '@/lib/source';
import { baseUrl } from '@/lib/shared';

export const revalidate = false;

const staticRoutes = [
  '',
  '/docs',
  '/precios',
  '/open-source',
  '/legal',
  '/blog',
  '/releases',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const docsEntries: MetadataRoute.Sitemap = [
    ...cyberacademySource.getPages(),
    ...ciberseguridadEmpresarialSource.getPages(),
  ].map((page) => ({
    url: `${baseUrl}${page.url}`,
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
  }));

  return [...staticEntries, ...docsEntries, ...blogEntries, ...releaseEntries, ...legalEntries];
}
