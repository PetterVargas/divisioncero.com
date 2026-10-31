import { createMDX } from 'fumadocs-mdx/next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  serverExternalPackages: ['typescript', 'twoslash'],
  // El worker de Cloudflare no ejecuta el optimizador de imágenes de Next:
  // las imágenes del contenido de Kudo y CyberAcademy se sirven tal cual.
  images: {
    unoptimized: true,
  },
  // URLs antiguas de herramientas (antes en herramientas.divisioncero.com).
  async redirects() {
    return [
      { source: '/herramientas/hash-archivo', destination: '/herramientas/generador-y-validador-hash-archivo', permanent: true },
      { source: '/herramientas/whois-ip', destination: '/herramientas/whois-ip-y-dominio', permanent: true },
      { source: '/en/herramientas/hash-archivo', destination: '/en/herramientas/generador-y-validador-hash-archivo', permanent: true },
      { source: '/en/herramientas/whois-ip', destination: '/en/herramientas/whois-ip-y-dominio', permanent: true },
    ];
  },
};

export default withMDX(config);

void initOpenNextCloudflareForDev();
