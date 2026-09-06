import Link from 'next/link';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookIcon, FileTextIcon, UserIcon, LogInIcon, GraduationCapIcon, WrenchIcon, TagIcon, NewspaperIcon, BookOpenIcon, PresentationIcon } from 'lucide-react';
import { NavTitle } from '@/components/nav-title';

// Mirrors fumadocs-ui's internal nav item classes (desktop `main` variant via
// `sm:`, mobile-menu `main` variant via `max-sm:`) so a hand-authored `title`
// attribute can be added without losing the built-in look at either size.
const navLinkClassName = '[&_svg]:size-4 sm:inline-flex sm:items-center sm:gap-1 sm:p-2 sm:text-sm sm:text-fd-muted-foreground sm:transition-colors sm:hover:text-fd-accent-foreground sm:data-[active=true]:text-fd-primary max-sm:inline-flex max-sm:items-center max-sm:gap-2 max-sm:py-1.5 max-sm:transition-colors max-sm:hover:text-fd-popover-foreground/50 max-sm:data-[active=true]:font-medium max-sm:data-[active=true]:text-fd-primary';

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/(learn)/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: NavTitle,
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [
    {
      type: 'custom',
      children: (
        <Link
          href="https://cyberacademy.divisioncero.com/"
          title="CyberAcademy"
          target="_blank"
          rel="noopener noreferrer"
          className={navLinkClassName}
        >
          <GraduationCapIcon />
          CyberAcademy
        </Link>
      ),
    },
    {
      type: 'custom',
      children: (
        <Link
          href="https://kudo.divisioncero.com"
          title="Kudo"
          target="_blank"
          rel="noopener noreferrer"
          className={navLinkClassName}
        >
          <BookIcon />
          Kudo
        </Link>
      ),
    },
    {
      type: 'custom',
      children: (
        <Link href="/precios" title="Precio" className={navLinkClassName}>
          <TagIcon />
          Precio
        </Link>
      ),
    },
    {
      type: 'custom',
      children: (
        <Link href="/docs" title="Documentación" className={navLinkClassName}>
          <BookOpenIcon />
          Docs
        </Link>
      ),
    },
    {
      type: 'menu',
      text: 'Recursos',
      items: [
        {
          icon: <NewspaperIcon />,
          text: 'Blog',
          description: 'Artículos y actualizaciones sobre ciberseguridad',
          url: '/blog',
          menu: { title: 'Blog' },
        },
        {
          icon: <FileTextIcon />,
          text: 'Open Sources',
          description: 'Proyectos y contribuciones abiertos',
          url: '/open-source',
          menu: { title: 'Open Sources' },
        },
        {
          icon: <WrenchIcon />,
          text: 'Herramientas',
          description: 'Ayuda en Ciberseguridad',
          url: 'https://herramientas.divisioncero.com/',
          menu: { title: 'Herramientas de Ciberseguridad' },
        },
        {
          icon: <BookIcon />,
          text: 'Releases',
          description: 'Actualizaciones sobre la plataforma',
          url: '/releases',
          menu: { title: 'Releases' },
        },
        {
          icon: <PresentationIcon />,
          text: 'Presentaciones',
          description: 'Material de las sesiones de CyberAcademy',
          url: 'https://presentaciones.divisioncero.com/',
          menu: { title: 'Presentaciones' },
        },
      ],
    },
    {
      type: 'custom',
      secondary: true,
      children: (
        <Link
          href="https://github.com/PetterVargas/"
          title="Síguenos en GitHub"
          aria-label="GitHub"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring hover:bg-fd-accent hover:text-fd-accent-foreground p-1.5 [&_svg]:size-5"
        >
          <svg role="img" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        </Link>
      ),
    },
    {
      type: 'custom',
      secondary: true,
      children: (
        <Link
          href="https://app.divisioncero.com/auth/sign-in"
          title="Iniciar sesión"
          target="_blank"
          rel="noopener noreferrer"
          className={navLinkClassName}
        >
          <LogInIcon />
          <span className="block md:inline">Login</span>
        </Link>
      ),
    },
    {
      type: 'custom',
      secondary: true,
      children: (
        <Link
          href="https://app.divisioncero.com/auth/sign-up"
          title="Regístrate en DivisionCero"
          target="_blank"
          rel="noopener noreferrer"
          className={navLinkClassName}
        >
          <UserIcon />
          <span className="bg-fd-primary hover:bg-fd-primary/90 dark:bg-fd-primary/80 dark:hover:bg-fd-primary text-fd-primary-foreground rounded-md px-3 py-1 font-bold block md:inline-block">Regístrate</span>
        </Link>
      ),
    },
  ],
};
