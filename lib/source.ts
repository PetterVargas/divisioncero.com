import { cyberacademyDocs, ciberseguridadEmpresarialDocs, selfHostingDocs, blogPosts, releasePosts, legalPosts } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import {
  cyberacademyRoute, cyberacademyImageRoute, cyberacademyContentRoute,
  ciberseguridadEmpresarialRoute, ciberseguridadEmpresarialImageRoute, ciberseguridadEmpresarialContentRoute,
  selfHostingRoute, selfHostingImageRoute, selfHostingContentRoute,
  blogImageRoute, releasesImageRoute,
} from './shared';

export const cyberacademySource = loader({
  baseUrl: cyberacademyRoute,
  source: cyberacademyDocs.toFumadocsSource(),
  plugins: [],
});

export const ciberseguridadEmpresarialSource = loader({
  baseUrl: ciberseguridadEmpresarialRoute,
  source: ciberseguridadEmpresarialDocs.toFumadocsSource(),
  plugins: [],
});

export const selfHostingSource = loader({
  baseUrl: selfHostingRoute,
  source: selfHostingDocs.toFumadocsSource(),
  plugins: [],
});

export const blog = loader({
  baseUrl: '/blog',
  source: toFumadocsSource(blogPosts, []),
});

export const releases = loader({
  baseUrl: '/releases',
  source: toFumadocsSource(releasePosts, []),
});

export const legal = loader({
  baseUrl: '/legal',
  source: toFumadocsSource(legalPosts, []),
});

export function getCyberacademyPageImage(page: (typeof cyberacademySource)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];
  return { segments, url: `${cyberacademyImageRoute}/${segments.join('/')}` };
}

export function getCyberacademyPageMarkdownUrl(page: (typeof cyberacademySource)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];
  return { segments, url: `${cyberacademyContentRoute}/${segments.join('/')}` };
}

export function getCiberseguridadEmpresarialPageImage(page: (typeof ciberseguridadEmpresarialSource)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];
  return { segments, url: `${ciberseguridadEmpresarialImageRoute}/${segments.join('/')}` };
}

export function getCiberseguridadEmpresarialPageMarkdownUrl(page: (typeof ciberseguridadEmpresarialSource)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];
  return { segments, url: `${ciberseguridadEmpresarialContentRoute}/${segments.join('/')}` };
}

export function getSelfHostingPageImage(page: (typeof selfHostingSource)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];
  return { segments, url: `${selfHostingImageRoute}/${segments.join('/')}` };
}

export function getSelfHostingPageMarkdownUrl(page: (typeof selfHostingSource)['$inferPage']) {
  const segments = [...page.slugs, 'content.md'];
  return { segments, url: `${selfHostingContentRoute}/${segments.join('/')}` };
}

export function getBlogPageImage(page: (typeof blog)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];
  return { segments, url: `${blogImageRoute}/${segments.join('/')}` };
}

export function getReleasePageImage(page: (typeof releases)['$inferPage']) {
  const segments = [...page.slugs, 'image.png'];
  return { segments, url: `${releasesImageRoute}/${segments.join('/')}` };
}

export async function getLLMText(
  page:
    | (typeof cyberacademySource)['$inferPage']
    | (typeof ciberseguridadEmpresarialSource)['$inferPage']
    | (typeof selfHostingSource)['$inferPage'],
) {
  const processed = await page.data.getText('processed');
  return `# ${page.data.title} (${page.url})\n\n${processed}`;
}
