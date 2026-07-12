import { cyberacademyDocs, ciberseguridadEmpresarialDocs, blogPosts, releasePosts } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import {
  cyberacademyRoute, cyberacademyImageRoute, cyberacademyContentRoute,
  ciberseguridadEmpresarialRoute, ciberseguridadEmpresarialImageRoute, ciberseguridadEmpresarialContentRoute,
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

export const blog = loader({
  baseUrl: '/blog',
  source: toFumadocsSource(blogPosts, []),
});

export const releases = loader({
  baseUrl: '/releases',
  source: toFumadocsSource(releasePosts, []),
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

export async function getLLMText(
  page:
    | (typeof cyberacademySource)['$inferPage']
    | (typeof ciberseguridadEmpresarialSource)['$inferPage'],
) {
  const processed = await page.data.getText('processed');
  return `# ${page.data.title} (${page.url})\n\n${processed}`;
}
