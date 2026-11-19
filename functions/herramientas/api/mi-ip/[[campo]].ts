import { respondMiIp, type CfRequest } from '../../../../lib/herramientas/api/mi-ip';

/**
 * API de "¿Cuál es mi IP?": la consulta la página (`/todo.json`) y también
 * funciona desde la terminal, por ejemplo
 * `curl https://divisioncero.com/herramientas/api/mi-ip/ua`.
 */
export const onRequestGet = ({ request, params }: { request: CfRequest; params: { campo?: string[] } }) =>
  respondMiIp(request, params.campo);
