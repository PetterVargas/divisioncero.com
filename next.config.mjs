import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  // Exportación estática: `next build` genera `out/`, que Cloudflare sirve como assets
  // (ver wrangler.jsonc). Las redirecciones van en `public/_redirects`.
  output: 'export',
  reactStrictMode: true,
  serverExternalPackages: ['typescript', 'twoslash'],
  // La exportación estática no tiene optimizador de imágenes.
  images: {
    unoptimized: true,
  },
};

export default withMDX(config);
