import type { NextRequest } from 'next/server';
import { msg, requestLocale } from './i18n/api';

/** Header en el que el cliente envía el token de Cloudflare Turnstile. */
export const CAPTCHA_HEADER = 'x-captcha-token';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface SiteverifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

/**
 * Valida el token de Turnstile contra siteverify. Devuelve null si es válido o
 * el mensaje de error para responder al cliente. Falla cerrado: sin secreto
 * configurado ninguna consulta pasa.
 * Ver https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
export async function verifyCaptcha(request: NextRequest): Promise<string | null> {
  const locale = requestLocale(request);
  const secret = process.env.CAPTCHA_SECRET_TOKEN;
  if (!secret) {
    console.error('CAPTCHA_SECRET_TOKEN no está configurado');
    return msg(locale, 'La verificación anti-bots no está disponible. Intenta más tarde', 'The anti-bot check is not available. Please try again later');
  }

  const token = request.headers.get(CAPTCHA_HEADER);
  // Los tokens de Turnstile miden como máximo 2048 caracteres.
  if (!token || token.length > 2048) {
    return msg(locale, 'Completa la verificación anti-bots antes de consultar', 'Complete the anti-bot check before searching');
  }

  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  const ip = request.headers.get('cf-connecting-ip');
  if (ip) form.append('remoteip', ip);

  try {
    const response = await fetch(SITEVERIFY_URL, { method: 'POST', body: form });
    const result: SiteverifyResponse = await response.json();
    if (result.success) return null;
    console.warn('Turnstile rechazó el token', result['error-codes']);
  } catch (error) {
    console.error('No se pudo contactar a Turnstile', error);
  }
  return msg(locale, 'La verificación anti-bots falló o expiró. Vuelve a intentarlo', 'The anti-bot check failed or expired. Please try again');
}
