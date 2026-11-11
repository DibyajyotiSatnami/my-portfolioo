"use client";

import { gsap } from "@/lib/gsap";
import type { ServiceId } from "@/content/site";
import { useVisual } from "./useVisual";

const BONE = "#ece8e1";
const ACCENT = "#ff4d1f";
const AMBER = "#ffae1a";
const VIOLET = "#6d4bff";

type VisualProps = { active: boolean };

const svgProps = (active: boolean) => ({
  viewBox: "0 0 400 300",
  className: `svc-visual${active ? " is-active" : ""}`,
  role: "img" as const,
  focusable: false,
});

/* ------------------------------------------------------------------ */
/*  01 — Website Development: a browser window assembles itself        */
/* ------------------------------------------------------------------ */
function WebVisual({ active }: VisualProps) {
  const ref = useVisual(active, ({ tl }) => {
    tl.fromTo(".w-frame", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" })
      .from(".w-bar", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.6 }, 0.35)
      .from(".w-dot", { scale: 0, transformOrigin: "50% 50%", duration: 0.4, ease: "back.out(3)", stagger: 0.07 }, 0.5)
      .from(".w-url", { scaleX: 0, transformOrigin: "50% 50%", duration: 0.5 }, 0.6)
      .from(".w-nav", { y: -10, autoAlpha: 0, duration: 0.45, stagger: 0.05 }, 0.8)
      .from(".w-head", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.6, ease: "expo.out", stagger: 0.1 }, 1)
      .from(".w-copy", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.5, stagger: 0.07 }, 1.2)
      .from(".w-art", { scale: 0.4, rotate: 12, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.8, ease: "back.out(1.6)" }, 1.05)
      .from(".w-art-shape", { scale: 0, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(2)", stagger: 0.08 }, 1.35)
      .from(".w-btn", { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(2.4)" }, 1.4)
      .from(".w-card", { y: 22, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, 1.5)
      .fromTo(".w-cursor", { x: 310, y: 268, autoAlpha: 0 }, { x: 92, y: 186, autoAlpha: 1, duration: 0.9, ease: "power3.inOut" }, 1.9)
      .to(".w-btn", { scale: 0.9, transformOrigin: "50% 50%", duration: 0.12, yoyo: true, repeat: 1 }, 2.8)
      .fromTo(".w-ripple", { attr: { r: 4 }, autoAlpha: 0.9 }, { attr: { r: 30 }, autoAlpha: 0, duration: 0.7, ease: "power2.out" }, 2.85);
  });

  return (
    <svg ref={ref} {...svgProps(active)} aria-label="A browser window assembling itself">
      <defs>
        <linearGradient id="w-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={ACCENT} />
          <stop offset="1" stopColor={VIOLET} />
        </linearGradient>
      </defs>
      <rect className="w-frame draw" x="40" y="34" width="320" height="232" rx="12" fill="none" stroke={BONE} strokeOpacity="0.55" strokeWidth="1.5" pathLength={1} />
      <line className="w-bar" x1="40" y1="64" x2="360" y2="64" stroke={BONE} strokeOpacity="0.3" />
      <circle className="w-dot" cx="58" cy="49" r="4" fill={ACCENT} />
      <circle className="w-dot" cx="72" cy="49" r="4" fill={AMBER} />
      <circle className="w-dot" cx="86" cy="49" r="4" fill={VIOLET} />
      <rect className="w-url" x="118" y="42" width="164" height="14" rx="7" fill={BONE} fillOpacity="0.12" />

      <rect className="w-nav" x="58" y="78" width="30" height="7" rx="3.5" fill={BONE} />
      <rect className="w-nav" x="232" y="79" width="22" height="5" rx="2.5" fill={BONE} fillOpacity="0.4" />
      <rect className="w-nav" x="262" y="79" width="22" height="5" rx="2.5" fill={BONE} fillOpacity="0.4" />
      <rect className="w-nav" x="292" y="79" width="22" height="5" rx="2.5" fill={BONE} fillOpacity="0.4" />
      <rect className="w-nav" x="322" y="76" width="22" height="11" rx="5.5" fill={ACCENT} />

      <rect className="w-head" x="58" y="106" width="150" height="15" rx="3" fill={BONE} />
      <rect className="w-head" x="58" y="127" width="112" height="15" rx="3" fill="url(#w-grad)" />
      <rect className="w-copy" x="58" y="153" width="132" height="5" rx="2.5" fill={BONE} fillOpacity="0.35" />
      <rect className="w-copy" x="58" y="163" width="98" height="5" rx="2.5" fill={BONE} fillOpacity="0.35" />
      <rect className="w-btn" x="58" y="178" width="62" height="18" rx="9" fill={ACCENT} />

      <g className="w-art">
        <rect x="228" y="100" width="114" height="98" rx="10" fill="url(#w-grad)" fillOpacity="0.22" stroke="url(#w-grad)" />
        <circle className="w-art-shape" cx="285" cy="149" r="26" fill="url(#w-grad)" />
        <rect className="w-art-shape" x="244" y="114" width="20" height="20" rx="4" fill={AMBER} />
        <circle className="w-art-shape" cx="322" cy="180" r="8" fill={BONE} />
      </g>

      {[58, 156, 254].map((x) => (
        <g key={x} className="w-card">
          <rect x={x} y="212" width="88" height="40" rx="7" fill={BONE} fillOpacity="0.06" stroke={BONE} strokeOpacity="0.25" />
          <rect x={x + 10} y="223" width="34" height="5" rx="2.5" fill={BONE} fillOpacity="0.7" />
          <rect x={x + 10} y="235" width="56" height="4" rx="2" fill={BONE} fillOpacity="0.3" />
        </g>
      ))}

      <circle className="w-ripple" cx="89" cy="187" r="4" fill="none" stroke={BONE} strokeWidth="1.5" />
      <path className="w-cursor" d="M0 0v17l4.6-4.2 3.2 7.4 2.9-1.3-3.2-7.2H14Z" fill={BONE} stroke="#0d0d11" strokeWidth="1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  02 — Google Maps SEO: a map grid expands, pins drop                */
/* ------------------------------------------------------------------ */
const GRID = [-104, -78, -52, -26, 0, 26, 52, 78, 104];
const iso = (x: number, y: number) => ({
  x: 200 + (x - y) * 0.7071,
  y: 176 + (x + y) * 0.7071 * 0.5,
});

function Pin({ x, y, main = false }: { x: number; y: number; main?: boolean }) {
  const p = iso(x, y);
  const s = main ? 1.25 : 0.8;
  return (
    <g transform={`translate(${p.x} ${p.y})`}>
      <ellipse className="m-pulse" rx="10" ry="5" fill="none" stroke={main ? ACCENT : BONE} strokeWidth="1.2" />
      <ellipse className="m-pulse m-pulse--late" rx="10" ry="5" fill="none" stroke={main ? ACCENT : BONE} strokeWidth="1.2" />
      <g className="m-pin">
        <g transform={`scale(${s})`}>
          <path
            d="M0 0C-9-11-13-17-13-24a13 13 0 1 1 26 0c0 7-4 13-13 24Z"
            fill={main ? ACCENT : "#15151b"}
            stroke={main ? ACCENT : BONE}
            strokeWidth="1.4"
          />
          <circle cy="-24" r="4.6" fill={main ? "#0d0d11" : BONE} />
        </g>
      </g>
    </g>
  );
}

function MapVisual({ active }: VisualProps) {
  const ref = useVisual(active, ({ tl }) => {
    tl.from(".m-line", {
      scale: 0,
      transformOrigin: "50% 50%",
      duration: 0.9,
      ease: "expo.out",
      stagger: { each: 0.035, from: "center" },
    })
      .from(".m-block", { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.06 }, 0.5)
      .fromTo(".m-road", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.15 }, 0.55)
      .fromTo(".m-radius", { attr: { r: 0 }, autoAlpha: 1 }, { attr: { r: 96 }, duration: 1.2, ease: "expo.out" }, 0.8)
      .from(".m-pin", { y: -90, autoAlpha: 0, duration: 0.9, ease: "bounce.out", stagger: 0.16 }, 1)
      .from(".m-chip", { y: 14, autoAlpha: 0, duration: 0.5 }, 1.7)
      .from(".m-star", { scale: 0, transformOrigin: "50% 50%", duration: 0.35, ease: "back.out(3)", stagger: 0.07 }, 1.9)
      .from(".m-rank", { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(2.5)" }, 2.25);
  });

  return (
    <svg ref={ref} {...svgProps(active)} aria-label="A map grid expanding with location pins dropping onto it">
      <g transform="translate(200 176) scale(1 0.5) rotate(45)">
        {GRID.map((v) => (
          <g key={v}>
            <line className="m-line" x1="-104" x2="104" y1={v} y2={v} stroke={BONE} strokeOpacity="0.22" />
            <line className="m-line" y1="-104" y2="104" x1={v} x2={v} stroke={BONE} strokeOpacity="0.22" />
          </g>
        ))}
        <rect className="m-block" x="-78" y="-78" width="26" height="26" fill={BONE} fillOpacity="0.1" />
        <rect className="m-block" x="26" y="-52" width="52" height="26" fill={VIOLET} fillOpacity="0.35" />
        <rect className="m-block" x="-52" y="26" width="26" height="52" fill={BONE} fillOpacity="0.1" />
        <rect className="m-block" x="52" y="52" width="26" height="26" fill={AMBER} fillOpacity="0.3" />
        <path className="m-road draw" d="M-104 0H104" stroke={BONE} strokeOpacity="0.75" strokeWidth="3" pathLength={1} fill="none" />
        <path className="m-road draw" d="M-26-104V26H78V104" stroke={BONE} strokeOpacity="0.75" strokeWidth="3" pathLength={1} fill="none" />
        <circle className="m-radius" r="0" fill={ACCENT} fillOpacity="0.1" stroke={ACCENT} strokeDasharray="4 5" strokeWidth="1.5" />
      </g>

      <Pin x={-65} y={-39} />
      <Pin x={65} y={39} />
      <Pin x={0} y={0} main />

      <g className="m-chip">
        <rect x="236" y="34" width="132" height="46" rx="10" fill="#15151b" stroke={BONE} strokeOpacity="0.25" />
        <rect x="248" y="46" width="56" height="6" rx="3" fill={BONE} fillOpacity="0.85" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            className="m-star"
            transform={`translate(${252 + i * 12} 66)`}
            d="M0-5l1.5 3.3 3.6.4-2.7 2.4.8 3.5L0 2.8l-3.2 1.8.8-3.5-2.7-2.4 3.6-.4Z"
            fill={AMBER}
          />
        ))}
        <g className="m-rank">
          <circle cx="344" cy="57" r="13" fill={ACCENT} />
          <text x="344" y="61.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0d0d11">
            #1
          </text>
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  03 — Digital Marketing: a network of connected, flowing channels   */
/* ------------------------------------------------------------------ */
const HUB = { x: 200, y: 150 };
const CHANNELS = [
  { x: 78, y: 66, color: VIOLET },
  { x: 318, y: 58, color: AMBER },
  { x: 352, y: 168, color: BONE },
  { x: 296, y: 250, color: VIOLET },
  { x: 100, y: 242, color: AMBER },
  { x: 46, y: 152, color: BONE },
];

function NodesVisual({ active }: VisualProps) {
  const ref = useVisual(active, ({ tl, loop }) => {
    tl.from(".n-hub", { scale: 0, transformOrigin: "50% 50%", duration: 0.8, ease: "back.out(1.8)" })
      .fromTo(".n-link", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out", stagger: 0.08 }, 0.3)
      .from(".n-node", { scale: 0, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(2.2)", stagger: 0.08 }, 0.7)
      .fromTo(".n-web", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut", stagger: 0.06 }, 1.1)
      .to(".n-flow, .n-packet", { autoAlpha: 1, duration: 0.5 }, 1.5);

    gsap.set(".n-flow, .n-packet", { autoAlpha: 0 });
    gsap.utils.toArray<SVGCircleElement>(".n-packet").forEach((packet, i) => {
      const from = CHANNELS[i % CHANNELS.length];
      const inbound = i % 2 === 0;
      loop(
        gsap.fromTo(
          packet,
          { attr: { cx: inbound ? from.x : HUB.x, cy: inbound ? from.y : HUB.y } },
          {
            attr: { cx: inbound ? HUB.x : from.x, cy: inbound ? HUB.y : from.y },
            duration: 1.5 + (i % 3) * 0.35,
            ease: "power1.inOut",
            repeat: -1,
            delay: i * 0.28,
          },
        ),
      );
    });
    loop(gsap.to(".n-hub-ring", { rotate: 360, transformOrigin: "50% 50%", duration: 14, ease: "none", repeat: -1 }));
    loop(
      gsap.to(".n-node", {
        y: "+=5",
        duration: 1.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.3, from: "random" },
      }),
    );
  });

  const web = CHANNELS.map((c, i) => {
    const next = CHANNELS[(i + 1) % CHANNELS.length];
    return `M${c.x} ${c.y}L${next.x} ${next.y}`;
  });

  return (
    <svg ref={ref} {...svgProps(active)} aria-label="Marketing channels connected to a central hub with data flowing between them">
      {web.map((d, i) => (
        <path key={i} className="n-web draw" d={d} stroke={BONE} strokeOpacity="0.14" pathLength={1} fill="none" />
      ))}
      {CHANNELS.map((c, i) => (
        <g key={i}>
          <line className="n-link draw" x1={HUB.x} y1={HUB.y} x2={c.x} y2={c.y} stroke={BONE} strokeOpacity="0.3" pathLength={1} />
          <line className="n-flow" x1={c.x} y1={c.y} x2={HUB.x} y2={HUB.y} stroke={i % 2 ? ACCENT : AMBER} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
      {CHANNELS.map((c, i) => (
        <circle key={i} className="n-packet" r="3.2" cx={c.x} cy={c.y} fill={i % 2 ? AMBER : ACCENT} />
      ))}

      <g className="n-hub">
        <circle className="n-hub-glow" cx={HUB.x} cy={HUB.y} r="40" fill={ACCENT} fillOpacity="0.14" />
        <circle className="n-hub-ring" cx={HUB.x} cy={HUB.y} r="32" fill="none" stroke={ACCENT} strokeDasharray="3 7" strokeWidth="1.5" />
        <circle cx={HUB.x} cy={HUB.y} r="22" fill={ACCENT} />
        <path d="M191 156l6-9 5 5 8-11" fill="none" stroke="#0d0d11" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {CHANNELS.map((c, i) => (
        <g key={i} className="n-node">
          <circle cx={c.x} cy={c.y} r="17" fill="#15151b" stroke={c.color} strokeWidth="1.5" />
          {i === 0 && <path d={`M${c.x - 4} ${c.y - 6}v12l10-6Z`} fill={c.color} />}
          {i === 1 && (
            <g fill="none" stroke={c.color} strokeWidth="1.8" strokeLinecap="round">
              <circle cx={c.x - 1.5} cy={c.y - 1.5} r="5" />
              <path d={`M${c.x + 2.5} ${c.y + 2.5}l4 4`} />
            </g>
          )}
          {i === 2 && (
            <path
              d={`M${c.x} ${c.y + 6}c-9-5-8-12-3.5-12 2 0 3.5 2 3.5 2s1.5-2 3.5-2c4.5 0 5.5 7-3.5 12Z`}
              fill={c.color}
            />
          )}
          {i === 3 && (
            <g fill="none" stroke={c.color} strokeWidth="1.6" strokeLinejoin="round">
              <rect x={c.x - 7} y={c.y - 5} width="14" height="10" rx="2" />
              <path d={`M${c.x - 7} ${c.y - 4}l7 5 7-5`} />
            </g>
          )}
          {i === 4 && (
            <g fill={c.color}>
              <rect x={c.x - 7} y={c.y} width="3.4" height="6" rx="1" />
              <rect x={c.x - 1.7} y={c.y - 4} width="3.4" height="10" rx="1" />
              <rect x={c.x + 3.6} y={c.y - 7} width="3.4" height="13" rx="1" />
            </g>
          )}
          {i === 5 && (
            <g fill="none" stroke={c.color} strokeWidth="1.7" strokeLinecap="round">
              <circle cx={c.x} cy={c.y} r="2.6" />
              <path d={`M${c.x + 2.6} ${c.y - 2}v3.200a2.4 2.4 0 0 0 4.8 0V${c.y}a7.4 7.4 0 1 0-3 5.9`} />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  04 — Meta Ads: campaign dashboard and audience targeting           */
/* ------------------------------------------------------------------ */
const AUDIENCE = [
  [248, 118, 0], [268, 98, 1], [294, 92, 0], [320, 104, 1], [338, 128, 0],
  [342, 156, 1], [328, 182, 0], [302, 194, 1], [274, 188, 0], [254, 168, 1],
  [246, 142, 0], [276, 124, 1], [300, 118, 1], [318, 138, 0], [310, 164, 1],
  [284, 166, 0], [268, 146, 1], [294, 142, 1],
] as const;

function MetaVisual({ active }: VisualProps) {
  const ref = useVisual(active, ({ tl, loop, root }) => {
    const metrics = { reach: 0 };
    const reachText = root.querySelector(".a-reach");

    tl.from(".a-card", { y: 30, autoAlpha: 0, duration: 0.8, ease: "expo.out" })
      .from(".a-card-part", { autoAlpha: 0, y: 10, duration: 0.45, stagger: 0.07 }, 0.25)
      .from(".a-creative", { scale: 0.7, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.7, ease: "back.out(1.6)" }, 0.4)
      .from(".a-panel", { autoAlpha: 0, x: 24, duration: 0.7, ease: "expo.out" }, 0.35)
      .to(".a-knob", { x: 14, duration: 0.35, ease: "power2.inOut" }, 0.95)
      .to(".a-switch", { fill: ACCENT, duration: 0.35 }, 0.95)
      .fromTo(".a-ring", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut", stagger: 0.12 }, 0.8)
      .from(".a-person", { scale: 0, transformOrigin: "50% 50%", duration: 0.35, ease: "back.out(2.5)", stagger: { each: 0.03, from: "random" } }, 1.1)
      .fromTo(".a-reticle", { autoAlpha: 0, scale: 2.2, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "expo.out" }, 1.6)
      .to(".a-person--hit", { fill: ACCENT, scale: 1.5, transformOrigin: "50% 50%", duration: 0.35, ease: "back.out(3)", stagger: 0.05 }, 1.9)
      .from(".a-bar", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.9, ease: "expo.out", stagger: 0.12 }, 1.7)
      .fromTo(
        metrics,
        { reach: 0 },
        {
          reach: 12.4,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            if (reachText) reachText.textContent = `${metrics.reach.toFixed(1)}K`;
          },
        },
        1.7,
      )
      .from(".a-like", { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(3)" }, 2.3);

    loop(gsap.to(".a-reticle-spin", { rotate: 360, transformOrigin: "50% 50%", duration: 9, ease: "none", repeat: -1 }));
    loop(gsap.to(".a-like", { scale: 1.18, transformOrigin: "50% 50%", duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 3 }));
  });

  return (
    <svg ref={ref} {...svgProps(active)} aria-label="An ad creative next to a campaign dashboard locking onto a target audience">
      <defs>
        <linearGradient id="a-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={VIOLET} />
          <stop offset="1" stopColor={ACCENT} />
        </linearGradient>
      </defs>

      <g className="a-card">
        <rect x="34" y="36" width="140" height="228" rx="14" fill="#15151b" stroke={BONE} strokeOpacity="0.25" />
        <circle className="a-card-part" cx="54" cy="58" r="9" fill="url(#a-grad)" />
        <rect className="a-card-part" x="70" y="51" width="52" height="5" rx="2.5" fill={BONE} fillOpacity="0.85" />
        <rect className="a-card-part" x="70" y="61" width="34" height="4" rx="2" fill={BONE} fillOpacity="0.3" />
        <g className="a-creative">
          <rect x="46" y="78" width="116" height="104" rx="9" fill="url(#a-grad)" />
          <circle cx="104" cy="126" r="24" fill="#0d0d11" fillOpacity="0.28" />
          <path d="M97 114v24l20-12Z" fill={BONE} />
        </g>
        <rect className="a-card-part" x="46" y="194" width="88" height="5" rx="2.5" fill={BONE} fillOpacity="0.7" />
        <rect className="a-card-part" x="46" y="205" width="62" height="4" rx="2" fill={BONE} fillOpacity="0.3" />
        <rect className="a-card-part" x="46" y="226" width="116" height="24" rx="12" fill={BONE} />
        <rect className="a-card-part" x="82" y="235.5" width="44" height="5" rx="2.5" fill="#0d0d11" />
        <path className="a-like" d="M160 76c-11-6-10-15-4.5-15 2.5 0 4.5 2.5 4.5 2.500s2-2.5 4.5-2.500c5.5 0 6.5 9-4.5 15Z" fill={ACCENT} stroke="#0d0d11" strokeWidth="2" transform="translate(4 -22)" />
      </g>

      <g className="a-panel">
        <rect x="204" y="36" width="162" height="228" rx="14" fill={BONE} fillOpacity="0.04" stroke={BONE} strokeOpacity="0.2" />
        <text x="218" y="60" fontSize="8.5" letterSpacing="1.4" fill={BONE} fillOpacity="0.6">
          CAMPAIGN
        </text>
        <rect className="a-switch" x="326" y="49" width="28" height="14" rx="7" fill="#33333d" />
        <circle className="a-knob" cx="333" cy="56" r="5" fill={BONE} />

        <circle className="a-ring draw" cx="294" cy="142" r="56" fill="none" stroke={BONE} strokeOpacity="0.2" pathLength={1} />
        <circle className="a-ring draw" cx="294" cy="142" r="36" fill="none" stroke={BONE} strokeOpacity="0.2" pathLength={1} />
        {AUDIENCE.map(([x, y, hit], i) => (
          <circle key={i} className={`a-person${hit ? " a-person--hit" : ""}`} cx={x} cy={y} r="3" fill={BONE} fillOpacity={hit ? 1 : 0.35} />
        ))}
        <g className="a-reticle">
          <g className="a-reticle-spin">
            <circle cx="294" cy="142" r="46" fill="none" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="28 20" />
          </g>
          <path d="M294 86v14M294 184v14M238 142h14M336 142h14" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" />
        </g>

        <text x="218" y="222" fontSize="8" letterSpacing="1.2" fill={BONE} fillOpacity="0.5">
          REACH
        </text>
        <text className="a-reach" x="352" y="222" textAnchor="end" fontSize="9" fontWeight="700" fill={BONE}>
          12.4K
        </text>
        <rect x="218" y="229" width="134" height="5" rx="2.5" fill={BONE} fillOpacity="0.1" />
        <rect className="a-bar" x="218" y="229" width="112" height="5" rx="2.5" fill="url(#a-grad)" />
        <rect x="218" y="243" width="134" height="5" rx="2.5" fill={BONE} fillOpacity="0.1" />
        <rect className="a-bar" x="218" y="243" width="74" height="5" rx="2.5" fill={AMBER} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  05 — Performance Marketing: analytics chart and conversion funnel  */
/* ------------------------------------------------------------------ */
const BARS = [34, 52, 44, 70, 62, 92, 116];
const FUNNEL = [
  { points: "262,58 370,58 356,92 276,92", label: "VISITS" },
  { points: "278,98 354,98 342,132 290,132", label: "CLICKS" },
  { points: "292,138 340,138 330,172 302,172", label: "LEADS" },
  { points: "304,178 328,178 324,208 308,208", label: "SALES" },
];

function PerformanceVisual({ active }: VisualProps) {
  const ref = useVisual(active, ({ tl, loop }) => {
    tl.fromTo(".p-axis", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" })
      .from(".p-grid", { autoAlpha: 0, duration: 0.5, stagger: 0.06 }, 0.2)
      .from(".p-bar", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.8, ease: "expo.out", stagger: 0.06 }, 0.35)
      .fromTo(".p-line", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0.7)
      .from(".p-area", { autoAlpha: 0, duration: 0.9 }, 1.3)
      .from(".p-point", { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(3)" }, 2)
      .from(".p-tag", { y: 10, autoAlpha: 0, duration: 0.5 }, 2.1)
      .from(".p-funnel", { y: -18, autoAlpha: 0, duration: 0.6, ease: "back.out(1.6)", stagger: 0.13 }, 0.6)
      .from(".p-funnel-label", { autoAlpha: 0, x: -6, duration: 0.4, stagger: 0.13 }, 0.85)
      .from(".p-result", { scale: 0, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(2.4)" }, 1.5);

    gsap.utils.toArray<SVGCircleElement>(".p-drop").forEach((drop, i) => {
      loop(
        gsap
          .timeline({ repeat: -1, repeatDelay: 0.4, delay: 1.8 + i * 0.6 })
          .set(drop, { attr: { cy: 50 }, autoAlpha: 0 })
          .to(drop, { autoAlpha: 1, duration: 0.2 })
          .to(drop, { attr: { cy: 214 }, duration: 1.5, ease: "power1.in" }, "<")
          .to(drop, { autoAlpha: 0, duration: 0.15 }, ">-0.15"),
      );
    });
    gsap.set(".p-drop", { autoAlpha: 0 });
    loop(gsap.to(".p-point-ring", { attr: { r: 14 }, autoAlpha: 0, duration: 1.4, ease: "power2.out", repeat: -1, delay: 2.2 }));
  });

  return (
    <svg ref={ref} {...svgProps(active)} aria-label="An analytics chart trending upward beside a conversion funnel">
      <defs>
        <linearGradient id="p-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={ACCENT} stopOpacity="0.45" />
          <stop offset="1" stopColor={ACCENT} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="p-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={AMBER} />
          <stop offset="1" stopColor={ACCENT} />
        </linearGradient>
      </defs>

      {[90, 130, 170].map((y) => (
        <line key={y} className="p-grid" x1="40" x2="232" y1={y} y2={y} stroke={BONE} strokeOpacity="0.12" strokeDasharray="3 5" />
      ))}
      <path className="p-axis draw" d="M40 52V210H232" fill="none" stroke={BONE} strokeOpacity="0.5" strokeWidth="1.5" pathLength={1} />
      {BARS.map((h, i) => (
        <rect key={i} className="p-bar" x={52 + i * 25} y={210 - h} width="14" height={h} rx="3" fill={BONE} fillOpacity="0.12" />
      ))}
      <path className="p-area" d="M46 188C70 180 84 150 109 152S150 122 172 112 208 76 226 62V210H46Z" fill="url(#p-area)" />
      <path className="p-line draw" d="M46 188C70 180 84 150 109 152S150 122 172 112 208 76 226 62" fill="none" stroke="url(#p-stroke)" strokeWidth="3" strokeLinecap="round" pathLength={1} />
      <circle className="p-point-ring" cx="226" cy="62" r="5" fill="none" stroke={ACCENT} strokeWidth="1.5" />
      <circle className="p-point" cx="226" cy="62" r="5" fill={ACCENT} stroke="#0d0d11" strokeWidth="2" />
      <g className="p-tag">
        <rect x="150" y="34" width="62" height="20" rx="10" fill={ACCENT} />
        <path d="M160 48l5-6 4 3 6-7m0 0h-4.500m4.5 0v4.5" fill="none" stroke="#0d0d11" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="181" y="47.5" fontSize="8.5" fontWeight="800" letterSpacing="0.8" fill="#0d0d11">
          ROAS
        </text>
      </g>
      <text x="40" y="232" fontSize="8" letterSpacing="1.4" fill={BONE} fillOpacity="0.45">
        REVENUE / WEEK
      </text>

      {FUNNEL.map((layer, i) => (
        <g key={layer.label} transform="translate(12 0)">
          <polygon
            className="p-funnel"
            points={layer.points}
            fill={i === FUNNEL.length - 1 ? ACCENT : BONE}
            fillOpacity={i === FUNNEL.length - 1 ? 1 : 0.1 + i * 0.07}
            stroke={i === FUNNEL.length - 1 ? ACCENT : BONE}
            strokeOpacity="0.45"
            strokeLinejoin="round"
          />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <circle key={i} className="p-drop" cx={320 + i * 8} cy="50" r="2.6" fill={AMBER} />
      ))}
      <g className="p-result">
        <circle cx="328" cy="238" r="15" fill="none" stroke={ACCENT} strokeWidth="1.5" />
        <path d="M321 238l5 5 9-10" fill="none" stroke={ACCENT} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {FUNNEL.map((layer, i) => (
        <text key={layer.label} className="p-funnel-label" x="264" y={78 + i * 40} textAnchor="end" fontSize="7.5" letterSpacing="1.2" fill={BONE} fillOpacity="0.55">
          {layer.label}
        </text>
      ))}
    </svg>
  );
}

const VISUALS: Record<ServiceId, (props: VisualProps) => React.JSX.Element> = {
  web: WebVisual,
  maps: MapVisual,
  marketing: NodesVisual,
  meta: MetaVisual,
  performance: PerformanceVisual,
};

export function ServiceVisual({ id, active }: { id: ServiceId; active: boolean }) {
  const Visual = VISUALS[id];
  return <Visual active={active} />;
}
