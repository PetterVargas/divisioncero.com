import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteLayout } from '@/components/site-layout';

// En la exportación estática se genera como `out/404.html`, que Cloudflare sirve con estado 404
// para cualquier ruta que no exista (`not_found_handling: "404-page"` en wrangler.jsonc).
export const metadata: Metadata = {
  title: 'Página no encontrada',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <SiteLayout>
      <main className="container flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <p className="text-sm font-medium text-fd-primary">404</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Página no encontrada</h1>
        <p className="max-w-md text-fd-muted-foreground">
          Es posible que la página que buscas se haya eliminado, haya cambiado de nombre o no esté disponible temporalmente.
        </p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center rounded-md bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
        >
          Volver al inicio
        </Link>
      </main>
    </SiteLayout>
  );
}
