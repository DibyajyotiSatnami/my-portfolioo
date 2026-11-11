"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";
import { site, whatsappHref } from "@/content/site";
import { useApp } from "../AppShell";
import { Chars } from "../Split";
import { Magnetic } from "../Magnetic";
import { ParticleField } from "../ParticleField";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" className="wa-icon" aria-hidden="true">
    <path
      fill="currentColor"
      d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.400L3 29l6.8-1.700A13 13 0 1 0 16 3Zm0 23.700c-2 0-3.9-.5-5.6-1.500l-.4-.2-4 1 1.1-3.9-.3-.4A10.7 10.7 0 1 1 16 26.700Zm5.9-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.200c-.2.2-.4.2-.7.1-1.9-1-3.2-1.7-4.4-3.9-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.400c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.800s1.2 3.3 1.4 3.500c.2.2 2.4 3.7 5.8 5.1 2.2.9 3 .9 4.1.8.7-.1 1.9-.8 2.2-1.6.3-.7.3-1.4.2-1.5-.1-.2-.3-.2-.6-.4Z"
    />
  </svg>
);

/** Final call to action: the page closes on one oversized invitation. */
export function Contact() {
  const root = useRef<HTMLElement>(null);
  const { navigate } = useApp();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // The dark section rises out of the light one as a dome that flattens.
        const section = root.current!;
        gsap.fromTo(
          section,
          { "--dome": "56%" },
          {
            "--dome": "800%",
            ease: "power3.in",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 12%",
              scrub: true,
              onUpdate: (self) => (section.dataset.dome = String(self.progress < 1)),
              onRefresh: (self) => (section.dataset.dome = String(self.progress < 1)),
            },
          },
        );

        gsap.set(".contact-title .char", { yPercent: 118, rotate: 6 });
        gsap.set(".contact-gradient", { yPercent: 120, skewX: -16 });
        gsap.set(".contact-fade", { autoAlpha: 0, y: 30 });
        gsap.set(".contact-cta", { scale: 0.6, autoAlpha: 0 });

        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: ".contact-title", start: "top 78%" },
          })
          .to(".contact-title .char", { yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.018 })
          .to(".contact-gradient", { yPercent: 0, skewX: 0, duration: 1.4 }, 0.35)
          .to(".contact-fade", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.5)
          .to(".contact-cta", { scale: 1, autoAlpha: 1, duration: 1.2, ease: "elastic.out(1, 0.6)" }, 0.6);

        gsap.fromTo(
          ".contact-glow",
          { yPercent: 25 },
          {
            yPercent: -25,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      mm.add(`${MOTION_OK} and ${FINE_POINTER}`, () => {
        const x = gsap.quickTo(".contact-spot", "x", { duration: 1, ease: "power3.out" });
        const y = gsap.quickTo(".contact-spot", "y", { duration: 1, ease: "power3.out" });
        const move = (e: PointerEvent) => {
          const rect = root.current!.getBoundingClientRect();
          x(e.clientX - rect.left);
          y(e.clientY - rect.top);
        };
        root.current?.addEventListener("pointermove", move);
        return () => root.current?.removeEventListener("pointermove", move);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="contact" className="contact" data-theme-section="ember" aria-labelledby="contact-title">
      <div className="contact-bg" aria-hidden="true">
        <span className="contact-glow contact-glow--a" />
        <span className="contact-glow contact-glow--b" />
        <span className="contact-spot" />
        <ParticleField className="contact-particles" />
      </div>

      <div className="contact-inner wrap">
        <p className="section-tag label contact-fade">
          <span className="section-tag-dot" aria-hidden="true" />
          Contact
        </p>

        <h2 id="contact-title" className="contact-title display">
          <span className="mask-line">
            <Chars text="Let's create" />
          </span>
          <span className="mask-line">
            <Chars text="something" />
          </span>
          <span className="mask-line mask-line--serif">
            <span className="sr-only">extraordinary.</span>
            <span className="contact-gradient serif text-gradient" aria-hidden="true">
              extraordinary.
            </span>
          </span>
        </h2>

        <div className="contact-row">
          <p className="contact-lede contact-fade">
            Tell me about your business and where you want it to go. I reply
            personally — usually within a day.
          </p>

          <div className="contact-cta">
            <Magnetic strength={0.3}>
              <a
                className="wa"
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp (opens in a new tab)"
              >
                <span className="wa-ring" aria-hidden="true" />
                <span className="wa-ring wa-ring--late" aria-hidden="true" />
                <span className="wa-body">
                  <span className="wa-content" data-magnetic-inner>
                    <WhatsAppIcon />
                    <span className="wa-text">
                      <span data-text="Chat on WhatsApp">Chat on WhatsApp</span>
                    </span>
                  </span>
                </span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <footer className="footer wrap">
        <p className="contact-fade">
          © {site.copyrightYear} {site.name}. All rights reserved.
        </p>
        <ul className="footer-links contact-fade">
          {site.socials.map((social) => (
            <li key={social.href}>
              <a href={social.href} target="_blank" rel="noopener noreferrer" className="nav-link">
                {social.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#top"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                navigate("#top", { label: site.name });
              }}
            >
              Back to top ↑
            </a>
          </li>
        </ul>
      </footer>
    </section>
  );
}
