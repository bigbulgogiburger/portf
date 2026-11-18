"use client";
import { useEffect, useRef } from "react";
import { figureColor, resample, scenePose, type CloudPoint, type FigureId } from "@/lib/cloud";
import { useMotion } from "@/lib/motion";

const COUNT = 1100;
const DIM = [150, 160, 140];
const WIDE = "(min-width: 1000px)";
// Seconds for the highlight to cross a figure, and the rest before the next pass.
const SWEEP = 2.8;
const REST = 2;
const ease = (t: number) => t * t * (3 - 2 * t);
const clamp = (t: number) => Math.min(1, Math.max(0, t));

// One set of dots behind the case scenes on wide screens. As the page scrolls
// from one case to the next the dots leave the first figure and gather into the
// second. Paused or reduced motion snaps to the figure of the case in view.
export function SceneStage({ ids }: { ids: FigureId[] }) {
  const { allowed } = useMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const scenes = ids.map((id) => document.querySelector<HTMLElement>(`[data-scene="${id}"]`));
    if (!canvas || !ctx || scenes.some((s) => !s)) return;
    const figures: CloudPoint[][] = ids.map((id) => resample(id, COUNT));
    const colors = ids.map((id) => figureColor[id].split(",").map(Number));
    // Per-dot delay and drift, fixed so the same dot always takes the same path.
    const lag = new Float32Array(COUNT);
    const drift = new Float32Array(COUNT * 3);
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < COUNT; i++) {
      lag[i] = rand();
      for (let k = 0; k < 3; k++) drift[i * 3 + k] = rand() - 0.5;
    }
    const media = matchMedia(WIDE);
    let width = 0;
    let height = 0;
    let raf = 0;
    let near = false;
    const draw = (now: number) => {
      raf = 0;
      if (!width || !media.matches) return;
      const t = allowed ? now / 1000 : 0;
      const middle = height * 0.5;
      // Which scene crosses the middle of the screen, and how far through it we are.
      let index = 0;
      let through = 0;
      for (let i = 0; i < scenes.length; i++) {
        const box = scenes[i]!.getBoundingClientRect();
        const p = (middle - box.top) / box.height;
        if (i === 0 || p >= 0) {
          index = i;
          through = p;
        }
      }
      const last = index === scenes.length - 1;
      let morph = last ? 0 : ease(clamp((through - 0.7) / 0.3));
      if (!allowed) morph = morph < 0.5 ? 0 : 1;
      const fade = clamp((through + 0.42) / 0.3) * (last ? 1 - clamp((through - 0.86) / 0.2) : 1);
      ctx.clearRect(0, 0, width, height);
      if (fade > 0) {
        const from = figures[index];
        const to = figures[Math.min(index + 1, figures.length - 1)];
        const a = colors[index];
        const b = colors[Math.min(index + 1, colors.length - 1)];
        const tint = a.map((v, k) => Math.round(v + (b[k] - v) * morph));
        const cx = width * 0.72;
        const pose = scenePose(index + through);
        const cy = height * 0.52 - pose.lift;
        const scale = Math.min(width * 0.185, height * 0.3);
        const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 2.3);
        halo.addColorStop(0, `rgba(${tint},${0.085 * fade})`);
        halo.addColorStop(1, `rgba(${tint},0)`);
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, width, height);
        // Stays off the head-on view, where rings facing the flow collapse into lines.
        const yaw = pose.yaw + Math.sin(t * 0.3) * 0.12;
        const pitch = 0.3;
        const cyaw = Math.cos(yaw), syaw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
        const front = allowed ? ((t % (SWEEP + REST)) / SWEEP) * 1.35 - 0.1 : 9;
        for (let i = 0; i < COUNT; i++) {
          const p = from[i];
          const q = to[i];
          const k = ease(clamp(morph * 1.7 - lag[i] * 0.7));
          // Dots swing out of the old figure before they land in the new one.
          const swing = Math.sin(k * Math.PI) * 0.55;
          const x = p.x + (q.x - p.x) * k + drift[i * 3] * swing;
          const y = p.y + (q.y - p.y) * k + drift[i * 3 + 1] * swing;
          const z = p.z + (q.z - p.z) * k + drift[i * 3 + 2] * swing;
          const tone = k < 0.5 ? p.tone : q.tone;
          const u = p.u + (q.u - p.u) * k;
          const xx = x * cyaw - z * syaw;
          const zz = x * syaw + z * cyaw;
          const depth = y * sp + zz * cp;
          const persp = 3.6 / (3.6 + depth);
          const d = front - u;
          const glow = allowed && morph < 0.05 ? Math.exp(-(d * d) / 0.012) : 0;
          const lit = tone || glow > 0.3;
          const alpha = Math.min(1, (tone ? 0.5 : 0.24) + ((1.2 - depth) / 2.4) * (tone ? 0.5 : 0.3) + glow * 0.6) * fade;
          ctx.fillStyle = `rgba(${lit ? tint : DIM},${alpha})`;
          ctx.beginPath();
          ctx.arc(cx + xx * scale * persp, cy - (y * cp - zz * sp) * scale * persp, (tone ? 1.7 : 1.25) * persp + glow, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (allowed && near) raf = requestAnimationFrame(draw);
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const resize = () => {
      width = innerWidth;
      height = innerHeight;
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      request();
    };
    // Runs only while the case scenes are on or next to the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.toggleAttribute("data-near", entry.isIntersecting);
        near = scenes.some((s) => s!.hasAttribute("data-near"));
        request();
      },
      { rootMargin: "60% 0px" },
    );
    scenes.forEach((s) => observer.observe(s!));
    resize();
    addEventListener("resize", resize);
    addEventListener("scroll", request, { passive: true });
    media.addEventListener("change", request);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      removeEventListener("resize", resize);
      removeEventListener("scroll", request);
      media.removeEventListener("change", request);
    };
  }, [ids, allowed]);
  return <canvas ref={canvasRef} className="scene-stage" aria-hidden="true" />;
}
