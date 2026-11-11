"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, FINE_POINTER, prefersReducedMotion } from "@/lib/gsap";
import { nav, site, whatsappHref } from "@/content/site";
import { useApp } from "./AppShell";
import { Magnetic } from "./Magnetic";

export function Nav() {
  const { ready, navigate, lockScroll } = useApp();
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      gsap.set(header.current, { autoAlpha: 0, y: -24 });

      menuTl.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () => gsap.set(overlay.current, { visibility: "hidden" }),
        })
        .set(overlay.current, { visibility: "visible" })
        .fromTo(overlay.current, { "--reveal": "0%" }, { "--reveal": "150%", duration: 1, ease: "expo.inOut" })
        .from(
          ".menu-link-inner",
          { yPercent: 115, rotate: 5, duration: 0.95, ease: "expo.out", stagger: 0.07 },
          0.3,
        )
        .from(".menu-fade", { autoAlpha: 0, y: 18, duration: 0.6, ease: "power3.out", stagger: 0.05 }, 0.55);

      // Header gets out of the way while reading, returns on scroll-up.
      let hidden = false;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const shouldHide = self.direction === 1 && self.scroll() > 240 && !openRef.current;
          if (shouldHide === hidden) return;
          hidden = shouldHide;
          gsap.to(header.current, {
            yPercent: hidden ? -130 : 0,
            duration: 0.6,
            ease: "power3.out",
            overwrite: "auto",
          });
        },
      });

      // A soft glow trails the pointer inside the open menu.
      if (window.matchMedia(FINE_POINTER).matches) {
        const glowX = gsap.quickTo(".menu-glow", "x", { duration: 0.9, ease: "power3.out" });
        const glowY = gsap.quickTo(".menu-glow", "y", { duration: 0.9, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          glowX(e.clientX);
          glowY(e.clientY);
        };
        overlay.current?.addEventListener("pointermove", onMove);
        return () => overlay.current?.removeEventListener("pointermove", onMove);
      }
    },
    { scope: root },
  );

  useEffect(() => {
    if (ready) gsap.to(header.current, { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out", delay: 0.9 });
  }, [ready]);

  useEffect(() => {
    openRef.current = open;
    const tl = menuTl.current;
    const main = document.getElementById("main");
    if (!tl) return;

    if (open) {
      tl.timeScale(prefersReducedMotion() ? 6 : 1).play();
      gsap.to(header.current, { yPercent: 0, duration: 0.4 });
      main?.setAttribute("inert", "");
    } else {
      tl.timeScale(prefersReducedMotion() ? 6 : 1.6).reverse();
      main?.removeAttribute("inert");
    }
    lockScroll(open);

    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lockScroll]);

  const go = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
      e.preventDefault();
      navigate(href, {
        label,
        onCovered: () => {
          if (!openRef.current) return;
          menuTl.current?.pause(0);
          gsap.set(overlay.current, { visibility: "hidden" });
          setOpen(false);
        },
      });
    },
    [navigate],
  );

  return (
    <div ref={root}>
      <header ref={header} className="site-header">
        <a
          href="#top"
          className="site-logo"
          aria-label={`${site.name} — back to top`}
          onClick={(e) => go(e, "#top", site.name)}
        >
          <span className="site-logo-mark display" aria-hidden="true">
            {site.initials}
          </span>
          <span className="site-logo-name">{site.name}</span>
        </a>

        <nav className="site-links" aria-label="Primary">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="nav-link" onClick={(e) => go(e, item.href, item.label)}>
              {item.label}
            </a>
          ))}
        </nav>

        <Magnetic strength={0.3}>
          <button
            ref={toggle}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="menu-toggle-text" data-magnetic-inner>
              <span>{open ? "Close" : "Menu"}</span>
            </span>
            <span className="menu-toggle-icon" data-open={open} aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </Magnetic>
      </header>

      <div
        ref={overlay}
        id="site-menu"
        className="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
      >
        <span className="menu-glow" aria-hidden="true" />
        <nav className="menu-nav" aria-label="Menu">
          <ul>
            {nav.map((item, i) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="menu-link"
                  tabIndex={open ? 0 : -1}
                  onClick={(e) => go(e, item.href, item.label)}
                >
                  <span className="menu-link-mask">
                    <span className="menu-link-inner">
                      <span className="menu-link-index label">0{i + 1}</span>
                      <span className="menu-link-text display">{item.label}</span>
                      <span className="menu-link-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-foot">
          <p className="menu-fade label">{site.role}</p>
          <a
            className="menu-fade menu-cta"
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
          >
            Chat on WhatsApp <span aria-hidden="true">↗</span>
          </a>
          {site.socials.map((s) => (
            <a
              key={s.href}
              className="menu-fade menu-cta"
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
            >
              {s.label} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
