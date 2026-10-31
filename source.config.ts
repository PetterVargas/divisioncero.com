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

export const cyberacademyDocs = defineDocs({ dir: 'content/docs/cyberacademy', ...docsConfig });
// Incluye la referencia de la API generada por fumadocs-openapi (`pnpm openapi:generate`),
// cuyas páginas guardan en `_openapi` el método HTTP que muestra la barra lateral.
export const ciberseguridadEmpresarialDocs = defineDocs({
  dir: 'content/ciberseguridad-empresarial',
  ...docsConfig,
  docs: {
    ...docsConfig.docs,
    schema: pageSchema.extend({ _openapi: z.looseObject({}).optional() }),
  },
});
export const selfHostingDocs = defineDocs({ dir: 'content/self-hosting', ...docsConfig });

// Kudo (divisioncero.com/kudo)
export const frameworkDocs = defineDocs({ dir: 'content/kudo/framework', ...docsConfig });
export const sgxDocs = defineDocs({ dir: 'content/kudo/sgx', ...docsConfig });

// CyberAcademy (divisioncero.com/cyberacademy)
export const cyberusuarioDocs = defineDocs({ dir: 'content/cyberacademy/cyberusuario', ...docsConfig });
export const cyberguardianDocs = defineDocs({ dir: 'content/cyberacademy/cyberguardian', ...docsConfig });
export const corDocs = defineDocs({ dir: 'content/cyberacademy/cor', ...docsConfig });
export const cipDocs = defineDocs({ dir: 'content/cyberacademy/cip', ...docsConfig });
export const cifDocs = defineDocs({ dir: 'content/cyberacademy/cif', ...docsConfig });
export const capDocs = defineDocs({ dir: 'content/cyberacademy/cap', ...docsConfig });
export const ccnDocs = defineDocs({ dir: 'content/cyberacademy/ccn', ...docsConfig });
export const thpDocs = defineDocs({ dir: 'content/cyberacademy/thp', ...docsConfig });
export const diaDocs = defineDocs({ dir: 'content/cyberacademy/dia', ...docsConfig });
export const adrDocs = defineDocs({ dir: 'content/cyberacademy/adr', ...docsConfig });

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

export const legalPosts = defineCollections({
  type: 'doc',
  dir: 'content/legal',
  schema: pageSchema.extend({
    effectiveDate: z.string(),
  }),
});