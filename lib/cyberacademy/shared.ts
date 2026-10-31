import { baseUrl } from '@/lib/shared';

export { baseUrl, gitConfig } from '@/lib/shared';

export const appName = 'CyberAcademy';

// CyberAcademy vive bajo divisioncero.com/cyberacademy
export const academyRoute = '/cyberacademy';
export const academyUrl = `${baseUrl}${academyRoute}`;

// Next.js replaces the whole `alternates` object per route segment rather than
// deep-merging it, so any page that sets its own `alternates.canonical` must
// re-spread this to keep the RSS autodiscovery link from the root layout.
export const rssAlternateTypes = {
  'application/rss+xml': [{ title: appName, url: `${academyUrl}/rss.xml` }],
};

export const homeImageRoute = `${academyRoute}/og/home/image.png`;

export const cyberusuarioRoute = `${academyRoute}/cyberusuario`;
export const cyberusuarioImageRoute = `${academyRoute}/og/cyberusuario`;
export const cyberusuarioContentRoute = `${academyRoute}/llms.mdx/cyberusuario`;

// Índice de presentaciones. Cada deck (Slidev, cyberacademy/presentaciones) se
// compila en el build dentro de esta misma ruta: /cyberacademy/presentaciones/<slug>/
export const presentacionesRoute = `${academyRoute}/presentaciones`;

// Ruta del contenido dentro del repositorio (enlaces "editar en GitHub" y lectura en build).
export const contentDir = 'content/cyberacademy';

export const domains = [
  { slug: 'cor', name: 'COR', title: 'Coherencia Organizacional', description: 'Gobernanza y estructura organizacional' },
  { slug: 'cip', name: 'CIP', title: 'Ciberseguridad en Identidad y Puntos Finales', description: 'Gestión de identidades y dispositivos' },
  { slug: 'cif', name: 'CIF', title: 'Ciberseguridad en Infraestructura', description: 'Seguridad en infraestructura y redes' },
  { slug: 'cap', name: 'CAP', title: 'Ciberseguridad en Aplicaciones', description: 'Desarrollo seguro y AppSec' },
  { slug: 'ccn', name: 'CCN', title: 'Continuidad y Cambios del Negocio', description: 'Gestión de cambios y continuidad' },
  { slug: 'thp', name: 'THP', title: 'Ciberseguridad en Talento Humano y Proveedores', description: 'Gestión de personas y proveedores' },
  { slug: 'dia', name: 'DIA', title: 'Ciberseguridad en Datos e Inteligencia Artificial', description: 'Protección de datos e inteligencia artificial' },
  { slug: 'adr', name: 'ADR', title: 'Análisis, Detección y Respuesta de Ciberseguridad', description: 'Detección y respuesta a incidentes' },
] as const;
