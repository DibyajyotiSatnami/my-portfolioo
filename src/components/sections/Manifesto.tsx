"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Words } from "../Split";

const STATEMENT =
  "I'm Dibyajyoti — a *web* *developer* and *digital* *marketer.* I design and build websites that feel *cinematic,* load in a blink, and are found by the right people — through Google Maps SEO, Meta Ads and performance marketing that turns *attention* into *customers.*";

const PILLARS = [
  { title: "Design & Build", text: "Interfaces with motion, depth and a clear path to action." },
  { title: "Get Found", text: "Local search visibility where your customers are already looking." },
  { title: "Grow", text: "Paid campaigns measured against leads and revenue, not vanity metrics." },
];

/** Pinned statement that lights up word by word as the visitor scrolls. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: `(min-width: 1024px) and ${MOTION_OK}`, mobile: `(max-width: 1023.98px) and ${MOTION_OK}` },
        (context) => {
          const desktop = context.conditions?.desktop;
          const words = gsap.utils.toArray<HTMLElement>(".manifesto-text .word");

          gsap.set(words, { opacity: 0.14 });
          gsap.set(".manifesto-pillar", { autoAlpha: 0, y: 40 });

          const tl = gsap.timeline({
            scrollTrigger: desktop
              ? { trigger: root.current, start: "top top", end: "+=170%", pin: true, scrub: 0.4, anticipatePin: 1 }
              : { trigger: root.current, start: "top 70%", end: "bottom 85%", scrub: 0.4 },
          });

          tl.to(words, { opacity: 1, duration: 0.4, stagger: 0.12, ease: "none" })
            .to(".manifesto-pillar", { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.5, ease: "power2.out" }, ">-0.6")
            .to({}, { duration: 0.8 });

          // Floating shapes travel at their own speeds for depth.
          gsap.utils.toArray<HTMLElement>(".manifesto-shape").forEach((shape) => {
            const speed = Number(shape.dataset.speed ?? 1);
            gsap.fromTo(
              shape,
              { yPercent: 60 * speed, rotate: -20 * speed },
              {
                yPercent: -80 * speed,
                rotate: 40 * speed,
                ease: "none",
                scrollTrigger: {
                  trigger: root.current,
                  start: "top bottom",
                  end: desktop ? "+=320%" : "bottom top",
                  scrub: true,
                },
              },
            );
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="manifesto" data-theme-section="night" aria-labelledby="about-title">
      <div className="manifesto-shapes" aria-hidden="true">
        <span className="manifesto-shape manifesto-shape--ring" data-speed="1.4" />
        <span className="manifesto-shape manifesto-shape--cross" data-speed="0.7" />
        <span className="manifesto-shape manifesto-shape--dots" data-speed="1" />
        <span className="manifesto-shape manifesto-shape--arc" data-speed="2" />
      </div>

      <div className="manifesto-inner wrap">
        <h2 id="about-title" className="section-tag label">
          <span className="section-tag-dot" aria-hidden="true" />
          About
        </h2>

        <p className="manifesto-text">
          <Words text={STATEMENT} />
        </p>

        <ul className="manifesto-pillars">
          {PILLARS.map((pillar, i) => (
            <li key={pillar.title} className="manifesto-pillar">
              <span className="label manifesto-pillar-index">0{i + 1}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
