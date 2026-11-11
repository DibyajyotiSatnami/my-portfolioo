"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Builder = (ctx: {
  /** The illustration's root <svg>. */
  root: SVGSVGElement;
  /** One-shot "assembly" timeline, replayed each time the visual activates. */
  tl: gsap.core.Timeline;
  /** Register an endless ambient animation that only runs while active. */
  loop: <T extends gsap.core.Animation>(animation: T) => T;
}) => void;

/**
 * Shared lifecycle for the service illustrations: build once, replay the
 * entrance on activation, pause everything when inactive, and jump straight
 * to the finished artwork for visitors who prefer reduced motion.
 */
export function useVisual(active: boolean, build: Builder) {
  const ref = useRef<SVGSVGElement>(null);
  const state = useRef<{ tl: gsap.core.Timeline; loops: gsap.core.Animation[] } | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      const loops: gsap.core.Animation[] = [];
      build({
        root: ref.current!,
        tl,
        loop: (animation) => {
          animation.pause();
          loops.push(animation);
          return animation;
        },
      });
      state.current = { tl, loops };
      if (prefersReducedMotion()) tl.progress(1);
    },
    { scope: ref },
  );

  useEffect(() => {
    const current = state.current;
    if (!current || prefersReducedMotion()) return;
    if (active) {
      current.tl.restart();
      current.loops.forEach((loop) => loop.play());
    } else {
      current.tl.pause();
      current.loops.forEach((loop) => loop.pause());
    }
  }, [active]);

  return ref;
}

export const draw = { strokeDasharray: 1, strokeDashoffset: 1 } as const;
