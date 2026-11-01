import type { LayoutTab } from 'fumadocs-ui/layouts/shared';
import { getSidebarTabs } from 'fumadocs-ui/components/sidebar/tabs';
import { academyRoute, cyberusuarioRoute } from './shared';
import { cyberusuarioSource } from './source';
import * as PageTree from 'fumadocs-core/page-tree';
import {
  ShieldCheck, Shield,
  FileText, BookMarked,
  Building2, Cloud, Code, RefreshCw, Users, Database, Search,
} from 'lucide-react';
import type { ReactNode } from 'react';

const sectionTabs: LayoutTab[] = [
  {
    title: 'CyberUsuario',
    description: 'Sistema de Gestión',
    icon: <ShieldCheck className="size-4" />,
    url: cyberusuarioRoute,
  },
  {
    title: 'CyberGuardián',
    description: 'Dominios',
    icon: <Shield className="size-4" />,
    url: `${academyRoute}/cyberguardian`,
  },
];

const domainTabs: LayoutTab[] = [
  { title: 'COR', description: 'Coherencia Organizacional', icon: <Building2 className="size-4" />, url: `${academyRoute}/cor` },
  { title: 'CIP', description: 'Identidad y Puntos Finales', icon: <ShieldCheck className="size-4" />, url: `${academyRoute}/cip` },
  { title: 'CIF', description: 'Infraestructura', icon: <Cloud className="size-4" />, url: `${academyRoute}/cif` },
  { title: 'CAP', description: 'Aplicaciones', icon: <Code className="size-4" />, url: `${academyRoute}/cap` },
  { title: 'CCN', description: 'Continuidad', icon: <RefreshCw className="size-4" />, url: `${academyRoute}/ccn` },
  { title: 'THP', description: 'Talento Humano', icon: <Users className="size-4" />, url: `${academyRoute}/thp` },
  { title: 'DIA', description: 'Datos e IA', icon: <Database className="size-4" />, url: `${academyRoute}/dia` },
  { title: 'ADR', description: 'Detección y Respuesta', icon: <Search className="size-4" />, url: `${academyRoute}/adr` },
];

export function getAllTabs(): LayoutTab[] {
  return [...sectionTabs, ...domainTabs].map((tab) => ({
    ...tab,
    description: String(tab.description),
    url: tab.url,
  }));
}

const cyberusuarioIcons: Record<string, ReactNode> = {
  Políticas: <FileText className="size-4" />,
};

export function getCyberusuarioSubTabs(): LayoutTab[] {
  return getSidebarTabs(cyberusuarioSource.getPageTree(), {
    transform: (option) => ({
      ...option,
      icon: cyberusuarioIcons[String(option.title)] ?? option.icon,
    }),
  });
}

const domainSubIcons: Record<string, ReactNode> = {
  Principal: <FileText className="size-4" />,
  Secundario: <BookMarked className="size-4" />,
};

export function getDomainSubTabs(tree: PageTree.Root): LayoutTab[] {
  return getSidebarTabs(tree, {
    transform: (option) => ({
      ...option,
      icon: domainSubIcons[String(option.title)] ?? option.icon,
    }),
  });
}

// La navegación es la de divisioncero.com; cada sección conserva sus tabs y sidebar.
export { baseOptions } from '@/lib/layout.shared';
