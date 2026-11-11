"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";
import { services } from "@/content/site";
import { Chars } from "../Split";
import { ServiceVisual } from "../services/visuals";

const DESKTOP = "(min-width: 1024px)";

/**
 * Five services. On desktop an oversized index drives a shared stage: hover
 * (or focus) a service and its illustration assembles itself. On smaller
 * screens every service is a card whose illustration plays as it scrolls in.
 */
export function Services() {
  const root = useRef<HTMLElement>(null);
  const [desktop, setDesktop] = useState(false);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [seen, setSeen] = useState<boolean[]>(() => services.map(() => false));

  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      ScrollTrigger.create({
        trigger: ".svc-body",
        start: "top 70%",
        end: "bottom 20%",
        onToggle: (self) => setInView(self.isActive),
      });

      mm.add(MOTION_OK, () => {
        gsap.from(".svc-heading .char", {
          yPercent: 115,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.025,
          scrollTrigger: { trigger: ".svc-head", start: "top 78%" },
        });
        gsap.from(".svc-head-fade", {
          autoAlpha: 0,
          y: 26,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".svc-head", start: "top 70%" },
        });
        gsap.from(".svc-row", {
          autoAlpha: 0,
          y: 50,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: { trigger: ".svc-list", start: "top 80%" },
        });
        if (desktop) {
          gsap.from(".svc-stage", {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 1.3,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ".svc-stage", start: "top 85%" },
          });
        }
      });

      // The stage light follows the pointer.
      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const stage = desktop ? root.current?.querySelector<HTMLElement>(".svc-stage") : null;
        if (!stage) return;
        const move = (e: PointerEvent) => {
          const rect = stage.getBoundingClientRect();
          stage.style.setProperty("--sx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
          stage.style.setProperty("--sy", `${((e.clientY - rect.top) / rect.height) * 100}%`);
        };
        stage.addEventListener("pointermove", move);
        return () => stage.removeEventListener("pointermove", move);
      });
    },
    { scope: root, dependencies: [desktop], revertOnUpdate: true },
  );

  // Small screens: play each card's illustration when it scrolls into view.
  useEffect(() => {
    if (desktop) return;
    const cards = root.current?.querySelectorAll<HTMLElement>(".svc-row");
    if (!cards?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setSeen((previous) => {
          const next = [...previous];
          entries.forEach((entry) => {
            next[Number((entry.target as HTMLElement).dataset.index)] = entry.isIntersecting;
          });
          return next;
        });
      },
      { threshold: 0.45 },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [desktop]);

  const current = services[active];

  return (
    <section ref={root} id="services" className="services" data-theme-section="bone" aria-labelledby="services-title">
      <div className="wrap">
        <header className="svc-head">
          <p className="section-tag label svc-head-fade">
            <span className="section-tag-dot" aria-hidden="true" />
            Services
          </p>
          <h2 id="services-title" className="svc-heading display">
            <span className="mask-line">
              <Chars text="Five ways" />
            </span>
            <span className="mask-line">
              <Chars text="I grow" /> <em className="serif svc-heading-accent">brands</em>
            </span>
          </h2>
          <p className="svc-lede svc-head-fade">
            From the first pixel to the last conversion — one person accountable
            for how your business looks, ranks and sells online.
          </p>
        </header>

        <div className="svc-body">
          <ol className="svc-list">
            {services.map((service, i) => (
              <li
                key={service.id}
                className="svc-row"
                data-index={i}
                data-active={desktop ? active === i : undefined}
                onPointerEnter={desktop ? () => setActive(i) : undefined}
              >
                <button
                  type="button"
                  className="svc-trigger"
                  aria-pressed={desktop ? active === i : undefined}
                  onFocus={desktop ? () => setActive(i) : undefined}
                  onClick={() => {
                    if (desktop) setActive(i);
                    else setSeen((p) => p.map((v, k) => (k === i ? !v : v)));
                  }}
                >
                  <span className="svc-index label">0{i + 1}</span>
                  <span className="svc-title display">{service.title}</span>
                  <span className="svc-arrow" aria-hidden="true">
                    →
                  </span>
                </button>

                {!desktop && (
                  <div className="svc-card">
                    <div className="svc-card-visual">
                      <ServiceVisual id={service.id} active={seen[i]} />
                    </div>
                    <p className="svc-summary">{service.summary}</p>
                    <ul className="svc-points">
                      {service.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ol>

          {desktop && (
            <div className="svc-stage-wrap">
              <div className="svc-stage">
                <span className="svc-stage-light" aria-hidden="true" />
                {services.map((service, i) => (
                  <div key={service.id} className="svc-stage-layer" data-active={active === i}>
                    <ServiceVisual id={service.id} active={inView && active === i} />
                  </div>
                ))}
                <span className="svc-stage-tag label" aria-hidden="true">
                  0{active + 1} / 0{services.length}
                </span>
              </div>

              <div className="svc-detail" aria-live="polite">
                <p key={current.id} className="svc-summary svc-detail-enter">
                  {current.summary}
                </p>
                <ul key={`${current.id}-points`} className="svc-points svc-detail-enter">
                  {current.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
