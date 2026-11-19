"use client";
import { useEffect, useRef } from "react";
import { COMMIT, LANDING, gateFrame, gateNames, restFrame, storyTime, type GateFrame } from "@/lib/gates";
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
const clamp = (t: number) => Math.min(1, Math.max(0, t));
const TAU = Math.PI * 2;

// What each gate does, drawn inside its ring. Strokes are [across, up] in ring radii.
type Stroke = [number, number][];
const arc = (cq: number, cp: number, rq: number, rp: number, from: number, to: number, n: number): Stroke =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = from + ((to - from) * i) / n;
    return [cq + Math.cos(a) * rq, cp + Math.sin(a) * rp];
  });
const strokes: Stroke[][] = [
  // 이슈: a ticket with two lines.
  [[[-0.36, 0.25], [0.36, 0.25], [0.36, -0.25], [-0.36, -0.25], [-0.36, 0.25]], [[-0.2, 0.07], [0.2, 0.07]], [[-0.2, -0.09], [0.04, -0.09]]],
  // 계획: one goal split into three steps.
  [[[0, 0.34], [0, 0.1]], [[-0.36, 0.1], [0.36, 0.1]], ...[-0.36, 0, 0.36].flatMap((q): Stroke[] => [[[q, 0.1], [q, -0.14]], arc(q, -0.22, 0.075, 0.075, 0, TAU, 8)])],
  // 구현: </>
  [[[-0.18, 0.24], [-0.42, 0], [-0.18, -0.24]], [[-0.07, -0.3], [0.07, 0.3]], [[0.18, 0.24], [0.42, 0], [0.18, -0.24]]],
  // 테스트: three checks.
  [0.24, 0, -0.24].flatMap((p): Stroke[] => [[[-0.36, p], [-0.27, p - 0.09], [-0.12, p + 0.1]], [[0.02, p], [0.36, p]]]),
  // 리뷰: an eye.
  [arc(0, 0, 0.44, 0.26, Math.PI, 0, 14), arc(0, 0, 0.44, 0.26, Math.PI, TAU, 14), arc(0, 0, 0.1, 0.1, 0, TAU, 10)],
  // 커밋: a commit on its line.
  [[[-0.46, 0], [-0.17, 0]], arc(0, 0, 0.17, 0.17, Math.PI, -Math.PI, 14), [[0.17, 0], [0.46, 0]]],
];
// Each emblem as evenly spaced dots, in drawing order.
const emblems = strokes.map((gate) =>
  gate.flatMap((stroke) =>
    stroke.slice(1).flatMap(([q, p], i) => {
      const [q0, p0] = stroke[i];
      const n = Math.max(1, Math.round(Math.hypot(q - q0, p - p0) / 0.06));
      return Array.from({ length: n + (i === stroke.length - 2 ? 1 : 0) }, (_, k) => [q0 + ((q - q0) * k) / n, p0 + ((p - p0) * k) / n] as const);
    }),
  ),
);

// The work in flight is a small tree of files, 3 × 3. BASE is what was verified;
// EDIT is the cell a later code change adds.
const BASE = [0, 1, 3, 4, 5, 7, 8];
const EDIT = 2;
const treeState = (f: GateFrame) => (f.block > 0.5 ? "stale" : f.edited ? "renewed" : "stored");

// Dust carried along the tube: [offset along the tube, angle, distance from the axis, speed].
const dust = Array.from({ length: 72 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 127.1 + n * 311.7) * 43758.5453) % 1 + 1) % 1;
  return [r(1), r(2) * TAU, 0.2 + r(3) * 0.62, 0.22 + r(4) * 0.3] as const;
});

