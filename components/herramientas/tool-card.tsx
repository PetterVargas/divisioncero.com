'use client';

import Link from 'next/link';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import type { Tool } from '@/lib/herramientas/tools';
import { useI18n } from '@/components/herramientas/i18n-provider';
import { localizeUrl } from '@/lib/i18n';
import { toolIcons } from '@/lib/herramientas/tool-icons';


export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = toolIcons[tool.iconName];
  const { locale, dict } = useI18n();
  const t = dict.home;
  const className =
    'group block rounded-xl border border-border bg-card/80 backdrop-blur-sm p-4 transition-all hover:border-primary/40 hover:bg-card';

  const content = (
    <>
      <div className="flex items-center justify-between mb-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </span>
        {tool.external ? (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-1 translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0" />
        ) : (
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
        )}
      </div>
      <div className="flex items-center gap-1.5 mb-1">
        <h2 className="text-sm font-semibold">{tool.title}</h2>
        {tool.external && !tool.firstParty && (
          <span className="inline-flex items-center rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium leading-none text-muted-foreground">
            {t.external}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {tool.description}
      </p>
    </>
  );

  return tool.external ? (
    <a
      href={tool.href}
      target="_blank"
      rel="noopener noreferrer"
      title={tool.title}
      className={className}
    >
      {content}
    </a>
  ) : (
    <Link href={localizeUrl(tool.href, locale)} title={tool.title} className={className}>
      {content}
    </Link>
  );
}
