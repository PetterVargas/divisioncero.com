/**
 * Utilidades compartidas por las Pages Functions de `functions/herramientas/api/`.
 * Solo usan APIs web estándar (Request/Response/fetch), así que no dependen de Next.
 */

/** Variables y secretos del proyecto de Pages que usan las APIs. */
export interface ApiEnv {
  CAPTCHA_SECRET_TOKEN?: string;
}

/** Contexto mínimo que Cloudflare Pages pasa a `onRequestPost`. */
export interface ApiContext {
  request: Request;
  env: ApiEnv;
}

export type ApiHandler = (context: ApiContext) => Promise<Response>;

export function json<T>(body: T, init?: ResponseInit): Response {
  return Response.json(body, init);
}
