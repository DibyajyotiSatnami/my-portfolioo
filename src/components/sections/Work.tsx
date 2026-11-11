"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";
import { projects } from "@/content/site";
import { useApp } from "../AppShell";
import { Chars } from "../Split";
import { Magnetic } from "../Magnetic";
import { ProjectPreview } from "./ProjectPreview";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Selected work. On desktop the section pins and scrolls sideways through
 * full-height project panels; on touch devices and with reduced motion it
 * falls back to a vertical stack with the same reveals.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const horizontal = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const { navigate, scrollTo } = useApp();

  useGSAP(
    () => {
      const section = root.current!;
      const rail = track.current!;
      const mm = gsap.matchMedia();
      const panels = () => gsap.utils.toArray<HTMLElement>(".pj", section);

      const revealTimeline = (panel: HTMLElement, scrollTrigger: ScrollTrigger.Vars) => {
        const media = panel.querySelector(".pj-media");
        const inner = panel.querySelector(".pj-media-inner");
        gsap.set(media, { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(inner, { scale: 1.35 });
        return gsap
          .timeline({ scrollTrigger, defaults: { ease: "expo.out" } })
          .to(media, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3 })
          .to(inner, { scale: 1, duration: 1.7 }, 0)
          .from(panel.querySelectorAll(".pj-title .char"), { yPercent: 115, duration: 1, stagger: 0.022 }, 0.15)
          .from(panel.querySelectorAll(".pj-meta"), { autoAlpha: 0, y: 22, duration: 0.8, stagger: 0.07 }, 0.3);
      };

      /* ---------- Desktop: pinned horizontal gallery ---------- */
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        section.dataset.horizontal = "true";
        const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth);

        const slide = gsap.to(rail, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: true,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (progress.current) progress.current.style.transform = `scaleX(${self.progress})`;
              const centre = self.progress * distance() + window.innerWidth / 2;
              let index = 0;
              panels().forEach((panel, i) => {
                if (panel.offsetLeft <= centre) index = i;
              });
              setActive((current) => (current === index ? current : index));
            },
          },
        });
        horizontal.current = slide.scrollTrigger ?? null;

        gsap.from(".work-heading .char", {
          yPercent: 115,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.03,
          scrollTrigger: { trigger: section, start: "top 65%", toggleActions: "play none none reverse" },
        });
        gsap.from(".work-intro-fade", {
          autoAlpha: 0,
          y: 24,
          duration: 0.9,
          stagger: 0.08,
          scrollTrigger: { trigger: section, start: "top 55%", toggleActions: "play none none reverse" },
        });

        panels().forEach((panel, i) => {
          revealTimeline(
            panel,
            i === 0
              ? { trigger: section, start: "top 45%", toggleActions: "play none none reverse" }
              : { trigger: panel, containerAnimation: slide, start: "left 88%", toggleActions: "play none none reverse" },
          );

          // Layered parallax inside the moving rail.
          const range = { trigger: panel, containerAnimation: slide, start: "left right", end: "right left", scrub: true };
          gsap.fromTo(panel.querySelector(".pj-index"), { xPercent: 45 }, { xPercent: -45, ease: "none", scrollTrigger: range });
          gsap.fromTo(panel.querySelector(".pj-info"), { x: 70 }, { x: -70, ease: "none", scrollTrigger: range });
        });

        gsap.fromTo(
          ".work-outro-inner",
          { scale: 0.8, autoAlpha: 0.2 },
          {
            scale: 1,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: ".work-outro", containerAnimation: slide, start: "left right", end: "left 35%", scrub: true },
          },
        );

        return () => {
          horizontal.current = null;
          delete section.dataset.horizontal;
          gsap.set(rail, { clearProps: "transform" });
        };
      });

      /* ---------- Touch / narrow screens: vertical reveals ---------- */
      mm.add(`(max-width: 1023.98px) and ${MOTION_OK}`, () => {
        gsap.from(".work-heading .char", {
          yPercent: 115,
          duration: 1,
          ease: "expo.out",
          stagger: 0.03,
          scrollTrigger: { trigger: ".work-intro", start: "top 80%" },
        });
        panels().forEach((panel) => {
          revealTimeline(panel, { trigger: panel, start: "top 82%" });
          gsap.fromTo(
            panel.querySelector(".pj-index"),
            { yPercent: 30 },
            { yPercent: -30, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });

      /* ---------- Mouse: 3D tilt + glare on every card ---------- */
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const cleanups = gsap.utils.toArray<HTMLElement>(".pj-card", section).map((card) => {
          const tilt = card.querySelector<HTMLElement>(".pj-tilt")!;
          const glare = card.querySelector<HTMLElement>(".pj-glare")!;
          const rotateX = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3.out" });
          const rotateY = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3.out" });

          const move = (e: PointerEvent) => {
            const rect = card.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            rotateY((px - 0.5) * 14);
            rotateX((0.5 - py) * 10);
            glare.style.setProperty("--gx", `${px * 100}%`);
            glare.style.setProperty("--gy", `${py * 100}%`);
          };
          const leave = () => {
            rotateX(0);
            rotateY(0);
          };
          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          return () => {
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", leave);
          };
        });
        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: root },
  );

  const goToProject = useCallback(
    (index: number) => {
      const panel = root.current?.querySelectorAll<HTMLElement>(".pj")[index];
      const rail = track.current;
      if (!panel || !rail) return;

      const st = horizontal.current;
      if (!st) {
        scrollTo(panel, 1.2);
        return;
      }
      const max = rail.scrollWidth - window.innerWidth;
      const x = gsap.utils.clamp(0, max, panel.offsetLeft - (window.innerWidth - panel.offsetWidth) / 2);
      scrollTo(st.start + (x / max) * (st.end - st.start), 1.5);
    },
    [scrollTo],
  );

  return (
    <section ref={root} id="work" className="work" data-theme-section="indigo" aria-labelledby="work-title">
      <div ref={track} className="work-track">
        <header className="work-intro">
          <p className="section-tag label work-intro-fade">
            <span className="section-tag-dot" aria-hidden="true" />
            Selected work
          </p>
          <h2 id="work-title" className="work-heading display">
            <span className="mask-line">
              <Chars text="Selected" />
            </span>
            <span className="mask-line">
              <Chars text="Work" />
              <sup className="work-count">({pad(projects.length)})</sup>
            </span>
          </h2>
          <p className="work-lede work-intro-fade">
            Websites and campaigns built to be remembered — and to perform. Hover a
            project to preview it, click to open the live site.
          </p>
          <p className="work-hint label work-intro-fade" aria-hidden="true">
            Keep scrolling <span>→</span>
          </p>
        </header>

        {projects.map((project, i) => (
          <article key={project.title} className="pj">
            <span className="pj-index display" aria-hidden="true">
              {pad(i + 1)}
            </span>

            <a
              className="pj-card"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="view"
              data-cursor-label="View Live Website"
              aria-label={`${project.title} — view live website (opens in a new tab)`}
            >
              <div className="pj-tilt">
                <div className="pj-media">
                  <div className="pj-media-inner">
                    <ProjectPreview project={project} variant={i} />
                  </div>
                  <span className="pj-glare" aria-hidden="true" />
                  <span className="pj-cta" aria-hidden="true">
                    <span>View Live Website</span>
                    <span className="pj-cta-arrow">↗</span>
                  </span>
                </div>
              </div>
            </a>

            <div className="pj-info">
              <h3 className="pj-title display">
                <span className="mask-line">
                  <Chars text={project.title} />
                </span>
              </h3>
              <p className="pj-meta pj-kind">{project.kind}</p>
              <ul className="pj-meta pj-tags">
                {project.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
                <li>{project.year}</li>
              </ul>
            </div>
          </article>
        ))}

        <div className="work-outro">
          <div className="work-outro-inner">
            <p className="label">Next on this list</p>
            <p className="work-outro-title display">
              Your <em className="serif text-gradient">project?</em>
            </p>
            <Magnetic>
              <a
                href="#contact"
                className="btn btn--ghost"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("#contact", { label: "Contact" });
                }}
              >
                <span className="btn-fill" aria-hidden="true" />
                <span className="btn-label" data-magnetic-inner>
                  <span data-text="Let's talk">Let&rsquo;s talk</span>
                </span>
                <span className="btn-icon" aria-hidden="true">
                  ↗
                </span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <div className="work-hud">
        <span className="work-counter label" aria-hidden="true">
          <b>{pad(Math.min(active, projects.length - 1) + 1)}</b> / {pad(projects.length)}
        </span>
        <span className="work-progress" aria-hidden="true">
          <span ref={progress} />
        </span>
        <nav className="work-nav" aria-label="Projects">
          {projects.map((project, i) => (
            <button
              key={project.title}
              type="button"
              className="work-nav-item"
              aria-current={active === i ? "true" : undefined}
              onClick={() => goToProject(i)}
            >
              <span className="work-nav-dot" aria-hidden="true" />
              <span className="work-nav-label">{project.title}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
