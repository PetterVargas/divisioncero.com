'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@/components/ui/button';
import { bannerKey } from '@/lib/banner';

const maskImage = 'linear-gradient(to bottom,white,transparent), radial-gradient(circle at top center, white, transparent)';

/**
 * Banner descartable con fondo "rainbow", equivalente al <Banner> de
 * fumadocs-ui pero sin el <script> inline que este renderiza (React avisa en
 * consola). El script equivalente vive en el <head> del root layout.
 */
export function SiteBanner({
  id,
  rainbowColors,
  height = '3rem',
  children,
}: {
  id: string;
  rainbowColors: string[];
  height?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const key = bannerKey(id);

  useEffect(() => {
    try {
      if (localStorage.getItem(key) === 'true') setOpen(false);
    } catch {
      // Sin acceso a localStorage el banner simplemente se muestra.
    }
  }, [key]);

  function onClose() {
    setOpen(false);
    try {
      localStorage.setItem(key, 'true');
    } catch {
      // Ignorado: el cierre solo dura esta visita.
    }
  }

  if (!open) return null;

  return (
    <div
      id={id}
      className="sticky top-0 z-40 flex flex-row items-center justify-center px-4 text-center text-sm font-medium bg-fd-background"
      style={{ height }}
    >
      <style>{`:root:not(.${key}) { --fd-banner-height: ${height}; } .${key} #${id} { display: none; }`}</style>
      <div
        className="absolute inset-0 -z-1"
        style={{
          maskImage,
          maskComposite: 'intersect',
          animation: 'fd-moving-banner 20s linear infinite',
          backgroundImage: `repeating-linear-gradient(70deg, ${[...rainbowColors, rainbowColors[0]]
            .map((color, i) => `${color} ${(i * 50) / rainbowColors.length}%`)
            .join(', ')})`,
          backgroundSize: '200% 100%',
          filter: 'saturate(2)',
        }}
      />
      <style>{'@keyframes fd-moving-banner { from { background-position: 0% 0; } to { background-position: 100% 0; } }'}</style>
      {children}
      <button
        type="button"
        aria-label="Cerrar banner"
        title="Cerrar banner"
        onClick={onClose}
        className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'absolute inset-e-2 top-1/2 -translate-y-1/2 text-fd-muted-foreground/50')}
      >
        <X />
      </button>
    </div>
  );
}
