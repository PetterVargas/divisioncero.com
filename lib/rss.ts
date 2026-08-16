import { Feed } from 'feed';
import { cyberacademySource, ciberseguridadEmpresarialSource, blog } from '@/lib/source';
import { appName, appDescription, baseUrl } from '@/lib/shared';

export function getRSS() {
  const feed = new Feed({
    title: appName,
    description: appDescription,
    id: baseUrl,
    link: baseUrl,
    language: 'es',
    copyright: `All rights reserved ${new Date().getFullYear()}`,
  });

  const docsPages = [...cyberacademySource.getPages(), ...ciberseguridadEmpresarialSource.getPages()];

  for (const page of docsPages) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      link: `${baseUrl}${page.url}`,
      date: new Date(),
    });
  }

  for (const page of blog.getPages()) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      link: `${baseUrl}${page.url}`,
      date: new Date(page.data.date),
      author: page.data.author ? [{ name: page.data.author }] : undefined,
    });
  }

  return feed.rss2();
}
