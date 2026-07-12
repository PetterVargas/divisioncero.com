'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable, InertiaPlugin);
}

export interface SliderTool {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  external?: boolean;
}

const SPEED_PX_PER_SEC = 42;

/**
 * Auto-scrolling, draggable, seamlessly-looping row of tool cards
 * (inspired by GSAP's infinite-card-slider demo). Content is duplicated
 * once so the loop point is invisible; dragging past an edge teleports by
 * exactly one set width for the same reason.
 */
export function ToolsSlider({ items }: { items: SliderTool[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let setWidth = 0;
    let autoplay: gsap.core.Tween | null = null;
    let draggable: Draggable | null = null;

    const ctx = gsap.context(() => {
      setWidth = track.scrollWidth / 2;

      const wrap = gsap.utils.wrap(-setWidth, 0);
      const applyWrap = (self: Draggable) => {
        const wrapped = wrap(self.x);
        if (wrapped !== self.x) {
          gsap.set(track, { x: wrapped });
          self.update();
        }
      };

      autoplay = gsap.to(track, {
        x: `-=${setWidth}`,
        duration: setWidth / SPEED_PX_PER_SEC,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: (value) => `${wrap(parseFloat(value))}px`,
        },
      });

      [draggable] = Draggable.create(track, {
        type: 'x',
        inertia: true,
        dragClickables: true,
        onPress(this: Draggable) {
          autoplay?.pause();
        },
        onDrag(this: Draggable) {
          applyWrap(this);
        },
        onThrowUpdate(this: Draggable) {
          applyWrap(this);
        },
        onRelease(this: Draggable) {
          // Invalidate so the (relative -=setWidth) tween re-reads its
          // start value from the DOM instead of resuming from the stale
          // position it had when we paused it for the drag.
          if (!this.isDragging && !this.isThrowing) autoplay?.invalidate().restart();
        },
        onThrowComplete(this: Draggable) {
          autoplay?.invalidate().restart();
        },
      });

      const pause = () => autoplay?.pause();
      const resume = () => {
        if (!draggable?.isDragging && !draggable?.isThrowing) autoplay?.play();
      };
      track.addEventListener('mouseenter', pause);
      track.addEventListener('mouseleave', resume);

      return () => {
        track.removeEventListener('mouseenter', pause);
        track.removeEventListener('mouseleave', resume);
      };
    }, track);

    return () => ctx.revert();
  }, []);

  const renderCard = (tool: SliderTool, key: string) => {
    const content = (
      <div className="flex flex-col gap-3 p-5 w-64 shrink-0 rounded-lg border border-fd-border/60 bg-fd-card/40 shadow-sm hover:border-fd-primary/40 hover:bg-fd-card/70 transition-colors">
        <div className="w-9 h-9 bg-fd-primary/10 rounded-lg flex items-center justify-center">
          {tool.icon}
        </div>
        <h4 className="font-semibold text-sm">{tool.title}</h4>
        <p className="text-fd-muted-foreground text-xs">{tool.description}</p>
      </div>
    );

    return tool.external ? (
      <a key={key} href={tool.href} target="_blank" rel="noopener noreferrer" className="select-none">
        {content}
      </a>
    ) : (
      <Link key={key} href={tool.href} className="select-none">
        {content}
      </Link>
    );
  };

  return (
    <div className="overflow-hidden cursor-grab active:cursor-grabbing [-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
      <div ref={trackRef} className="flex gap-4 w-max py-2">
        {items.map((tool) => renderCard(tool, `a-${tool.title}`))}
        {items.map((tool) => renderCard(tool, `b-${tool.title}`))}
      </div>
    </div>
  );
}
