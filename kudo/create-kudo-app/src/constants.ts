export const DOMINIOS = {
  COR: { id: 'cor', nombre: 'COR - Coherencia Organizacional', descripcion: 'Gobierno, riesgos y cumplimiento' },
  CIP: { id: 'cip', nombre: 'CIP - Ciberseguridad en Identidad y Puntos Finales', descripcion: 'Gestión de identidades y dispositivos' },
  CIF: { id: 'cif', nombre: 'CIF - Ciberseguridad en Infraestructura', descripcion: 'Nube, redes, cifrado y claves' },
  CAP: { id: 'cap', nombre: 'CAP - Ciberseguridad en Aplicaciones', descripcion: 'Desarrollo seguro y APIs' },
  CCN: { id: 'ccn', nombre: 'CCN - Continuidad y Cambios del Negocio', descripcion: 'Gestión de cambios y continuidad' },
  ADR: { id: 'adr', nombre: 'ADR - Análisis, Detección y Respuesta', descripcion: 'Vulnerabilidades, monitoreo e incidentes' },
  THP: { id: 'thp', nombre: 'THP - Talento Humano y Proveedores', descripcion: 'Personas, trabajo remoto y proveedores' },
  DIA: { id: 'dia', nombre: 'DIA - Datos e Inteligencia Artificial', descripcion: 'Protección de datos e IA' },
} as const;

export const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn'] as const;

/** Paquete del servidor MCP de Kudo que se configura en los proyectos generados. */
export const KUDO_MCP_PACKAGE = '@divisioncero/kudo-mcp';

export type PackageManager = typeof PACKAGE_MANAGERS[number];
export type DominioId = keyof typeof DOMINIOS;
