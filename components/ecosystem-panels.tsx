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

// One distinct entrance direction per panel, in order.
const DIRECTIONS: Array<{ x: number; y: number }> = [
  { x: -70, y: 0 },
  { x: 70, y: 0 },
  { x: 0, y: -70 },
  { x: 0, y: 70 },
];

/**
 * A static grid of (up to four) panels where each one flies in from a
 * different side — left, right, top, bottom — as the section scrolls into
 * view.
 */
export function EcosystemPanels({ items }: { items: EcosystemPanel[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('[data-ecosystem-panel]', el);
      cards.forEach((card, i) => {
        const dir = DIRECTIONS[i % DIRECTIONS.length];
        gsap.fromTo(
          card,
          { opacity: 0, x: dir.x, y: dir.y },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto px-4">
      {items.map((panel) => (
        <a
          key={panel.title}
          data-ecosystem-panel
          href={panel.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col justify-between gap-6 p-8 rounded-2xl border border-fd-border/60 bg-fd-card/40 shadow-sm hover:border-fd-primary/40 hover:bg-fd-card/70 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="w-14 h-14 bg-fd-primary/10 rounded-xl flex items-center justify-center">
            {panel.icon}
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">{panel.title}</h4>
            <p className="text-fd-muted-foreground text-sm">{panel.description}</p>
          </div>
          <div className="flex items-center text-fd-primary font-medium text-sm">
            {panel.cta}
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </a>
      ))}
    </div>
  );
}
