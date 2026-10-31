import { baseUrl } from '@/lib/shared';

export { baseUrl, gitConfig } from '@/lib/shared';

export const appName = 'Kudo';

export const appDescription =
  'Kudo es el framework de ciberseguridad abierto de LatAm: SGX, 35 controles adaptados a OSCAL y más de 25 templates de políticas listos para implementar.';

// Kudo vive bajo divisioncero.com/kudo
export const kudoRoute = '/kudo';
export const kudoUrl = `${baseUrl}${kudoRoute}`;

export const frameworkRoute = `${kudoRoute}/framework`;
export const frameworkImageRoute = `${kudoRoute}/og/framework`;
export const frameworkContentRoute = `${kudoRoute}/llms.mdx/framework`;

export const sgxRoute = `${kudoRoute}/sgx`;
export const sgxImageRoute = `${kudoRoute}/og/sgx`;
export const sgxContentRoute = `${kudoRoute}/llms.mdx/sgx`;

export const homeImageRoute = `${kudoRoute}/og/home/image.png`;

// Ruta del contenido dentro del repositorio, para los enlaces "editar en GitHub".
export const contentDir = 'content/kudo';

// Next.js does not deep-merge `openGraph` between layout and page metadata:
// any page that defines its own `openGraph` object silently drops the root
// layout's siteName/locale. Spread this into every page-level openGraph object.
export const defaultOpenGraph = {
  siteName: appName,
  locale: 'es_419',
} as const;
