'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { blobPath } from '@/lib/blob-path';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(MorphSVGPlugin);
}

const POINTS = 12;
const SIZE = 260;
const CENTER = SIZE / 2;
const PROXIMITY = 190;

const IDLE_RADII = Array.from({ length: POINTS }, (_, i) => 1 + Math.sin(i * 1.7) * 0.03);
const ACTIVE_RADII = Array.from({ length: POINTS }, (_, i) => 1 + Math.sin(i * 1.7 + 1.3) * 0.16 + Math.cos(i * 0.9) * 0.08);
const IDLE_PATH = blobPath(CENTER, CENTER, 74, IDLE_RADII);
const ACTIVE_PATH = blobPath(CENTER, CENTER, 88, ACTIVE_RADII);

/**
 * Wraps a CTA with a decorative "planet" behind it: an organic blob that
 * warps like it's under gravitational pull as the cursor approaches
 * (curve-swipe-style path morph via MorphSVGPlugin), orbited by faint
 * rings and a couple of drifting moons.
 */
export function PlanetButton({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const groupRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const blob = blobRef.current;
    const glow = glowRef.current;
    const group = groupRef.current;
    if (!wrapper || !blob || !glow || !group) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let cleanupExtra = () => {};

    const ctx = gsap.context(() => {
      const morph = gsap.to(blob, { morphSVG: ACTIVE_PATH, duration: 1, ease: 'none', paused: true });
      const glowTween = gsap.to(glow, {
        opacity: 0.32,
        scale: 1.15,
        duration: 1,
        ease: 'none',
        paused: true,
        transformOrigin: '50% 50%',
      });

      gsap.to(group, { rotation: 360, duration: 50, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });

      let activation = 0;
      const smoothed = { value: 0 };

      const onMove = (e: PointerEvent) => {
        const rect = wrapper.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        activation = gsap.utils.clamp(0, 1, 1 - dist / PROXIMITY);
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      const onTick = () => {
        smoothed.value += (activation - smoothed.value) * 0.12;
        morph.progress(smoothed.value);
        glowTween.progress(smoothed.value);
      };
      gsap.ticker.add(onTick);

      cleanupExtra = () => {
        window.removeEventListener('pointermove', onMove);
        gsap.ticker.remove(onTick);
      };
    }, wrapper);

    return () => {
      cleanupExtra();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative inline-flex items-center justify-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        className="absolute pointer-events-none text-fd-primary"
        style={{ overflow: 'visible' }}
        aria-hidden="true"
      >
        <circle ref={glowRef} cx={CENTER} cy={CENTER} r={100} fill="currentColor" opacity={0.12} />
        <g ref={groupRef}>
          <ellipse cx={CENTER} cy={CENTER} rx={118} ry={40} fill="none" stroke="currentColor" strokeOpacity={0.18} />
          <ellipse cx={CENTER} cy={CENTER} rx={40} ry={118} fill="none" stroke="currentColor" strokeOpacity={0.1} />
        </g>
        <path ref={blobRef} d={IDLE_PATH} fill="currentColor" opacity={0.14} />
      </svg>
      <Link href={href} className={`relative z-10 ${className ?? ''}`}>
        {children}
      </Link>
    </div>
  );
}
