"use client";
import { useEffect, useRef } from "react";
import { useMotion } from "@/lib/motion";

const COLS = 38;
const ROWS = 20;

// Decorative sheet of dots behind the contact block; a slow swell runs across it.
// Paused or reduced motion shows one still frame.
export function DotField() {
  const { allowed } = useMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;
    const pitch = 1.08;
    const yaw = -0.42;
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const draw = (now: number) => {
      if (!width) return;
      const t = allowed ? now / 1000 : 2;
      const scale = width / 2.5;
      ctx.clearRect(0, 0, width, height);
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++) {
          const x = (c / (COLS - 1) - 0.5) * 2.6;
          const z = (r / (ROWS - 1) - 0.5) * 1.6;
          const lift = 0.13 * Math.sin(x * 2.3 + t * 0.7) + 0.09 * Math.cos(z * 3.1 - t * 0.5 + x);
          const xx = x * cy - z * sy;
          const zz = x * sy + z * cy;
          const depth = lift * sp + zz * cp;
          const k = 4 / (4 + depth);
          const crest = Math.max(0, lift / 0.22);
          const edge = Math.min(1, (1.3 - Math.abs(x)) * 2.2) * Math.min(1, (0.8 - Math.abs(z)) * 4);
          ctx.fillStyle = crest > 0.4 ? `rgba(209,245,138,${(0.4 + crest * 0.6) * edge})` : `rgba(150,176,122,${(0.34 + crest * 0.4) * edge})`;
          ctx.beginPath();
          ctx.arc(width * 0.52 + xx * scale * k, height * 0.5 - (lift * cp - zz * sp) * scale * k, (1.05 + crest * 1.1) * k, 0, Math.PI * 2);
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
  }, [allowed]);
  return <canvas ref={canvasRef} className="dot-field" aria-hidden="true" />;
}
