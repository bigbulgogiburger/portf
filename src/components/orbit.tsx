"use client";
import { useEffect, useRef } from "react";

export function Orbit() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 600,
      height = 600,
      frame = 0,
      running = true,
      visible = true;
    let phase = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const r = Math.min(width, height) * 0.28;
      const cx = width * 0.5,
        cy = height * 0.5;
      const points: { x: number; y: number; z: number; ring: number }[] = [];
      for (let ring = 0; ring < 34; ring++) {
        const a = (ring / 34) * Math.PI * 2;
        for (let dot = 0; dot < 72; dot++) {
          const b = (dot / 72) * Math.PI * 2;
          const radial = r + Math.cos(b) * r * 0.39;
          const x = radial * Math.cos(a),
            y = radial * Math.sin(a),
            z = Math.sin(b) * r * 0.39;
          const yaw = phase * 0.16 + 0.38;
          const xx = x * Math.cos(yaw) - z * Math.sin(yaw);
          const zz = x * Math.sin(yaw) + z * Math.cos(yaw);
          const tilt = 0.88;
          const yy = y * Math.cos(tilt) - zz * Math.sin(tilt);
          const depth = y * Math.sin(tilt) + zz * Math.cos(tilt);
          const turn = -0.36;
          points.push({
            x: cx + xx * Math.cos(turn) - yy * Math.sin(turn),
            y: cy + xx * Math.sin(turn) + yy * Math.cos(turn),
            z: depth,
            ring,
          });
        }
      }
      points.sort((a, b) => a.z - b.z);
      for (const p of points) {
        const bright = (p.z / r + 1.5) / 3;
        ctx.fillStyle =
          p.ring % 7 === 0
            ? `rgba(220,255,129,${0.22 + bright * 0.65})`
            : `rgba(137,164,109,${0.06 + bright * 0.46})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.65 + bright * 1.15, 0, Math.PI * 2);
        ctx.fill();
      }
      if (running && visible && !media.matches) {
        phase += 0.014;
        frame = requestAnimationFrame(draw);
      }
    };
    const resize = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cancelAnimationFrame(frame);
      draw();
    });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) draw();
    });
    const change = () => {
      cancelAnimationFrame(frame);
      draw();
    };
    resize.observe(canvas);
    observer.observe(canvas);
    media.addEventListener("change", change);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      media.removeEventListener("change", change);
    };
  }, []);
  return (
    <div className="orbit-scene" aria-hidden="true">
      <div className="orbit-grid" />
      <div className="orbit-halo" />
      <canvas ref={canvasRef} />
      <span className="orbit-label label-top">
        <i /> SYSTEM THINKING
      </span>
      <span className="orbit-label label-bottom">
        HUMAN INTENT → WORKING SYSTEM
      </span>
      <span className="orbit-coordinate">[ 37.56° N / 126.97° E ]</span>
      <div className="orbit-chip chip-one">
        <span>01</span> BACKEND
      </div>
      <div className="orbit-chip chip-two">
        <span>02</span> APPLIED AI
      </div>
      <div className="orbit-chip chip-three">
        <span>03</span> OPERATIONS
      </div>
    </div>
  );
}
