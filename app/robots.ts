import type { MetadataRoute } from 'next';
import { baseUrl } from '@/lib/shared';

export const revalidate = false;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Índices de búsqueda estáticos de cada sección
      disallow: ['/api/', '/kudo/api/', '/cyberacademy/api/', '/herramientas/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
