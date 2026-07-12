'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function HeroReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // `motion-safe:opacity-0` on badge/lines/items (in the server-rendered
    // markup) is what hides them before this effect ever runs, so there's
    // no frame where the fully-visible static content flashes first. Only
    // opacity is set via CSS — position/scale/rotation are established
    // below via gsap.set() instead, because Tailwind v4's translate/scale
    // utilities write the modern standalone `translate`/`scale` CSS
    // properties, which GSAP's `y`/`yPercent`/`scale` tweens don't read as
    // their starting value — mixing the two left elements stuck mid-tween.
    // Reduced-motion users never get the opacity-0 class, so there's
    // nothing to animate for them.
    if (prefersReducedMotion()) return;

    const badge = el.querySelector<HTMLElement>('[data-hero-badge]');
    const badgePulse = el.querySelector<HTMLElement>('[data-badge-pulse]');
    const lines = el.querySelectorAll<HTMLElement>('[data-hero-line]');
    const items = el.querySelectorAll<HTMLElement>('[data-hero-item]');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.set(lines, { yPercent: 115, rotate: 1.5 })
        .set(badge, { scale: 0.8, y: -8 })
        .set(items, { y: 26 });

      tl.to(badge, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(2.4)' })
        .to(
          lines,
          { yPercent: 0, rotate: 0, opacity: 1, duration: 1, stagger: 0.14, ease: 'power4.out' },
          '-=0.2',
        );

      tl.to(items, { opacity: 1, y: 0, duration: 0.6, stagger: 0.14 }, '-=0.55');

      if (badgePulse) {
        gsap.fromTo(
          badgePulse,
          { scale: 1, opacity: 0.5 },
          {
            scale: 1.9,
            opacity: 0,
            duration: 1.8,
            repeat: -1,
            ease: 'power1.out',
            delay: 1.3,
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}

export function ScrollReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 36, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Reveals direct children in an alternating left/right, slightly rotated
 * stagger as the container scrolls into view — used for card grids.
 */
export function StaggerReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) return;

    const targets = Array.from(el.children);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: 30,
          x: (i: number) => (i % 2 === 0 ? -18 : 18),
          rotate: (i: number) => (i % 2 === 0 ? -1.5 : 1.5),
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          rotate: 0,
          duration: 0.65,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
