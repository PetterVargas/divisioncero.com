import type { LayoutTab } from 'fumadocs-ui/layouts/shared';
import { getSidebarTabs } from 'fumadocs-ui/components/sidebar/tabs';
import { frameworkRoute, sgxRoute } from './shared';
import { frameworkSource, sgxSource } from './source';
import {
  LayoutTemplate, ShieldCheck,
  BookOpen, Network, GitMerge, FileText, BookMarked, ClipboardList, Package,
  ShieldAlert, Code2, RefreshCw, Server, Fingerprint, Building2, Database, Users,
} from 'lucide-react';
import type { ReactNode } from 'react';

export function getSectionTabs(): LayoutTab[] {
  return [
  {
    title: 'Framework',
    description: 'La documentación del framework',
    icon: <LayoutTemplate className="size-4" />,
    url: frameworkRoute,
  },
  {
    title: 'SGX',
    description: 'Sistema de Gestión',
    icon: <ShieldCheck className="size-4" />,
    url: sgxRoute,
  },
  ].map((tab) => ({ ...tab, description: tab.description, url: tab.url }));
}

const frameworkIcons: Record<string, ReactNode> = {
  Overview: <BookOpen className="size-4" />,
  MCN: <Network className="size-4" />,
  ADR: <ShieldAlert className="size-4" />,
  CAP: <Code2 className="size-4" />,
  CCN: <RefreshCw className="size-4" />,
  CIF: <Server className="size-4" />,
  CIP: <Fingerprint className="size-4" />,
  COR: <Building2 className="size-4" />,
  DIA: <Database className="size-4" />,
  THP: <Users className="size-4" />,
  OSCAL: <GitMerge className="size-4" />,
  Cuestionarios: <ClipboardList className="size-4" />,
};

const sgxIcons: Record<string, ReactNode> = {
  'Políticas y Procedimientos': <FileText className="size-4" />,
  Procedimientos: <BookMarked className="size-4" />,
  Aprovisionamiento: <Package className="size-4" />,
  Correlación: <GitMerge className="size-4" />,
};

export function getFrameworkSubTabs(): LayoutTab[] {
  return getSidebarTabs(frameworkSource.getPageTree(), {
    transform: (option) => ({
      ...option,
      icon: frameworkIcons[String(option.title)] ?? option.icon,
    }),
  });
}

export function getSgxSubTabs(): LayoutTab[] {
  return getSidebarTabs(sgxSource.getPageTree(), {
    transform: (option) => ({
      ...option,
      icon: sgxIcons[String(option.title)] ?? option.icon,
    }),
  });
}

// La navegación es la de divisioncero.com; cada sección conserva sus tabs y sidebar.
export { baseOptions } from '@/lib/layout.shared';
