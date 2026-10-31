'use client';

import { usePathname } from 'next/navigation';
import { useI18n } from '@/components/herramientas/i18n-provider';
import { getTools } from '@/lib/herramientas/i18n/tools';

/**
 * Cabecera de cada herramienta. En inglés usa el título y la descripción del catálogo
 * traducido (`lib/herramientas/i18n/tools.ts`), localizado por el slug de la URL.
 */
export function ToolPageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { locale } = useI18n();
  const slug = usePathname().split('/').filter(Boolean).at(-1);
  const translated = locale === 'es' ? undefined : getTools(locale).find((tool) => tool.slug === slug);

  return (
    <div className="border-b border-border py-6 xl:py-8 2xl:py-10">
      <div className="container mx-auto flex flex-col items-center gap-y-2 lg:gap-y-3 px-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight xl:text-5xl">{translated?.title ?? title}</h1>
        <h2 className="text-muted-foreground text-lg 2xl:text-2xl">{translated?.description ?? subtitle}</h2>
      </div>
    </div>
  );
}
