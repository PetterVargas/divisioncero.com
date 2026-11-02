import type { ReactNode } from 'react';
import { HeroGrid } from '@/components/hero-grid';

/** Clases del fondo del hero de la página principal: cuadrícula animada que se desvanece hacia los bordes. */
export const heroGridClassName =
  'absolute inset-0 w-full h-full pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_85%)]';

/**
 * Fondo del hero de la página principal (degradado + `HeroGrid`) para el primer
 * pantallazo de una página. Va dentro de un contenedor `relative overflow-hidden`.
 */
export function HeroGridBackdrop() {
  return (
    <div className="absolute inset-x-0 top-0 h-screen pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-fd-primary/5 via-transparent to-fd-secondary/5" />
      <HeroGrid className={heroGridClassName} />
    </div>
  );
}

/**
 * Envuelve el `<main>` de una página de ancho limitado (blog, releases, docs, precios…)
 * para que el fondo ocupe todo el ancho. El `<main>` debe llevar `relative z-10`.
 */
export function HeroGridPage({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex grow flex-col overflow-hidden">
      <HeroGridBackdrop />
      {children}
    </div>
  );
}
