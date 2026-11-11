"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";

const STRIPS = 5;

/**
 * Loading screen built around the initials. The outlined letters fill up as
 * the counter runs, then two layers of columns sweep away to reveal the hero.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const finish = () => setGone(true);

      if (prefersReducedMotion()) {
        gsap.to(root.current, {
          autoAlpha: 0,
          duration: 0.4,
          delay: 0.25,
          onStart: onDone,
          onComplete: finish,
        });
        return;
      }

      const progress = { value: 0 };
      const render = () => {
        const v = progress.value;
        if (count.current) count.current.textContent = String(Math.round(v)).padStart(3, "0");
        if (fill.current) fill.current.style.clipPath = `inset(${100 - v}% 0 0 0)`;
        if (bar.current) bar.current.style.transform = `scaleX(${v / 100})`;
      };

      gsap
        .timeline({ onComplete: finish })
        .from(".pl-letter", { yPercent: 105, duration: 0.9, ease: "expo.out", stagger: 0.09 })
        .from(".pl-meta", { autoAlpha: 0, duration: 0.5 }, 0.1)
        .to(progress, { value: 100, duration: 1.25, ease: "power2.inOut", onUpdate: render }, 0.2)
        .to(".pl-letter", { yPercent: -105, duration: 0.6, ease: "expo.in", stagger: 0.06 }, ">-0.05")
        .to(".pl-meta", { autoAlpha: 0, duration: 0.3 }, "<")
        .add(onDone, ">-0.2")
        .to(
          ".pl-strip--ink",
          { yPercent: -101, duration: 0.85, ease: "expo.inOut", stagger: { each: 0.055, from: "center" } },
          "<",
        )
        .to(
          ".pl-strip--accent",
          { yPercent: -101, duration: 0.85, ease: "expo.inOut", stagger: { each: 0.055, from: "center" } },
          "<0.14",
        );
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className="preloader" role="status" aria-label="Loading">
      <div className="pl-strips" aria-hidden="true">
        {Array.from({ length: STRIPS }, (_, i) => (
          <span key={i} className="pl-strip pl-strip--accent" style={{ left: `${(100 / STRIPS) * i}%` }} />
        ))}
      </div>
      <div className="pl-strips" aria-hidden="true">
        {Array.from({ length: STRIPS }, (_, i) => (
          <span key={i} className="pl-strip pl-strip--ink" style={{ left: `${(100 / STRIPS) * i}%` }} />
        ))}
      </div>

      <div className="pl-center" aria-hidden="true">
        <div className="pl-initials display">
          <div className="pl-outline">
            {site.initials.split("").map((letter, i) => (
              <span key={i} className="pl-letter-mask">
                <span className="pl-letter">{letter}</span>
              </span>
            ))}
          </div>
          <div ref={fill} className="pl-fill">
            {site.initials.split("").map((letter, i) => (
              <span key={i} className="pl-letter-mask">
                <span className="pl-letter">{letter}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pl-meta pl-meta--left label" aria-hidden="true">
        {site.name} — Portfolio
      </div>
      <div className="pl-meta pl-meta--right" aria-hidden="true">
        <span ref={count} className="pl-count display">
          000
        </span>
      </div>
      <span className="pl-bar pl-meta" aria-hidden="true">
        <span ref={bar} />
      </span>
    </div>
  );
}
