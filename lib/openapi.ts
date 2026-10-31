import { createOpenAPI } from 'fumadocs-openapi/server';

// Spec de la API pública de la plataforma (csaas-divisioncero, /api/v1/openapi.json).
// Para actualizarlo, reemplaza el archivo y ejecuta `pnpm openapi:generate`.
export const openapi = createOpenAPI({
  input: {
    'divisioncero-api': './openapi/divisioncero-api.json',
  },
});
