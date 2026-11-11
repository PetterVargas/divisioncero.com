'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface EcosystemPanel {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  cta: string;
}

/**
 * Minimal two-column list of products: hairline dividers, small inline icon,
 * title + one-line description and an arrow that nudges on hover. Rows fade
 * up softly as the section scrolls into view.
 */
export function EcosystemPanels({ items }: { items: EcosystemPanel[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-ecosystem-panel]', el);
      gsap.fromTo(
        cards,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 max-w-4xl mx-auto px-4">
      {items.map((panel) => (
        <a
          key={panel.title}
          data-ecosystem-panel
          href={panel.href}
          title={panel.cta}
          {...(panel.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="group flex items-start gap-4 py-6 border-t border-fd-border/70"
        >
          <span className="mt-0.5 shrink-0 text-fd-muted-foreground group-hover:text-fd-primary transition-colors">
            {panel.icon}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-semibold">{panel.title}</span>
            <span className="block mt-1 text-sm text-fd-muted-foreground">{panel.description}</span>
          </span>
          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-fd-muted-foreground/60 group-hover:text-fd-primary group-hover:translate-x-1 transition-all" />
        </a>
      ))}
    </div>
  );
}
