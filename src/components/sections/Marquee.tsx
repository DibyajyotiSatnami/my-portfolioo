"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { roles } from "@/content/site";

/** Endless band of services; scroll velocity speeds it up and flips its direction. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to(".marquee-track", { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
        loop.totalTime(28 * 40); // head-room so the loop can also run backwards
        const skew = gsap.quickTo(".marquee-track", "skewX", { duration: 0.5, ease: "power3.out" });
        let direction = 1;

        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => loop.paused(!self.isActive),
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            direction = velocity < 0 ? -1 : 1;
            const boost = Math.min(Math.abs(velocity) / 350, 5);
            skew(gsap.utils.clamp(-12, 12, velocity / -160));
            gsap.to(loop, { timeScale: direction * (1 + boost), duration: 0.3, overwrite: true });
          },
        });

        const settle = () => {
          skew(0);
          gsap.to(loop, { timeScale: direction, duration: 1.2, overwrite: true });
        };
        ScrollTrigger.addEventListener("scrollEnd", settle);
        return () => ScrollTrigger.removeEventListener("scrollEnd", settle);
      });
    },
    { scope: root },
  );

  const items = [...roles, ...roles];

  return (
    <div ref={root} className="marquee" aria-hidden="true">
      <div className="marquee-track display">
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-group">
            {items.map((item, i) => (
              <span key={`${copy}-${i}`} className="marquee-item">
                <span className={i % 2 ? "marquee-outline" : undefined}>{item}</span>
                <svg viewBox="0 0 24 24" className="marquee-star">
                  <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12 6.6-.6 11.4-5.4 12-12Z" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
