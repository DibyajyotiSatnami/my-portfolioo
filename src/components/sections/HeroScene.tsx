"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/* ------------------------------------------------------------------ */
/*  Shaders: a liquid-chrome core displaced by simplex noise           */
/* ------------------------------------------------------------------ */

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uRadius;
varying vec3 vNormalV;
varying vec3 vViewPos;
varying float vField;
${NOISE}

float field(vec3 dir){
  float n = snoise(dir * 0.95 + vec3(0.0, uTime * 0.22, uTime * 0.13));
#ifdef DETAIL_NOISE
  n = n * 0.8 + snoise(dir * 2.3 + vec3(uTime * 0.18)) * 0.2;
#endif
  return n * uAmp;
}

vec3 displaced(vec3 p){
  vec3 dir = normalize(p);
  return dir * (uRadius + field(dir));
}

void main(){
  vec3 dir = normalize(position);
  // Rebuild the normal from two neighbouring samples so the lighting
  // follows the deformation instead of the original sphere.
  vec3 tangent = normalize(abs(dir.x) > abs(dir.z) ? vec3(-dir.y, dir.x, 0.0) : vec3(0.0, -dir.z, dir.y));
  vec3 bitangent = normalize(cross(dir, tangent));
  float e = 0.012;
  vec3 p0 = displaced(dir);
  vec3 p1 = displaced(dir + tangent * e);
  vec3 p2 = displaced(dir + bitangent * e);
  vec3 n = normalize(cross(p1 - p0, p2 - p0));

  vField = field(dir) / max(uAmp, 0.0001);
  vec4 mv = modelViewMatrix * vec4(p0, 1.0);
  vViewPos = mv.xyz;
  vNormalV = normalize(normalMatrix * n);
  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uOpacity;
uniform vec3 uLightA;
uniform vec3 uLightB;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uColC;
varying vec3 vNormalV;
varying vec3 vViewPos;
varying float vField;

void main(){
  vec3 n = normalize(vNormalV);
  vec3 v = normalize(-vViewPos);
  float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.4);

  // Iridescent rim that drifts between the three brand colours.
  float t = fres * 0.9 + vField * 0.35 + uTime * 0.035;
  vec3 irid = mix(uColA, uColB, 0.5 + 0.5 * sin(t * 6.2831));
  irid = mix(irid, uColC, (0.5 + 0.5 * sin(t * 3.1415 + 1.7)) * 0.55);

  vec3 la = normalize(uLightA - vViewPos);
  vec3 lb = normalize(uLightB - vViewPos);
  float da = max(dot(n, la), 0.0);
  float db = max(dot(n, lb), 0.0);
  float sa = pow(max(dot(n, normalize(la + v)), 0.0), 70.0);
  float sb = pow(max(dot(n, normalize(lb + v)), 0.0), 40.0);

  vec3 col = vec3(0.022, 0.02, 0.036);
  col += uColA * da * 0.3 + uColB * db * 0.34;
  col += irid * fres * 1.35;
  col += vec3(1.0, 0.95, 0.9) * sa * 0.85 + uColB * sb * 0.5;

  gl_FragColor = vec4(col, uOpacity);
}
`;

const NEON = new THREE.Color("#7dff2e");
const VIOLET = new THREE.Color("#6d4bff");
const LIME = new THREE.Color("#e2ff4d");
const BONE = new THREE.Color("#ece8e1");

function glowSprite() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.5)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/**
 * WebGL hero: a morphing chrome core inside a rotating wireframe cage,
 * orbit rings, lit floating solids and drifting particles. Everything
 * leans toward the pointer; a click sends a ripple through the core.
 */
export default function HeroScene({ ready }: { ready: boolean }) {
  const mount = useRef<HTMLDivElement>(null);
  const intro = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = mount.current;
    if (!container) return;

    const reduced = prefersReducedMotion();
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const lowPower =
      coarse ||
      (navigator.hardwareConcurrency ?? 8) <= 4 ||
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !lowPower,
        powerPreference: "high-performance",
      });
    } catch {
      return; // No WebGL: the CSS glow behind the canvas remains as the visual.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.25 : 1.75));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camera.position.set(0, 0, 9);

    const stage = new THREE.Group(); // positioned per viewport
    const rig = new THREE.Group(); // follows the pointer
    stage.add(rig);
    scene.add(stage);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T) => {
      disposables.push(item);
      return item;
    };

    /* ----- Core ----- */
    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.9 },
      uRadius: { value: 1.25 },
      uOpacity: { value: 1 },
      uLightA: { value: new THREE.Vector3(4, 3, 4) },
      uLightB: { value: new THREE.Vector3(-5, -2, 2) },
      uColA: { value: NEON },
      uColB: { value: VIOLET },
      uColC: { value: LIME },
    };
    const coreGeometry = track(new THREE.IcosahedronGeometry(1, lowPower ? 18 : 40));
    const coreMaterial = track(
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        defines: lowPower ? {} : { DETAIL_NOISE: "" },
      }),
    );
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    rig.add(core);

    /* ----- Wireframe cage + vertex nodes ----- */
    const cageSource = track(new THREE.IcosahedronGeometry(2.15, 1));
    const cageGeometry = track(new THREE.WireframeGeometry(cageSource));
    const cageMaterial = track(
      new THREE.LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.16 }),
    );
    const cage = new THREE.LineSegments(cageGeometry, cageMaterial);
    rig.add(cage);

    const sprite = track(glowSprite());
    const nodeGeometry = track(new THREE.BufferGeometry());
    nodeGeometry.setAttribute("position", cageSource.getAttribute("position").clone());
    const nodeMaterial = track(
      new THREE.PointsMaterial({
        color: LIME,
        size: 0.09,
        map: sprite,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    const nodes = new THREE.Points(nodeGeometry, nodeMaterial);
    cage.add(nodes);

    /* ----- Orbit rings ----- */
    const ringMaterial = track(
      new THREE.LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.22 }),
    );
    const rings: THREE.LineLoop[] = [2.75, 3.15].map((radius, i) => {
      const points = new THREE.EllipseCurve(0, 0, radius, radius).getPoints(128);
      const geometry = track(new THREE.BufferGeometry().setFromPoints(points));
      const ring = new THREE.LineLoop(geometry, ringMaterial);
      ring.rotation.set(Math.PI / 2 + (i ? 0.5 : -0.35), i ? 0.4 : -0.2, 0);
      rig.add(ring);
      return ring;
    });

    /* ----- Lit floating solids ----- */
    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const warm = new THREE.PointLight(NEON, 260, 0, 2);
    warm.position.set(4, 3, 4);
    const cool = new THREE.PointLight(VIOLET, 300, 0, 2);
    cool.position.set(-5, -2, 3);
    scene.add(warm, cool);

    const solidMaterial = track(
      new THREE.MeshStandardMaterial({ color: 0x2b2b38, roughness: 0.3, metalness: 0.2, flatShading: true }),
    );
    const wireMaterial = track(
      new THREE.LineBasicMaterial({ color: BONE, transparent: true, opacity: 0.5 }),
    );
    const floaterSpecs: { geometry: THREE.BufferGeometry; pos: [number, number, number]; wire?: boolean; scale: number }[] = [
      { geometry: new THREE.OctahedronGeometry(1), pos: [-3.3, 1.7, -1.2], scale: 0.42 },
      { geometry: new THREE.TorusGeometry(1, 0.34, 14, 40), pos: [3.2, -1.9, 0.6], scale: 0.3 },
      { geometry: new THREE.TetrahedronGeometry(1), pos: [2.9, 2.1, -2.2], scale: 0.36, wire: true },
      { geometry: new THREE.IcosahedronGeometry(1, 0), pos: [-2.7, -2.2, 1], scale: 0.28, wire: true },
      { geometry: new THREE.BoxGeometry(1, 1, 1), pos: [0.6, 3.0, -3], scale: 0.3 },
    ];
    const floaters = floaterSpecs.slice(0, lowPower ? 3 : 5).map((spec, i) => {
      track(spec.geometry);
      let object: THREE.Object3D;
      if (spec.wire) {
        const edges = track(new THREE.EdgesGeometry(spec.geometry));
        object = new THREE.LineSegments(edges, wireMaterial);
      } else {
        object = new THREE.Mesh(spec.geometry, solidMaterial);
      }
      object.position.set(...spec.pos);
      object.scale.setScalar(spec.scale);
      object.userData = { base: spec.pos, phase: i * 1.7, speed: 0.4 + i * 0.07 };
      rig.add(object);
      return object;
    });

    /* ----- Particles ----- */
    const particleCount = lowPower ? 260 : 700;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 3 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = radius * Math.cos(phi) - 2;
    }
    const particleGeometry = track(new THREE.BufferGeometry());
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMaterial = track(
      new THREE.PointsMaterial({
        color: BONE,
        size: 0.05,
        map: sprite,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    /* ----- Layout ----- */
    const layout = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const viewH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const viewW = viewH * camera.aspect;
      if (camera.aspect >= 1.15) {
        stage.position.set(viewW * 0.23, viewH * 0.02, 0);
        stage.scale.setScalar(Math.min(1, viewW / 9.5));
      } else {
        stage.position.set(viewW * 0.2, viewH * 0.27, 0);
        stage.scale.setScalar(Math.max(0.45, Math.min(0.75, viewW / 5.2)));
      }
    };
    layout();
    const resizeObserver = new ResizeObserver(() => {
      layout();
      if (reduced) renderer.render(scene, camera);
    });
    resizeObserver.observe(container);

    /* ----- Interaction ----- */
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const motion = { energy: 0, scroll: 0, intro: reduced ? 1 : 0 };
    let last = { x: 0, y: 0 };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
      const speed = Math.hypot(e.clientX - last.x, e.clientY - last.y);
      last = { x: e.clientX, y: e.clientY };
      motion.energy = Math.min(1, motion.energy + speed * 0.0025);
    };
    const onPointerDown = () => {
      gsap.fromTo(motion, { energy: 1.6 }, { energy: 0, duration: 1.6, ease: "elastic.out(1, 0.4)", overwrite: true });
    };
    const hero = container.closest("section");
    if (!reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      hero?.addEventListener("pointerdown", onPointerDown, { passive: true });
    }

    const scrollTrigger = reduced
      ? null
      : ScrollTrigger.create({
          trigger: hero,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => (motion.scroll = self.progress),
        });

    /* ----- Render loop (paused when the hero is off screen) ----- */
    let visible = true;
    const intersection = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    intersection.observe(container);

    const startedAt = performance.now();
    const render = () => {
      if (!visible || document.hidden) return;
      const time = (performance.now() - startedAt) / 1000;
      const k = motion.intro;

      eased.x += (pointer.x - eased.x) * 0.045;
      eased.y += (pointer.y - eased.y) * 0.045;
      motion.energy *= 0.965;

      uniforms.uTime.value = time;
      uniforms.uAmp.value = 0.24 + motion.energy * 0.22 + (1 - k) * 0.9;
      uniforms.uLightA.value.set(4 + eased.x * 5, 3 - eased.y * 4, 4).applyMatrix4(camera.matrixWorldInverse);
      warm.position.set(4 + eased.x * 5, 3 - eased.y * 4, 4);

      rig.rotation.y = eased.x * 0.5 + time * 0.05;
      rig.rotation.x = eased.y * 0.32;
      rig.position.y = motion.scroll * 2.2;
      rig.scale.setScalar((0.35 + k * 0.65) * (1 - motion.scroll * 0.25));

      core.rotation.y = time * 0.12;
      cage.rotation.set(time * 0.06, -time * 0.09 + (1 - k) * 2.5, 0);
      rings[0].rotation.z = time * 0.16;
      rings[1].rotation.z = -time * 0.11;

      floaters.forEach((object) => {
        const { base, phase, speed } = object.userData as { base: number[]; phase: number; speed: number };
        object.position.y = base[1] + Math.sin(time * speed + phase) * 0.28;
        object.position.x = base[0] + Math.cos(time * speed * 0.7 + phase) * 0.16;
        object.rotation.x = time * speed * 0.6 + phase;
        object.rotation.y = time * speed * 0.45;
      });

      particles.rotation.y = time * 0.018 + eased.x * 0.08;
      particles.rotation.x = eased.y * 0.05;
      camera.position.x = eased.x * 0.35;
      camera.position.y = -eased.y * 0.25;
      camera.lookAt(0, 0, 0);

      container.style.opacity = String(k * (1 - motion.scroll * 0.85));
      renderer.render(scene, camera);
    };

    if (reduced) {
      render();
    } else {
      gsap.ticker.add(render);
    }

    intro.current = () => {
      if (reduced) return;
      gsap.to(motion, { intro: 1, duration: 2.4, ease: "expo.out" });
    };
    if (container.dataset.ready === "true") intro.current();

    return () => {
      intro.current = null;
      gsap.ticker.remove(render);
      gsap.killTweensOf(motion);
      scrollTrigger?.kill();
      intersection.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      hero?.removeEventListener("pointerdown", onPointerDown);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    if (ready) intro.current?.();
  }, [ready]);

  return <div ref={mount} className="hero-canvas" data-ready={ready} aria-hidden="true" />;
}
