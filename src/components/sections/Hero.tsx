"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";
import { roles, site } from "@/content/site";
import { useApp } from "../AppShell";
import { Chars } from "../Split";
import { Magnetic } from "../Magnetic";
import { MorphText } from "../MorphText";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const { ready, navigate } = useApp();
  const [sceneWanted, setSceneWanted] = useState(false);

  // Load WebGL after first paint so it never competes with the initial render.
  useEffect(() => {
    const id = window.setTimeout(() => setSceneWanted(true), 60);
    return () => window.clearTimeout(id);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.set(".hero-eyebrow, .hero-fade", { autoAlpha: 0, y: 24 });
        gsap.set(".hero-name .char", { yPercent: 120, rotate: 10, autoAlpha: 0, filter: "blur(8px)" });
        gsap.set(".hero-name-stroke", { strokeDashoffset: 1 });
        gsap.set(".hero-title .char", { yPercent: 118, rotateX: -75, autoAlpha: 0, transformOrigin: "50% 100%" });
        gsap.set(".hero-gradient", { yPercent: 115, skewX: -18, autoAlpha: 0 });

        intro.current = gsap
          .timeline({ paused: true, defaults: { ease: "expo.out" } })
          .to(".hero-eyebrow", { autoAlpha: 1, y: 0, duration: 0.9 }, 0)
          .to(
            ".hero-name .char",
            { yPercent: 0, rotate: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.2, stagger: 0.045 },
            0.05,
          )
          .to(".hero-name-stroke", { strokeDashoffset: 0, duration: 1.3, ease: "power3.inOut" }, 0.55)
          .to(
            ".hero-line--1 .char",
            { yPercent: 0, rotateX: 0, autoAlpha: 1, duration: 1.25, stagger: 0.035 },
            0.15,
          )
          .to(".hero-gradient", { yPercent: 0, skewX: 0, autoAlpha: 1, duration: 1.35 }, 0.32)
          .to(
            ".hero-line--3 .char",
            { yPercent: 0, rotateX: 0, autoAlpha: 1, duration: 1.25, stagger: 0.028 },
            0.46,
          )
          .to(".hero-fade", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.09 }, 0.95);

        // Layered exit: every line leaves at its own speed.
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
          })
          .to(".hero-line--1", { yPercent: -120, ease: "none" }, 0)
          .to(".hero-line--2", { yPercent: -75, xPercent: 3, ease: "none" }, 0)
          .to(".hero-line--3", { yPercent: -35, ease: "none" }, 0)
          .to(".hero-top", { yPercent: -160, autoAlpha: 0, ease: "none" }, 0)
          .to(".hero-bottom", { y: -60, autoAlpha: 0, ease: "none" }, 0)
          .to(".hero-backdrop", { yPercent: 18, ease: "none" }, 0);
      });

      // Pointer parallax: each layer drifts by its own depth.
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]").map((el) => ({
          depth: Number(el.dataset.depth),
          x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" }),
        }));
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((layer) => {
            layer.x(nx * layer.depth);
            layer.y(ny * layer.depth);
          });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root },
  );

  useEffect(() => {
    if (ready) intro.current?.play();
  }, [ready]);

  return (
    <section ref={root} id="top" className="hero" data-theme-section="ink">
      <div className="hero-backdrop" aria-hidden="true">
        <div className="hero-grid" data-depth="14" />
        <div className="hero-glow hero-glow--a" data-depth="-46" />
        <div className="hero-glow hero-glow--b" data-depth="34" />
        {sceneWanted ? <HeroScene ready={ready} /> : null}
      </div>

      <div className="hero-inner wrap">
        <div className="hero-top">
          <p className="hero-eyebrow label">Hello, I&rsquo;m</p>
          <p className="hero-name">
            <Chars text={site.name} />
            <svg className="hero-name-underline" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
              <path
                className="hero-name-stroke"
                d="M3 13 C 60 3, 120 3, 170 9 S 262 17, 297 6"
                pathLength={1}
              />
            </svg>
          </p>
        </div>

        <h1 className="hero-title display" data-depth="-10">
          <span className="sr-only">{site.tagline}</span>
          <span className="hero-line hero-line--1" aria-hidden="true">
            <Chars text="I build" />
          </span>
          <span className="hero-line hero-line--2" aria-hidden="true">
            <span className="hero-gradient text-gradient">digital</span>
          </span>
          <span className="hero-line hero-line--3" aria-hidden="true">
            <Chars text="experiences." />
          </span>
        </h1>

        <div className="hero-bottom">
          <div className="hero-fade hero-intro">
            <p>
              {site.role} crafting websites that look cinematic, load fast and turn
              visitors into customers.
            </p>
            <p className="hero-roles label">
              <span aria-hidden="true">→</span>
              <MorphText items={roles} />
            </p>
          </div>

          <a
            href="#about"
            className="hero-fade scroll-cue"
            onClick={(e) => {
              e.preventDefault();
              navigate("#about", { label: "About" });
            }}
          >
            <span className="scroll-cue-line" aria-hidden="true" />
            <span className="label">Scroll</span>
          </a>

          <div className="hero-fade hero-cta">
            <Magnetic>
              <a
                href="#contact"
                className="btn btn--solid"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("#contact", { label: "Contact" });
                }}
              >
                <span className="btn-fill" aria-hidden="true" />
                <span className="btn-label" data-magnetic-inner>
                  <span data-text="Start a project">Start a project</span>
                </span>
                <span className="btn-icon" aria-hidden="true">
                  ↗
                </span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
