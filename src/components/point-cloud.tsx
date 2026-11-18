"use client";
import { useEffect, useRef } from "react";
import { figure, figureColor, settled, type FigureId } from "@/lib/cloud";
import { useMotion } from "@/lib/motion";

const DIM = "150,160,140";
// Seconds for the highlight to cross the figure, and the rest before the next pass.
const SWEEP = 2.6;
const REST = 2.2;

// Decorative figure next to a case title. It turns slowly and a highlight runs
// along the case's flow; paused or reduced motion shows the settled figure.
export function PointCloud({ id, className = "" }: { id: FigureId; className?: string }) {
  const { allowed } = useMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const points = figure(id);
    const bright = figureColor[id];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;
    let started = 0;
    const draw = (now: number) => {
      if (!width) return;
      const t = allowed ? (now - started) / 1000 : 0;
      // The first pass settles the dots; later passes only carry the highlight.
      const cycle = t % (SWEEP + REST);
      const p = allowed ? (cycle / SWEEP) * 1.35 - 0.1 : 9;
      const first = allowed && t < SWEEP + REST;
      // Stays off the head-on view, where rings facing the flow would collapse into lines.
      const yaw = -0.78 + (allowed ? Math.sin(t * 0.32) * 0.3 : 0);
      const pitch = 0.3;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const scale = Math.min(width / 2.9, height / 2.1);
      ctx.clearRect(0, 0, width, height);
      for (const pt of points) {
        let { x, y, z } = pt;
        if (pt.from && first) {
          const k = settled(p, pt.u);
          x = pt.from[0] + (x - pt.from[0]) * k;
          y = pt.from[1] + (y - pt.from[1]) * k;
          z = pt.from[2] + (z - pt.from[2]) * k;
        }
        const xx = x * cy - z * sy;
        const zz = x * sy + z * cy;
        const yy = y * cp - zz * sp;
        const depth = y * sp + zz * cp;
        const k = 3.6 / (3.6 + depth);
        const near = (1.2 - depth) / 2.4;
        const d = p - pt.u;
        const glow = allowed ? Math.exp(-(d * d) / 0.012) : 0;
        const alpha = Math.min(1, (pt.tone ? 0.42 : 0.2) + near * (pt.tone ? 0.5 : 0.3) + glow * 0.7);
        ctx.fillStyle = `rgba(${pt.tone || glow > 0.3 ? bright : DIM},${alpha})`;
        ctx.beginPath();
        ctx.arc(width / 2 + xx * scale * k, height / 2 - yy * scale * k, (pt.tone ? 1.15 : 0.9) * k + glow * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
      if (allowed && visible) frame = requestAnimationFrame(draw);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };
    const resize = new ResizeObserver(([entry]) => {
      ({ width, height } = entry.contentRect);
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      restart();
    });
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) started = performance.now();
      visible = entry.isIntersecting;
      if (visible) restart();
    });
    resize.observe(canvas);
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
    };
  }, [id, allowed]);
  return <canvas ref={canvasRef} className={`point-cloud ${className}`} aria-hidden="true" />;
}
