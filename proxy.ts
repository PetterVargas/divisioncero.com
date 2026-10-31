import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, isLocale, localeCookie, negotiateLocale } from '@/lib/i18n';

const cookieOptions = { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' } as const;

/**
 * Idioma por URL: español sin prefijo (reescrito internamente a `/es/...`) e inglés en `/en/...`.
 *
 * - `/en/...`: se sirve en inglés y se recuerda en la cookie.
 * - `/es/...`: redirige a la ruta sin prefijo y recuerda el español (lo usa el selector de idioma).
 * - Sin prefijo: usa la cookie; en la primera visita, el idioma del navegador (`Accept-Language`).
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split('/')[1];

  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || '/';
    const res = NextResponse.redirect(url);
    res.cookies.set(localeCookie, defaultLocale, cookieOptions);
    return res;
  }

  if (isLocale(first)) {
    const res = NextResponse.next();
    if (request.cookies.get(localeCookie)?.value !== first) res.cookies.set(localeCookie, first, cookieOptions);
    return res;
  }

  const stored = request.cookies.get(localeCookie)?.value;
  const locale = isLocale(stored) ? stored : negotiateLocale(request.headers.get('accept-language'));

  if (locale !== defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
    const res = NextResponse.redirect(url);
    res.headers.set('Vary', 'Accept-Language, Cookie');
    return res;
  }

  return NextResponse.rewrite(new URL(`/${defaultLocale}${pathname === '/' ? '' : pathname}${search}`, request.url));
}

export const config = {
  // Fuera del ruteo por idioma: internos de Next, archivos estáticos con extensión (incluidas las
  // imágenes OG y los índices de búsqueda generados en el build), endpoints (llms.txt/mdx, APIs de
  // herramientas) y las presentaciones de Slidev, que son HTML estático.
  matcher: [
    '/((?!_next/|llms|kudo/llms|cyberacademy/llms|herramientas/api/|cyberacademy/presentaciones/.+|.*\\.[^/]+$).*)',
  ],
};
