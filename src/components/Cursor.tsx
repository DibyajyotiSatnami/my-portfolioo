"use client";

import { useEffect, useRef } from "react";
import { gsap, FINE_POINTER } from "@/lib/gsap";

/**
 * Custom cursor with three states, driven by `data-cursor` attributes:
 *   - default:           small dot + trailing ring
 *   - "link" (or a/btn): ring expands
 *   - "view":            ring becomes a labelled disc (data-cursor-label)
 * Only mounted for mouse-like pointers; touch devices keep native behaviour.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const disc = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !dot.current || !ring.current) return;
    if (!window.matchMedia(FINE_POINTER).matches) return;

    document.documentElement.classList.add("has-cursor");

    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3.out" });
    const trail = [ring.current, disc.current];
    const ringX = gsap.quickTo(trail, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(trail, "y", { duration: 0.55, ease: "power3.out" });

    let visible = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (!visible) {
        visible = true;
        gsap.set([dot.current, ...trail], { x: e.clientX, y: e.clientY });
        el.dataset.visible = "true";
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.<HTMLElement>(
        "[data-cursor], a, button",
      );
      const state = target ? target.dataset.cursor || "link" : "default";
      el.dataset.state = state;
      if (label.current) label.current.textContent = target?.dataset.cursorLabel ?? "";
    };

    const down = () => (el.dataset.pressed = "true");
    const up = () => (el.dataset.pressed = "false");
    const leave = () => {
      visible = false;
      el.dataset.visible = "false";
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  // Dot and ring blend with the page (difference); the labelled disc does not.
  // They are siblings rather than nested so each blends against the page itself.
  return (
    <div ref={root} className="cursor" data-state="default" data-visible="false" aria-hidden="true">
      <div ref={ring} className="cursor-ring">
        <span />
      </div>
      <div ref={disc} className="cursor-disc">
        <span>
          <span ref={label} className="cursor-label" />
        </span>
      </div>
      <div ref={dot} className="cursor-dot">
        <span />
      </div>
    </div>
  );
}