// Hero figure: a dotted tube of six gates, each marked with what it does. The work
// grows from one dot into a tree of files, its verification record is kept above
// the review gate and compared at the commit gate, and committed work lands on the
// line of commits. The story in lib/gates repeats while the figure is in view;
// paused or reduced motion shows the rest frame.
export function GateTunnel() {
  const { allowed } = useMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLLIElement | null)[]>([]);
  const chipRef = useRef<HTMLSpanElement>(null);
  const blockRef = useRef<HTMLSpanElement>(null);
  const recordRef = useRef<HTMLSpanElement>(null);
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
    let lastTree = "";
    let previous = -9;
    let heading = 1;
    // How far the work has come in this pass, and how much of each emblem is drawn.
    let reach = 9;
    let lastTime = 0;
    const drawn = new Float32Array(gateNames.length);
    const dot = (px: number, py: number, r: number, color: string, alpha: number) => {
      ctx.fillStyle = `rgba(${color},${Math.min(1, alpha)})`;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, TAU);
      ctx.fill();
    };
    const render = (f: GateFrame, time: number) => {
      aim(yawBase + pointer.current.x * 0.09 + Math.sin(time * 0.21) * 0.02, 0.16 + pointer.current.y * 0.05);
      ctx.clearRect(0, 0, width, height);
      const sig = f.signal;
      const dotScale = Math.max(0.75, Math.min(1.25, scale / 150));
      const still = time === 0;
      const dt = Math.min(0.1, Math.max(0, time - lastTime));
      lastTime = time;
      if (sig === null) reach = 9;
      else reach = previous === -9 ? sig : Math.max(reach, sig);
      if (sig !== null && previous !== -9 && Math.abs(sig - previous) > 1e-4) heading = sig > previous ? 1 : -1;
      // In-plane shapes are widened where the rings are seen from the side.
      const widen = Math.min(1.5, Math.max(1, 0.78 / Math.abs(sy)));
      const landed = sig === null ? 1 : clamp((sig - COMMIT - 0.12) / 0.4);
      // The line of commits the work lands on, just outside the last gate.
      {
        const [ax, ay, az] = axis(LANDING);
        const span = R * flare(LANDING) * 1.22;
        for (let i = -12; i <= 12; i++) {
          const [px, py, k] = project(ax, ay + (i / 12) * span, az);
          dot(px, py, 1 * k * dotScale, landed > 0.5 ? LIME : DIM, 0.16 + landed * 0.3 * (1 - Math.abs(i) / 16));
        }
        for (const at of [-0.5, -0.92]) {
          for (let i = 0; i < 10; i++) {
            const a = (i / 10) * TAU;
            const [px, py, k] = project(ax, ay + at * span + Math.cos(a) * 0.075, az + Math.sin(a) * 0.075 * widen);
            dot(px, py, 0.9 * k * dotScale, DIM, 0.3 + landed * 0.25);
          }
        }
      }
      // Dust streams through the tube and stops at a closed commit gate.
      for (const [offset, angle, off, speed] of dust) {
        const s = FIRST + ((offset * (LAST - FIRST) + time * speed) % (LAST - FIRST));
        const [ax, ay, az] = axis(s);
        const size = flare(s);
        const fade = clamp(1 - (Math.abs(s - 2.5) - 2.9) / 1.1) * (s > COMMIT - 0.04 ? 1 - f.block : 1);
        const held = f.block * clamp(1 - (COMMIT - s) / 0.7) * (s <= COMMIT ? 1 : 0);
        const a = angle + s * 0.4;
        for (let i = 0; i < 3; i++) {
          const [bx, by, bz] = i ? axis(s - i * 0.035) : [ax, ay, az];
          const [px, py] = project(bx, by + Math.cos(a) * R * size * off, bz + Math.sin(a) * R * size * off);
          dot(px, py, (1 - i * 0.22) * size * dotScale, held > 0.3 ? AMBER : LIME, (0.42 - i * 0.13) * fade * (0.5 + size * 0.5));
        }
      }
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
        if (gate >= 0) {
          // A dial of ticks around each gate, turning against the ring.
          for (let i = 0; i < 24; i++) {
            const a = (i / 24) * TAU - turn * 0.6;
            for (const out of [1.13, 1.2]) {
              const [px, py] = project(ax, ay + Math.cos(a) * R * size * out, az + Math.sin(a) * R * size * out);
              dot(px, py, 0.85 * size * dotScale, color, (lit ? 0.42 : 0.18) * fade);
            }
          }
          // The ring the work has just passed widens and fades.
          const past = sig === null || heading < 0 ? 9 : sig - gate;
          if (lit && past > 0 && past < 0.8)
            for (let i = 0; i < 64; i++) {
              const a = (i / 64) * TAU;
              const wide = R * size * (1.05 + past * 0.75);
              const [px, py] = project(ax, ay + Math.cos(a) * wide, az + Math.sin(a) * wide);
              dot(px, py, 1.1 * size * dotScale, LIME, (1 - past / 0.8) * 0.55);
            }
          // What the gate does: a ghost until the work passes, then drawn in stroke by stroke.
          drawn[gate] = still ? (lit ? 1 : 0) : drawn[gate] + ((lit ? 1 : 0) - drawn[gate]) * Math.min(1, dt * 4.5);
          const emblem = emblems[gate];
          const done = drawn[gate] * emblem.length;
          for (let i = 0; i < emblem.length; i++) {
            const [q, p] = emblem[i];
            const on = i < done;
            const [px, py] = project(ax, ay + p * radius, az + q * radius * widen);
            dot(px, py, (on ? 1.35 : 0.95) * size * dotScale, on ? LIME : DIM, (on ? 0.92 : 0.26) * fade * (1 - blocked));
          }
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
        // While it is closed, the refusal keeps going out from it.
        if (blocked > 0.02 && !still) {
          const phase = (time * 0.9) % 1;
          for (let i = 0; i < 56; i++) {
            const a = (i / 56) * TAU;
            const wide = R * size * (0.5 + phase * 0.85);
            const [px, py] = project(ax, ay + Math.cos(a) * wide, az + Math.sin(a) * wide);
            dot(px, py, 1 * size * dotScale, AMBER, blocked * (1 - phase) * 0.6);
          }
        }
      }
      // The work: one dot as an issue, an outline once planned, files once implemented.
      const at = sig ?? LANDING;
      const [wx, wy, wz] = axis(at);
      const wk = flare(at);
      const cell = 0.115 * wk;
      const filled = reach < 2 ? 0 : Math.ceil(clamp((reach - 2) / 0.55) * BASE.length);
      const cells: [number, string, number][] =
        reach < 1 ? [[4, "244,255,214", 1]] : reach < 2 ? [[0, LIME, 0.5], [2, LIME, 0.5], [4, "244,255,214", 1], [6, LIME, 0.5], [8, LIME, 0.5]] : BASE.slice(0, filled).map((c) => [c, c === 4 ? "244,255,214" : LIME, 1]);
      if (f.edited && reach >= 2) cells.push([EDIT, f.block > 0.3 ? AMBER : LIME, 1]);
      // The stored record is compared with the work at the commit gate.
      const anchor = project(...((): [number, number, number] => {
        const [ax, ay, az] = axis(4);
        return [ax, ay - R * flare(4), az];
      })());
      const [wpx, wpy] = project(wx, wy, wz);
      const comparing = f.record * (sig === null ? 1 : clamp((sig - 4.15) / 0.2));
      if (comparing > 0.02) {
        const differs = f.block > 0.3;
        for (let i = 1; i < 16; i++) {
          const t = i / 16;
          dot(anchor[0] + (wpx - anchor[0]) * t, anchor[1] + (wpy - anchor[1]) * t, 1.05 * dotScale, differs ? AMBER : LIME, comparing * 0.55);
        }
        ctx.font = `600 ${Math.round(13 * dotScale)}px ui-monospace, Menlo, monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = `rgba(${differs ? AMBER : LIME},${comparing})`;
        const mx = (anchor[0] + wpx) / 2;
        const my = (anchor[1] + wpy) / 2;
        ctx.clearRect(mx - 9 * dotScale, my - 8 * dotScale, 18 * dotScale, 16 * dotScale);
        ctx.fillText(differs ? "≠" : "=", mx, my);
      }
      const hot = f.tone === "alert" ? AMBER : LIME;
      if (sig !== null) {
        const glow = ctx.createRadialGradient(wpx, wpy, 0, wpx, wpy, 38 * wk * dotScale);
        glow.addColorStop(0, `rgba(${hot},0.4)`);
        glow.addColorStop(1, `rgba(${hot},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(wpx, wpy, 38 * wk * dotScale, 0, TAU);
        ctx.fill();
        for (let i = 12; i >= 1; i--) {
          const [tx, ty] = project(...axis(sig - (0.16 + i * 0.07) * heading));
          dot(tx, ty, 2.1 * (1 - i / 16) * wk * dotScale, hot, 0.5 * (1 - i / 13));
        }
      }
      for (const [c, color, alpha] of cells) {
        const [px, py] = project(wx, wy + (1 - Math.floor(c / 3)) * cell, wz + ((c % 3) - 1) * cell * widen);
        dot(px, py, (c === 4 ? 2.7 : 2.1) * wk * dotScale, color, alpha);
      }
      // Committed, it becomes a commit: a ring closes round it on the line.
      if (landed > 0.02)
        for (let i = 0; i < 40; i++) {
          const a = (i / 40) * TAU;
          if (i / 40 > landed) break;
          const [px, py] = project(wx, wy + Math.cos(a) * cell * 2.3, wz + Math.sin(a) * cell * 2.3 * widen);
          dot(px, py, 1.5 * wk * dotScale, LIME, 0.9);
        }
      previous = sig ?? -9;
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
      const record = recordRef.current;
      if (record) {
        // Under the review gate's name: the headline and the other chips use the space above.
        record.style.transform = `translate(${anchor[0].toFixed(1)}px, ${(anchor[1] + 12 * flare(4) + 26).toFixed(1)}px) translateX(-50%)`;
        record.style.opacity = f.record.toFixed(2);
        const tree = treeState(f);
        if (lastTree !== tree) {
          lastTree = tree;
          record.dataset.state = tree;
        }
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
      <span ref={recordRef} className="gate-chip is-record" data-state={treeState(restFrame)} aria-hidden="true">
        <span className="gate-tree">
          {Array.from({ length: 9 }, (_, i) => (
            <i key={i} className={i === EDIT ? "is-edit" : BASE.includes(i) ? "is-on" : undefined} />
          ))}
        </span>
        검증 기록
      </span>
      <p ref={logRef} className="gate-log" data-tone={restFrame.tone} aria-hidden="true">
        {restFrame.log}
      </p>
      <p className="sr-only">검증 이후 코드가 바뀌면 커밋을 막고, 리뷰와 테스트를 다시 거친 뒤 커밋합니다.</p>
    </div>
  );
}
