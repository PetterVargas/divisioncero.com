import { cyberacademySource, ciberseguridadEmpresarialSource } from '@/lib/source';
import { createSearchAPI } from 'fumadocs-core/search/server';

export const revalidate = false;

export const { staticGET: GET } = createSearchAPI('advanced', {
  indexes: [
    ...cyberacademySource.getPages().map((page) => ({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      structuredData: page.data.structuredData,
    })),
    ...ciberseguridadEmpresarialSource.getPages().map((page) => ({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      structuredData: page.data.structuredData,
    })),
  ],
  language: 'english',
});
