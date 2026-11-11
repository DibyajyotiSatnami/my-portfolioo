"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Preloader } from "./Preloader";
import { Cursor } from "./Cursor";
import { Nav } from "./Nav";

type NavigateOptions = { label?: string; onCovered?: () => void };

type AppContextValue = {
  /** True once the preloader has started leaving — cue for intro animations. */
  ready: boolean;
  /** Full-screen transition to an in-page target such as "#work". */
  navigate: (hash: string, options?: NavigateOptions) => void;
  /** Smoothly scroll to an absolute scroll position or element. */
  scrollTo: (target: number | HTMLElement, duration?: number) => void;
  lockScroll: (locked: boolean) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppShell>");
  return ctx;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  /* ---------- Smooth scrolling (Lenis driven by the GSAP ticker) ---------- */
  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.documentElement.classList.add("is-loading");

    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.105, wheelMultiplier: 0.95, anchors: false });
    lenisRef.current = lenis;
    lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* ---------- Recalculate scroll positions whenever the page height changes ---------- */
  useEffect(() => {
    let height = document.documentElement.scrollHeight;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver(() => {
      const next = document.documentElement.scrollHeight;
      if (Math.abs(next - height) < 2) return;
      height = next;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    observer.observe(document.body);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  /* ---------- Background colour story: each section declares a theme ---------- */
  useGSAP(() => {
    const root = document.documentElement;
    gsap.utils.toArray<HTMLElement>("[data-theme-section]").forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) root.dataset.theme = section.dataset.themeSection;
        },
      });
    });
  });

  const handleReady = useCallback(() => {
    document.documentElement.classList.remove("is-loading");
    lenisRef.current?.start();
    setReady(true);
    ScrollTrigger.refresh();
  }, []);

  const lockScroll = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
    }
    document.documentElement.classList.toggle("is-locked", locked);
  }, []);

  const scrollTo = useCallback((target: number | HTMLElement, duration = 1.4) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { duration, easing: (t) => 1 - Math.pow(1 - t, 4) });
      return;
    }
    const top =
      typeof target === "number"
        ? target
        : target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: "auto" });
  }, []);

  const navigate = useCallback((hash: string, options: NavigateOptions = {}) => {
    const target = hash === "#top" ? document.body : document.querySelector<HTMLElement>(hash);
    if (!target || busy.current) return;

    const jump = () => {
      options.onCovered?.();
      const lenis = lenisRef.current;
      if (lenis) lenis.scrollTo(target, { immediate: true, force: true });
      else target.scrollIntoView({ behavior: "auto", block: "start" });
      ScrollTrigger.update();
      if (hash !== "#top") {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };

    const curtain = curtainRef.current;
    if (prefersReducedMotion() || !curtain) {
      jump();
      return;
    }

    busy.current = true;
    if (labelRef.current) labelRef.current.textContent = options.label ?? "";
    const panels = curtain.querySelectorAll(".curtain-panel");

    gsap
      .timeline({
        onComplete: () => {
          busy.current = false;
          gsap.set(curtain, { visibility: "hidden" });
        },
      })
      .set(curtain, { visibility: "visible" })
      .fromTo(
        panels,
        { yPercent: 100 },
        { yPercent: 0, duration: 0.65, ease: "expo.inOut", stagger: 0.09 },
      )
      .fromTo(
        labelRef.current,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.55, ease: "expo.out" },
        "-=0.35",
      )
      .add(jump)
      .to(labelRef.current, { yPercent: -110, duration: 0.4, ease: "expo.in" }, "+=0.12")
      .to(
        panels,
        { yPercent: -100, duration: 0.7, ease: "expo.inOut", stagger: { each: 0.09, from: "end" } },
        "-=0.15",
      );
  }, []);

  const value = useMemo(
    () => ({ ready, navigate, scrollTo, lockScroll }),
    [ready, navigate, scrollTo, lockScroll],
  );

  return (
    <AppContext.Provider value={value}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Preloader onDone={handleReady} />
      <Cursor />
      <Nav />
      <div id="main">{children}</div>

      <div ref={curtainRef} className="curtain" aria-hidden="true">
        <div className="curtain-panel curtain-panel--accent" />
        <div className="curtain-panel curtain-panel--ink">
          <span className="curtain-label-mask">
            <span ref={labelRef} className="curtain-label display" />
          </span>
        </div>
      </div>
      <div className="grain" aria-hidden="true" />
    </AppContext.Provider>
  );
}
