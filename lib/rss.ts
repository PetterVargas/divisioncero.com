import { Feed } from 'feed';
import { cyberacademySource, ciberseguridadEmpresarialSource, selfHostingSource, blog } from '@/lib/source';
import { appName, appDescription, baseUrl } from '@/lib/shared';
import { defaultLocale } from '@/lib/i18n';

export function getRSS() {
  const feed = new Feed({
    title: appName,
    description: appDescription,
    id: baseUrl,
    link: baseUrl,
    language: 'es',
    copyright: `All rights reserved ${new Date().getFullYear()}`,
  });

  const docsPages = [
    ...cyberacademySource.getPages(defaultLocale),
    ...ciberseguridadEmpresarialSource.getPages(defaultLocale),
    ...selfHostingSource.getPages(defaultLocale),
  ];

  for (const page of docsPages) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      link: `${baseUrl}${page.url}`,
      date: new Date(),
    });
  }

  for (const page of blog.getPages(defaultLocale)) {
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
