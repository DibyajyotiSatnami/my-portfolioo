# Dibyajyoti — Portfolio

A cinematic, motion-led portfolio: WebGL hero, pinned scroll storytelling, a
horizontal project gallery and five animated service illustrations.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + hand-written CSS in `src/app/globals.css` |
| Scroll & timeline animation | GSAP + ScrollTrigger |
| Smooth scrolling | Lenis (driven by the GSAP ticker) |
| 3D | Three.js (lazy-loaded, hero only) |

Framer Motion, React Three Fiber and Lottie were deliberately left out: GSAP
already covers every transition, the single WebGL scene is small enough to
write against Three.js directly, and the illustrations are inline SVG.

## Run it

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

## Editing content

Everything written on the site lives in **`src/content/site.ts`**:

- `site.whatsappNumber` — your number in international format, digits only
  (for example `919876543210`). **It is empty by default**, so set it before
  launch.
- `site.url` — the deployed address, used for canonical and Open Graph tags.
- `projects` — **sample entries**. Replace each `title` and `url` with a real
  project. Add `image: "/work/name.jpg"` (a file in `public/work/`) to show a
  real screenshot; a tall full-page capture pans while the card is hovered.
  Without an image, a preview is generated from the project's `palette`.
- `services`, `roles`, `nav`, `site.socials` — copy and links.

## Structure

```
src/
  app/                layout (fonts, metadata), page, global styles
  content/site.ts     all copy, projects, services, contact details
  lib/gsap.ts         GSAP plugin registration + shared media queries
  components/
    AppShell.tsx      smooth scroll, theme transitions, page-transition curtain
    Preloader.tsx     initials loading screen
    Cursor.tsx        custom cursor and its states
    Nav.tsx           header + full-screen menu
    Magnetic.tsx      magnetic hover wrapper
    Split.tsx         accessible character / word splitting
    sections/         Hero (+ HeroScene WebGL), Marquee, Manifesto, Work,
                      Services, Contact
    services/         the five animated service illustrations
```

## Motion, performance and accessibility

- `prefers-reduced-motion` switches off pinning, smooth scrolling, parallax and
  looping effects; the gallery becomes a grid and the WebGL scene renders one
  still frame.
- Phones and tablets get a vertical project list, no tilt or custom cursor, and
  a lighter WebGL scene (lower geometry detail, fewer particles, capped pixel
  ratio). The scene stops rendering whenever the hero is off screen.
- Three.js is code-split and loaded after first paint; fonts are self-hosted
  through `next/font`.
- Animated headlines keep their full text available to screen readers and
  search engines; the animated letters are hidden from the accessibility tree.
