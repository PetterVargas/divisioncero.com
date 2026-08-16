import type { MetadataRoute } from 'next';
import { cyberacademySource, ciberseguridadEmpresarialSource, blog, releases } from '@/lib/source';
import { baseUrl } from '@/lib/shared';

export const revalidate = false;

const staticRoutes = [
  '',
  '/docs',
  '/precios',
  '/open-source',
  '/trust-center',
  '/blog',
  '/releases',
  '/politica-de-privacidad',
  '/politica-de-cookies',
  '/terminos-de-servicio',
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

  return [...staticEntries, ...docsEntries, ...blogEntries, ...releaseEntries];
}
