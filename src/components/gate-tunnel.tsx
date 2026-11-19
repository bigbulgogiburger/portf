"use client";
import { useEffect, useRef } from "react";
import { COMMIT, gateFrame, gateNames, restFrame, storyTime, type GateFrame } from "@/lib/gates";
import { useInView, useMotion } from "@/lib/motion";

const LIME = "209,245,138";
const DIM = "140,166,116";
const AMBER = "255,190,120";
const R = 0.6;
// Nearly flat projection keeps every ring the same shape; the tube itself flares toward the viewer.
const FOCAL = 40;
const flare = (s: number) => 0.7 + 0.115 * Math.max(-1.5, Math.min(6.5, s));
// Distance between gates, and rings drawn per gate.
const SPACING = 1.5;
const PER_GATE = 8;
const FIRST = -1.5;
const LAST = 6.5;
// The tube's centre line; gates sit at whole numbers, 이슈 far left to 커밋 near right.
const axis = (s: number) => [(s - 2.5) * SPACING, 0.1 * Math.sin(s * 1.05 + 0.4), 0.16 * Math.cos(s * 0.75)] as const;
const bump = (d: number, width: number) => Math.exp(-(d * d) / (width * width));

// Hero figure: a dotted tube of six gates. The story in lib/gates repeats while
// the figure is in view; paused or reduced motion shows the rest frame.
export function GateTunnel() {
  const { allowed } = useMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLLIElement | null)[]>([]);
  const chipRef = useRef<HTMLSpanElement>(null);
  const blockRef = useRef<HTMLSpanElement>(null);
  const logRef = useRef<HTMLParagraphElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const inView = useInView(stageRef, 0.35);
  const animate = allowed && inView;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let width = 0;
    let height = 0;
    let scale = 1;
    let ox = 0;
    let oy = 0;
    let yawBase = -0.62;
    let raf = 0;
    const started = performance.now();
    let cy = 1, sy = 0, cp = 1, sp = 0;
    const aim = (yaw: number, pitch: number) => {
      cy = Math.cos(yaw);
      sy = Math.sin(yaw);
      cp = Math.cos(pitch);
      sp = Math.sin(pitch);
    };
    const project = (x: number, y: number, z: number) => {
      const xx = x * cy - z * sy;
      const zz = x * sy + z * cy;
      const k = FOCAL / (FOCAL + y * sp + zz * cp);
      return [ox + xx * scale * k, oy - (y * cp - zz * sp) * scale * k, k] as const;
    };
    // Fit the whole tube, with room under it for the gate names.
    const fit = () => {
      const narrow = width < 620;
      yawBase = narrow ? -1.15 : -0.62;
      aim(yawBase, 0.16);
      scale = 1;
      ox = 0;
      oy = 0;
      let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
      for (let s = -0.9; s <= COMMIT + 0.9; s += 0.3) {
        const [ax, ay, az] = axis(s);
        const r = R * 1.28 * flare(s);
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          const [px, py] = project(ax, ay + Math.cos(a) * r, az + Math.sin(a) * r);
          minX = Math.min(minX, px);
          maxX = Math.max(maxX, px);
          minY = Math.min(minY, py);
          maxY = Math.max(maxY, py);
        }
      }
      const room = narrow ? 44 : 58;
      scale = Math.min(width / (maxX - minX), (height - room) / (maxY - minY));
      ox = width / 2 - ((minX + maxX) / 2) * scale;
      oy = (height - room) / 2 - ((minY + maxY) / 2) * scale;
    };
    const tones: string[] = [];
    let lastLog = "";
    let previous = 0;
    let heading = 1;
    const render = (f: GateFrame, time: number) => {
      aim(yawBase + pointer.current.x * 0.09, 0.16 + pointer.current.y * 0.05);
      ctx.clearRect(0, 0, width, height);
      const sig = f.signal;
      const dotScale = Math.max(0.75, Math.min(1.25, scale / 150));
      for (let n = 0; n <= (LAST - FIRST) * PER_GATE; n++) {
        const s = FIRST + n / PER_GATE;
        const gate = Math.abs(s - Math.round(s)) < 0.01 && s > -0.5 && s < COMMIT + 0.5 ? Math.round(s) : -1;
        const [ax, ay, az] = axis(s);
        const near = sig === null ? 0 : bump(s - sig, 0.55);
        const closing = f.block * bump(s - COMMIT, 0.42);
        const size = flare(s);
        const radius = R * size * (1 + near * 0.24) * (1 - closing * 0.58);
        const fade = Math.min(1, Math.max(0, 1 - (Math.abs(s - 2.5) - 2.9) / 1.1));
        const lit = gate >= 0 && f.lit[gate];
        const blocked = gate === COMMIT ? f.block : 0;
        const changed = gate === 2 ? f.change : 0;
        const count = gate >= 0 ? 88 : 36;
        const turn = s * 0.55 + time * 0.16;
        let color = gate >= 0 ? (lit ? LIME : DIM) : near > 0.25 ? LIME : DIM;
        if (blocked > 0.5 || changed > 0.4) color = AMBER;
        const base = gate >= 0 ? (lit ? 0.62 : 0.34) + blocked * 0.3 + changed * 0.3 : 0.32 + near * 0.36;
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2 + turn;
          const [px, py] = project(ax, ay + Math.cos(a) * radius, az + Math.sin(a) * radius);
          // Dots on the viewer's side of each ring are brighter.
          const front = 0.72 + 0.28 * Math.sin(a) * (sy < 0 ? -1 : 1);
          ctx.fillStyle = `rgba(${color},${Math.min(1, base * front * fade * (0.5 + size * 0.5))})`;
          ctx.beginPath();
          ctx.arc(px, py, (gate >= 0 ? 1.3 : 0.9) * size * dotScale, 0, Math.PI * 2);
          ctx.fill();
        }
        // The closed commit gate fills in like an iris.
        if (blocked > 0.02)
          for (const inner of [0.62, 0.3]) {
            const m = Math.round(count * inner);
            for (let i = 0; i < m; i++) {
              const a = (i / m) * Math.PI * 2 - turn;
              const [px, py] = project(ax, ay + Math.cos(a) * radius * inner, az + Math.sin(a) * radius * inner);
              ctx.fillStyle = `rgba(${AMBER},${blocked * 0.8})`;
              ctx.beginPath();
              ctx.arc(px, py, 1.1 * size * dotScale, 0, Math.PI * 2);
              ctx.fill();
            }
          }
      }
      if (sig === null) previous = -9;
      if (sig !== null) {
        if (Math.abs(sig - previous) > 1e-4) heading = sig > previous ? 1 : -1;
        previous = sig;
        const [ax, ay, az] = axis(sig);
        const [px, py] = project(ax, ay, az);
        const k = flare(sig);
        const hot = f.tone === "alert" ? AMBER : LIME;
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 34 * k * dotScale);
        glow.addColorStop(0, `rgba(${hot},0.42)`);
        glow.addColorStop(1, `rgba(${hot},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, 34 * k * dotScale, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 12; i >= 0; i--) {
          const [tx, ty] = project(...axis(sig - i * 0.07 * heading));
          const tk = k;
          ctx.fillStyle = `rgba(${i === 0 ? "244,255,214" : hot},${i === 0 ? 1 : 0.5 * (1 - i / 13)})`;
          ctx.beginPath();
          ctx.arc(tx, ty, (i === 0 ? 3.4 : 2.2 * (1 - i / 16)) * tk * dotScale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // Gate names follow their rings; class changes only when the state does.
      gateNames.forEach((_, i) => {
        const label = labelRefs.current[i];
        if (!label) return;
        const [ax, ay, az] = axis(i);
        const k = flare(i);
        const [px, py] = project(ax, ay - R * k, az);
        label.style.transform = `translate(${px.toFixed(1)}px, ${(py + 12 * k).toFixed(1)}px) translateX(-50%) scale(${(0.82 + k * 0.16).toFixed(3)})`;
        const tone = i === COMMIT && f.block > 0.5 ? "is-blocked" : i === 2 && f.change > 0.4 ? "is-changed" : f.lit[i] ? "is-lit" : "";
        if (tones[i] !== tone) {
          tones[i] = tone;
          label.className = tone;
        }
      });
      const chip = chipRef.current;
      if (chip) {
        const [ax, ay, az] = axis(2);
        const [px, py] = project(ax, ay + R * flare(2), az);
        chip.style.transform = `translate(${px.toFixed(1)}px, ${(py - 34).toFixed(1)}px) translateX(-50%)`;
        chip.style.opacity = f.change.toFixed(2);
      }
      const stop = blockRef.current;
      if (stop) {
        const [ax, ay, az] = axis(COMMIT);
        const [px, py] = project(ax, ay + R * flare(COMMIT), az);
        stop.style.transform = `translate(${px.toFixed(1)}px, ${(py - 34).toFixed(1)}px) translateX(-50%)`;
        stop.style.opacity = f.block.toFixed(2);
      }
      const log = logRef.current;
      if (log && lastLog !== f.log) {
        lastLog = f.log;
        log.textContent = f.log;
        log.dataset.tone = f.tone;
      }
    };
    const tick = (now: number) => {
      render(animate ? gateFrame(storyTime(now - started)) : restFrame, animate ? now / 1000 : 0);
      if (animate) raf = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(([entry]) => {
      ({ width, height } = entry.contentRect);
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fit();
      cancelAnimationFrame(raf);
      tick(performance.now());
    });
    resize.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
    };
  }, [animate]);

  return (
    <div
      ref={stageRef}
      className="gate-stage"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !allowed) return;
        const box = e.currentTarget.getBoundingClientRect();
        pointer.current = { x: (e.clientX - box.left) / box.width - 0.5, y: (e.clientY - box.top) / box.height - 0.5 };
      }}
      onPointerLeave={() => {
        pointer.current = { x: 0, y: 0 };
      }}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      <ol className="gate-labels" aria-label="개발·검증 절차">
        {gateNames.map((name, i) => (
          <li
            key={name}
            ref={(node) => {
              labelRefs.current[i] = node;
            }}
            className="is-lit"
          >
            <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            {name}
          </li>
        ))}
      </ol>
      <span ref={chipRef} className="gate-chip" aria-hidden="true">
        코드 변경
      </span>
      <span ref={blockRef} className="gate-chip is-block" aria-hidden="true">
        커밋 차단
      </span>
      <p ref={logRef} className="gate-log" data-tone={restFrame.tone} aria-hidden="true">
        {restFrame.log}
      </p>
      <p className="sr-only">검증 이후 코드가 바뀌면 커밋을 막고, 리뷰와 테스트를 다시 거친 뒤 커밋합니다.</p>
    </div>
  );
}
