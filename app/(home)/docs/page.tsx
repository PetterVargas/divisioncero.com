import Link from 'next/link';
import { GraduationCap, Shield, ArrowRight } from 'lucide-react';
import { pageMetadata } from '@/lib/shared';

const sections = [
  {
    title: 'CyberAcademy',
    description: 'Rutas de aprendizaje, convenciones y evaluaciones para aprender ciberseguridad resolviendo problemas reales.',
    href: '/docs/cyberacademy',
    icon: GraduationCap,
  },
  {
    title: 'Empresas',
    description: 'Documentación sobre servicios de ciberseguridad empresarial y automatización.',
    href: '/docs/ciberseguridad-empresarial',
    icon: Shield,
  },
];

export default function DocsIndexPage() {
  return (
    <main className="grow w-full max-w-(--fd-layout-width) mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Documentación</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {sections.map(({ title, description, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-4 p-6 rounded-xl border border-fd-border/60 bg-fd-card/40 hover:border-fd-foreground/40 hover:bg-fd-card/70 transition-all duration-200 shadow-sm"
          >
            <div className="w-11 h-11 bg-fd-primary/10 rounded-lg flex items-center justify-center">
              <Icon className="h-5 w-5 text-fd-primary" />
            </div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-fd-muted-foreground text-sm">{description}</p>
            <div className="flex items-center text-fd-primary text-sm font-medium mt-auto">
              Ver más <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export function generateMetadata() {
  return pageMetadata({
    path: '/docs',
    title: 'Documentación',
    description: 'Índice de documentación de DivisionCero: CyberAcademy y Empresas.',
  });
}
