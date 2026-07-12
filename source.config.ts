import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { remarkMdxMermaid, rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import { remarkBlockId } from 'fumadocs-core/mdx-plugins/remark-block-id';
import { defineConfig, defineDocs, defineCollections } from 'fumadocs-mdx/config';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

const docsConfig = {
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
};

export const cyberacademyDocs = defineDocs({ dir: 'content/cyberacademy', ...docsConfig });
export const ciberseguridadEmpresarialDocs = defineDocs({ dir: 'content/ciberseguridad-empresarial', ...docsConfig });

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath, remarkMdxMermaid, [remarkBlockId, { addDataAttribute: 'feedback' }]],
    rehypePlugins: (v) => [rehypeKatex, ...v],
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
      ],
    },
  },
});

export const blogPosts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: pageSchema.extend({
    author: z.string().optional(),
    date: z.string().or(z.date()),
    categories: z.array(z.string()).optional(),
  }),
});

export const releasePosts = defineCollections({
  type: 'doc',
  dir: 'content/release',
  schema: pageSchema.extend({
    version: z.string(),
    date: z.string().or(z.date()),
  }),
});