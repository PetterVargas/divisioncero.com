import { z } from 'zod';

import { json, type ApiHandler } from '../../../lib/herramientas/api/http';
import { verifyCaptcha } from '../../../lib/herramientas/api/turnstile';

import {
  parseProfileUrl,
  platforms,
  type SocialProfileResponse,
} from '../../../app/herramientas/identificador-id-red-social/_lib/platforms';

import { ProfileLookupError, profileFetchers } from '../../../lib/herramientas/api/social-fetchers';

const RequestSchema = z.object({
  platform: z.enum(platforms, { error: 'Red social no soportada' }),
  url: z.string().max(500, 'La URL es demasiado larga'),
});

function errorResponse(error: string, status: number) {
  return json<SocialProfileResponse>({ success: false, error }, { status });
}

export const onRequestPost: ApiHandler = async ({ request, env }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Solicitud inválida', 400);
  }

  const validation = RequestSchema.safeParse(body);
  if (!validation.success) {
    return errorResponse(validation.error.issues[0]?.message || 'Solicitud inválida', 400);
  }

  const { platform, url } = validation.data;
  const target = parseProfileUrl(platform, url);
  if (typeof target === 'string') return errorResponse(target, 400);

  const captchaError = await verifyCaptcha(request, env.CAPTCHA_SECRET_TOKEN);
  if (captchaError) return errorResponse(captchaError, 403);

  try {
    const profile = await profileFetchers[platform](target);
    return json<SocialProfileResponse>({
      success: true,
      data: { ...profile, platform, inputUrl: url.trim(), queriedAt: new Date().toISOString() },
    });
  } catch (error) {
    if (error instanceof ProfileLookupError) return errorResponse(error.message, error.status);
    return errorResponse('No se pudo consultar el perfil', 502);
  }
}
