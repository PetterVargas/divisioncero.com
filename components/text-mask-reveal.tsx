'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Renders `text` twice, stacked: a dim base layer (the real, accessible
 * text) and a teal/cyan gradient-filled duplicate clipped behind a mask —
 * so the colored text "paints in" left-to-right once the heading scrolls
 * into view (GSAP text-masking style reveal).
 *
 * This plays once to completion (not scrubbed to scroll position) — a
 * scrubbed version got stuck mid-reveal whenever the user stopped
 * scrolling before reaching the trigger's end point.
 */
export function TextMaskReveal({ text, className }: { text: string; className?: string }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const fill = fillRef.current;
    if (!root || !fill) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(fill, { clipPath: 'inset(0 0% 0 0)' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fill,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: root,
            start: 'top 85%',
            once: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <span ref={rootRef} className={`relative inline-block ${className ?? ''}`}>
      <span className="text-fd-foreground/25">{text}</span>
      <span
        ref={fillRef}
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent"
      >
        {text}
      </span>
    </span>
  );
}
