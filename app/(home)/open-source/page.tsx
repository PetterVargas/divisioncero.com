import Link from 'next/link';
import { ShieldCheck, GraduationCap, Wrench, ArrowRight } from 'lucide-react';

const projects = [
  {
    title: 'Kudo',
    tagline: 'Cumplimiento de ciberseguridad',
    description: 'Framework abierto de políticas y procedimientos de ciberseguridad, pensado para ayudar a las empresas de LatAm a alcanzar y mantener el cumplimiento.',
    href: 'https://github.com/PetterVargas/kudo',
    icon: ShieldCheck,
  },
  {
    title: 'CyberAcademy',
    tagline: 'Capacitación en Ciberseguridad',
    description: 'Contenido y rutas de aprendizaje abiertas, con casos prácticos y reales, para que cualquier persona en LatAm aprenda Ciberseguridad resolviendo problemas.',
    href: 'https://github.com/PetterVargas/cyberacademy',
    icon: GraduationCap,
  },
  {
    title: 'Herramientas DivisionCero',
    tagline: 'Utilidades de ciberseguridad',
    description: 'Colección de herramientas abiertas para tareas de ciberseguridad, creadas para agilizar el trabajo diario de la comunidad en LatAm.',
    href: 'https://github.com/PetterVargas/herramientas',
    icon: Wrench,
  },
];

export default function OpenSourcePage() {
  return (
    <main className="grow w-full max-w-(--fd-layout-width) mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Código abierto</h1>
        <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto">
          Ciberseguridad creada por y para LatAm. Estos son los proyectos de código abierto que impulsamos
          para que la comunidad aprenda, contribuya y asegure junto a nosotros.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map(({ title, tagline, description, href, icon: Icon }) => (
          <Link
            key={title}
            href={href}
            {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="group flex flex-col gap-4 p-8 rounded-xl border border-fd-border/60 bg-fd-card/40 hover:border-fd-foreground/40 hover:bg-fd-card/70 transition-all duration-200 shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-fd-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="h-6 w-6 text-fd-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{title}</h2>
                <p className="text-sm text-fd-muted-foreground">{tagline}</p>
              </div>
            </div>
            <p className="text-fd-muted-foreground text-lg">{description}</p>
            <div className="flex items-center text-fd-primary font-medium mt-2">
              Ver documentación <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="https://github.com/PetterVargas"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-fd-foreground border border-fd-border hover:bg-fd-muted/50 rounded-lg transition-colors"
        >
          <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          Ver más en GitHub
        </Link>
      </div>
    </main>
  );
}

export function generateMetadata() {
  return {
    title: 'Código abierto | DivisionCero',
    description: 'Proyectos y contribuciones de código abierto de DivisionCero para la comunidad de ciberseguridad en LatAm.',
  };
}
