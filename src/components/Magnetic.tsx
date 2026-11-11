"use client";

import { useEffect, useRef } from "react";
import { gsap, FINE_POINTER, prefersReducedMotion } from "@/lib/gsap";

/**
 * Pulls its content toward the pointer and snaps back elastically.
 * Any descendant marked `data-magnetic-inner` travels a little further,
 * which gives buttons a sense of depth.
 */
export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia(FINE_POINTER).matches) return;

    const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");

    const move = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.5, ease: "power3.out" });
      if (inner) {
        gsap.to(inner, { x: dx * strength * 0.45, y: dy * strength * 0.45, duration: 0.5, ease: "power3.out" });
      }
    };
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.35)" });
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.35)" });
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.killTweensOf([el, inner]);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`magnetic ${className ?? ""}`}>
      {children}
    </span>
  );
}
