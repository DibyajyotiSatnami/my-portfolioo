"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Cycles through phrases, morphing one into the next: letters blur and
 * lift out while the next phrase resolves into focus underneath.
 */
export function MorphText({ items, interval = 2.4 }: { items: readonly string[]; interval?: number }) {
  const root = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const phrases = gsap.utils.toArray<HTMLElement>(".morph-item");
      if (phrases.length < 2) return;

      gsap.set(phrases, { autoAlpha: 0 });
      gsap.set(phrases[0], { autoAlpha: 1 });

      const tl = gsap.timeline({ repeat: -1, delay: interval });
      phrases.forEach((current, i) => {
        const next = phrases[(i + 1) % phrases.length];
        tl.to(current, {
          autoAlpha: 0,
          yPercent: -60,
          filter: "blur(10px)",
          letterSpacing: "0.32em",
          duration: 0.7,
          ease: "power2.in",
        })
          .fromTo(
            next,
            { autoAlpha: 0, yPercent: 60, filter: "blur(10px)", letterSpacing: "0.02em" },
            {
              autoAlpha: 1,
              yPercent: 0,
              filter: "blur(0px)",
              letterSpacing: "0.16em",
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.25",
          )
          .set(current, { yPercent: 0, filter: "blur(0px)", letterSpacing: "0.16em" })
          .to({}, { duration: interval });
      });
    },
    { scope: root },
  );

  return (
    <span ref={root} className="morph">
      <span className="sr-only">{items.join(", ")}</span>
      {items.map((item) => (
        <span key={item} className="morph-item" aria-hidden="true">
          {item}
        </span>
      ))}
    </span>
  );
}
