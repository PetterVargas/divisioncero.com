'use client';
import SearchDialog from '@/components/search';
import { RootProvider } from 'fumadocs-ui/provider/base';
import { FrameworkProvider, type Framework } from 'fumadocs-core/framework';
import type { I18nProviderProps } from 'fumadocs-ui/contexts/i18n';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { defaultLocale, localeCookie, stripLocale } from '@/lib/i18n';
import { type ReactNode, useMemo } from 'react';

/**
 * El español se sirve sin prefijo reescribiendo `/kudo` → `/es/kudo` (ver `proxy.ts`). Al
 * prerenderizar, `usePathname()` devuelve la ruta interna `/es/kudo` y en el navegador `/kudo`:
 * sin normalizarla, el sidebar y los selectores de sección no coinciden al hidratar.
 */
function useSitePathname() {
  const pathname = usePathname();
  return pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`) ? stripLocale(pathname) : pathname;
}

export function Provider({ i18n, children }: { i18n: I18nProviderProps; children: ReactNode }) {
  const i18nProps = useMemo(
    () => ({
      ...i18n,
      // Se navega siempre a `/<idioma>/<ruta>`: `proxy.ts` guarda la elección en la cookie
      // (y para el español redirige a la ruta sin prefijo). Recarga completa para que
      // también cambie el `<html lang>` del layout raíz.
      onLocaleChange(value: string) {
        // La cookie se escribe aquí también, antes de salir, para que la elección no dependa
        // de la respuesta de `/<idioma>/...` (ver `proxy.ts`).
        document.cookie = `${localeCookie}=${value}; path=/; max-age=31536000; samesite=lax`;
        const path = stripLocale(window.location.pathname);
        window.location.assign(`/${value}${path === '/' ? '' : path}${window.location.search}${window.location.hash}`);
      },
    }),
    [i18n],
  );

  return (
    // Igual que `NextProvider` de fumadocs-core, salvo `usePathname`.
    <FrameworkProvider
      usePathname={useSitePathname}
      useRouter={useRouter}
      useParams={useParams}
      Link={Link as Framework['Link']}
      Image={Image as Framework['Image']}
    >
      <RootProvider search={{ SearchDialog }} i18n={i18nProps}>
        {children}
      </RootProvider>
    </FrameworkProvider>
  );
}
