// Point-cloud figures, one per case. Each is a sketch of the case's main flow
// (the same flow its diagram and text describe); dot counts are illustrative.
export type CloudPoint = {
  x: number;
  y: number;
  z: number;
  // Position along the figure's flow, 0 → 1. The highlight travels in this order.
  u: number;
  // 1 marks the part of the figure the case is about.
  tone: 0 | 1;
  // Where the dot starts before the flow reaches it and settles it into place.
  from?: [number, number, number];
  // Last dot of a stroke: the scene never fills the gap from it to the next dot.
  end?: true;
};
export type FigureId =
  | "field-service"
  | "report-agent"
  | "platform-operations"
  | "payments"
  | "membership"
  | "service-agent"
  | "harness";

// Deterministic noise so the server, the tests and every visit draw the same figure.
function seeded(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const TAU = Math.PI * 2;
type Add = (x: number, y: number, z: number, u: number, tone?: 0 | 1, from?: CloudPoint["from"]) => void;

// Ring in the y–z plane, i.e. facing along the flow (x) axis.
function ring(add: Add, x: number, r: number, n: number, u: number, tone: 0 | 1 = 0, turn = 0) {
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * TAU + turn;
    add(x, Math.cos(a) * r, Math.sin(a) * r, u, tone);
  }
}
function line(add: Add, a: [number, number, number], b: [number, number, number], n: number, u0: number, u1: number, tone: 0 | 1 = 0) {
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1);
    add(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, u0 + (u1 - u0) * t, tone);
  }
}
// Ends the current stroke (see CloudPoint.end).
const cut = (add: Add) => add(NaN, 0, 0, 0);
// Small ring in the y–z plane around any centre: a node.
function loop(add: Add, c: [number, number, number], r: number, n: number, u: number, tone: 0 | 1 = 0) {
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * TAU;
    add(c[0], c[1] + Math.cos(a) * r, c[2] + Math.sin(a) * r, u, tone);
  }
  cut(add);
}
// Ring lying flat (x–z plane) at height c[1].
function disc(add: Add, c: [number, number, number], r: number, n: number, u: number, tone: 0 | 1 = 0) {
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * TAU;
    add(c[0] + Math.cos(a) * r, c[1], c[2] + Math.sin(a) * r, u, tone);
  }
  cut(add);
}
// A database: three flat rings stacked.
function drum(add: Add, c: [number, number, number], r: number, u: number, tone: 0 | 1 = 0) {
  for (const dy of [0.09, 0, -0.09]) disc(add, [c[0], c[1] + dy, c[2]], r, 20, u, tone);
}
// A sheet facing the flow (y–z plane): its outline and, inside, rows of the given lengths.
function sheet(add: Add, x: number, h: number, w: number, u: number, tone: 0 | 1 = 0, rows: number[] = []) {
  const corners: [number, number][] = [[h, -w], [h, w], [-h, w], [-h, -w]];
  corners.forEach(([y, z], i) => {
    const [ny, nz] = corners[(i + 1) % 4];
    line(add, [x, y, z], [x, ny, nz], Math.max(4, Math.round(Math.hypot(ny - y, nz - z) / 0.06)), u, u, tone);
  });
  cut(add);
  rows.forEach((length, k) => {
    const y = h - 0.13 - k * 0.12;
    line(add, [x, y, -w + 0.07], [x, y, -w + 0.07 + length], Math.max(3, Math.round(length / 0.06)), u, u, k === 0 ? tone : 0);
    cut(add);
  });
}
// A tick inside a ring at x, as wide as r.
function tick(add: Add, x: number, r: number, u: number) {
  line(add, [x, 0, -r * 0.45], [x, -r * 0.38, -r * 0.1], 4, u, u, 1);
  line(add, [x, -r * 0.38, -r * 0.1], [x, r * 0.42, r * 0.5], 6, u, u, 1);
  cut(add);
}

const builders: Record<FigureId, (add: Add) => void> = {
  // Three parties that shared the word "customer" enter one flow of seven stages,
  // 접수 → 정산; the last stage fills in and leaves a settlement sheet that is kept.
  "field-service": (add) => {
    [0.36, 0, -0.36].forEach((y, k) => {
      loop(add, [-1.26, y, 0], 0.09, 12, 0, k === 1 ? 1 : 0);
      line(add, [-1.17, y, 0], [-1.0, y * 0.2, 0], 5, 0.02, 0.06);
      cut(add);
    });
    const stages = 7;
    for (let i = 0; i < stages; i++) {
      const x = -0.9 + i * 0.25;
      const u = 0.08 + (i / (stages - 1)) * 0.66;
      const last = i === stages - 1;
      ring(add, x, 0.5, 44, u, last ? 1 : 0, i * 0.2);
      cut(add);
      if (last) {
        ring(add, x, 0.34, 30, u, 1);
        cut(add);
        ring(add, x, 0.18, 16, u, 1);
        cut(add);
      }
    }
    line(add, [-1.0, 0, 0], [0.6, 0, 0], 38, 0.06, 0.74);
    cut(add);
    line(add, [0.66, 0, 0], [0.88, 0, 0], 5, 0.8, 0.86, 1);
    cut(add);
    sheet(add, 0.98, 0.3, 0.22, 0.92, 1, [0.3, 0.2, 0.28]);
    sheet(add, 1.13, 0.3, 0.22, 1);
  },
  // A report (speech bubble) is followed through three pages of the deployed source
  // to one line of code; the draft then passes the ring where a person confirms it
  // and becomes an issue card.
  "report-agent": (add) => {
    const rand = seeded(11);
    ring(add, -1.12, 0.2, 30, 0, 1);
    cut(add);
    line(add, [-1.12, 0.03, -0.09], [-1.12, 0.03, 0.09], 4, 0.02, 0.02, 1);
    cut(add);
    line(add, [-1.12, -0.19, 0.07], [-1.12, -0.31, 0.17], 3, 0.03, 0.03, 1);
    cut(add);
    const pages = [-0.52, -0.22, 0.08];
    const rows = 9;
    const hit = 4;
    for (let r = 0; r < rows; r++)
      pages.forEach((x, k) => {
        const y = 0.44 - r * 0.11;
        const found = k === pages.length - 1 && r === hit;
        const indent = !found && rand() < 0.4 ? 0.14 : 0;
        const length = found ? 0.72 : 0.3 + rand() * 0.46;
        const u = 0.12 + k * 0.13 + r * 0.012;
        line(add, [x, y, -0.44 + indent], [x, y, -0.44 + indent + length], Math.round(length / 0.07), u, u, found ? 1 : 0);
        cut(add);
      });
    line(add, [-0.9, 0, 0], [pages[pages.length - 1], 0, 0], 20, 0.05, 0.5, 1);
    cut(add);
    line(add, [0.16, 0, 0], [0.42, 0, 0], 6, 0.56, 0.7);
    cut(add);
    ring(add, 0.64, 0.3, 44, 0.8, 1);
    cut(add);
    line(add, [0.64, 0, -0.13], [0.64, -0.11, -0.03], 4, 0.84, 0.84, 1);
    line(add, [0.64, -0.11, -0.03], [0.64, 0.13, 0.15], 6, 0.84, 0.86, 1);
    cut(add);
    line(add, [0.74, 0, 0], [0.96, 0, 0], 5, 0.88, 0.92);
    cut(add);
    const card: [number, number][] = [[0.27, -0.2], [0.27, 0.2], [-0.27, 0.2], [-0.27, -0.2]];
    card.forEach(([y, z], i) => {
      const [ny, nz] = card[(i + 1) % 4];
      line(add, [1.12, y, z], [1.12, ny, nz], i % 2 ? 9 : 7, 0.95, 0.95, 1);
    });
    cut(add);
    line(add, [1.12, 0.15, -0.12], [1.12, 0.15, 0.1], 5, 0.97, 0.97, 1);
    cut(add);
    line(add, [1.12, 0.02, -0.12], [1.12, 0.02, 0.12], 5, 0.98, 0.98);
    cut(add);
    line(add, [1.12, -0.1, -0.12], [1.12, -0.1, 0.04], 4, 0.99, 0.99);
  },
  // The old backend, a tangle, goes through the four deploy stages (three frames,
  // then the running box) and ends as ordered rows on one stack.
  "platform-operations": (add) => {
    const rand = seeded(7);
    const turns = [[1, 2, 3], [2, 3, 1], [3, 1, 2]];
    turns.forEach((f, k) => {
      const shift = [rand() * TAU, rand() * TAU, rand() * TAU];
      for (let i = 0; i <= 70; i++) {
        const t = (i / 70) * TAU;
        add(-0.9 + Math.sin(f[0] * t + shift[0]) * 0.34, Math.sin(f[1] * t + shift[1]) * 0.4, Math.sin(f[2] * t + shift[2]) * 0.34, 0.02 + k * 0.07 + (i / 70) * 0.08, 0);
      }
      cut(add);
    });
    line(add, [-0.5, 0, 0], [0.5, 0, 0], 22, 0.3, 0.62);
    cut(add);
    [-0.32, -0.08, 0.16].forEach((x, k) => sheet(add, x, 0.15 + k * 0.02, 0.15 + k * 0.02, 0.36 + k * 0.09, 1));
    const c = 0.86;
    const h = 0.3;
    for (const a of [-h, h])
      for (const b of [-h, h]) {
        line(add, [c - h, a, b], [c + h, a, b], 10, 0.68, 0.96);
        cut(add);
        line(add, [c + a, -h, b], [c + a, h, b], 10, 0.82 + a * 0.4, 0.82 + a * 0.4);
        cut(add);
        line(add, [c + a, b, -h], [c + a, b, h], 10, 0.82 + a * 0.4, 0.82 + a * 0.4);
        cut(add);
      }
    const loose = (): [number, number, number] => [-0.9 + (rand() - 0.5) * 0.7, (rand() - 0.5) * 0.8, (rand() - 0.5) * 0.7];
    for (const y of [0.16, 0, -0.16])
      for (const z of [-0.16, 0, 0.16]) {
        for (let i = 0; i < 5; i++) add(c - 0.18 + i * 0.09, y, z, 0.74 + i * 0.05, 1, loose());
        cut(add);
      }
  },
  // A webhook reaches the calling bean. Through the proxy ring a failed check is
  // tried again (the arcs) until it lands in the database; the dim path underneath
  // goes round the proxy.
  payments: (add) => {
    loop(add, [-1.34, 0, 0], 0.07, 10, 0);
    line(add, [-1.26, 0, 0], [-1.08, 0, 0], 4, 0.02, 0.06);
    cut(add);
    sheet(add, -1.0, 0.2, 0.2, 0.08, 0, [0.22]);
    for (let i = 0; i <= 30; i++) {
      const t = i / 30;
      add(-1.0 + t * 1.5, -0.2 - Math.sin(t * Math.PI) * 0.52, 0, 0.12 + t * 0.4, 0);
      if (i % 3 === 2) cut(add);
    }
    cut(add);
    line(add, [-0.92, 0, 0], [0.5, 0, 0], 34, 0.1, 0.5, 1);
    cut(add);
    ring(add, -0.3, 0.44, 50, 0.3, 1);
    cut(add);
    ring(add, -0.3, 0.55, 40, 0.3, 0, 0.08);
    cut(add);
    [0.24, 0.4, 0.56].forEach((height, k) => {
      const n = 14 + k * 5;
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI;
        add(0.1 - Math.cos(a) * 0.4, Math.sin(a) * height, 0, 0.52 + k * 0.1 + (i / n) * 0.1, 1);
      }
      cut(add);
    });
    sheet(add, 0.5, 0.24, 0.22, 0.86, 1, [0.26, 0.18]);
    line(add, [0.58, 0, 0], [0.84, 0, 0], 6, 0.9, 0.95, 1);
    cut(add);
    drum(add, [1.04, 0, 0], 0.17, 1, 1);
  },
  // One change in the member database is published once to the topic ring; each
  // service subscribes and writes it into its own database.
  membership: (add) => {
    drum(add, [-1.08, 0, 0], 0.21, 0, 1);
    line(add, [-0.84, 0, 0], [-0.36, 0, 0], 9, 0.08, 0.26);
    cut(add);
    ring(add, -0.22, 0.3, 36, 0.32, 1);
    cut(add);
    ring(add, -0.22, 0.16, 18, 0.32);
    cut(add);
    for (const [y, z] of [[0.58, 0.14], [0, -0.18], [-0.58, 0.14]]) {
      line(add, [-0.12, 0, 0], [0.32, y, z], 12, 0.4, 0.66);
      cut(add);
      loop(add, [0.4, y, z], 0.09, 12, 0.7, 1);
      line(add, [0.5, y, z], [0.72, y, z], 5, 0.76, 0.86);
      cut(add);
      drum(add, [0.92, y, z], 0.16, 0.94, 1);
    }
  },
  // Requests narrow to the caller's own scope, read the data without changing it,
  // and stop as a draft card until a person confirms.
  "service-agent": (add) => {
    const steps = 8;
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      ring(add, -1.0 + t * 0.86, 0.72 - t * 0.42, Math.round(38 - t * 18), t * 0.42, 0, k * 0.3);
      cut(add);
    }
    ring(add, 0, 0.3, 40, 0.5, 1);
    cut(add);
    ring(add, 0, 0.38, 30, 0.5, 1, 0.1);
    cut(add);
    line(add, [0, -0.44, 0], [0, -0.62, 0], 4, 0.52, 0.56);
    cut(add);
    drum(add, [0, -0.78, 0], 0.15, 0.58);
    line(add, [0.08, 0, 0], [0.56, 0, 0], 9, 0.6, 0.78);
    cut(add);
    sheet(add, 0.68, 0.3, 0.24, 0.86, 1, [0.3, 0.2, 0.28]);
    line(add, [0.76, 0, 0], [0.96, 0, 0], 4, 0.9, 0.94);
    cut(add);
    ring(add, 1.1, 0.17, 24, 0.97, 1);
    cut(add);
    tick(add, 1.1, 0.17, 0.98);
  },
  // The tree that was verified and the tree about to be committed are compared node
  // by node; only when they match does the work pass the ring into the commit line.
  harness: (add) => {
    const nodes: [number, number][] = [[0.44, 0], [0.1, -0.28], [0.1, 0.28], [-0.26, -0.42], [-0.26, -0.14], [-0.26, 0.14], [-0.26, 0.42]];
    const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
    for (const [x, tone, u] of [[-1.02, 0, 0.02], [-0.42, 1, 0.4]] as const) {
      for (const [a, b] of edges) {
        line(add, [x, ...nodes[a]], [x, ...nodes[b]], 6, u, u + 0.1, tone);
        cut(add);
      }
      for (const [y, z] of nodes) loop(add, [x, y, z], 0.05, 8, u + 0.06, tone);
    }
    for (const [y, z] of nodes) {
      line(add, [-0.94, y, z], [-0.5, y, z], 7, 0.16, 0.38);
      cut(add);
    }
    line(add, [-0.32, 0, 0], [0.04, 0, 0], 7, 0.52, 0.66);
    cut(add);
    ring(add, 0.26, 0.3, 42, 0.74, 1);
    cut(add);
    tick(add, 0.26, 0.3, 0.78);
    line(add, [0.36, 0, 0], [1.24, 0, 0], 18, 0.82, 1, 1);
    cut(add);
    for (const x of [0.66, 0.95, 1.24]) loop(add, [x, 0, 0], 0.08, 12, 0.86 + (x - 0.66) * 0.24, 1);
    line(add, [0.66, 0, 0], [0.95, 0.3, 0], 7, 0.9, 0.94);
    cut(add);
    loop(add, [0.95, 0.3, 0], 0.07, 10, 0.95);
  },
};

const cache = new Map<FigureId, CloudPoint[]>();
export function figure(id: FigureId): CloudPoint[] {
  let points = cache.get(id);
  if (!points) {
    const built: CloudPoint[] = [];
    builders[id]((x, y, z, u, tone = 0, from) => {
      if (Number.isNaN(x)) {
        if (built.length) built[built.length - 1].end = true;
      } else built.push({ x, y, z, u, tone, from });
    });
    points = built;
    cache.set(id, points);
  }
  return points;
}
export const figureIds = Object.keys(builders) as FigureId[];

// How far a dot has settled (0 → 1) once the flow front `p` has reached its `u`.
export function settled(p: number, u: number): number {
  const t = Math.min(1, Math.max(0, (p - u) / 0.3));
  return t * t * (3 - 2 * t);
}

// Signature colour of each case as "r,g,b", shared by its figure and its scene.
export const figureColor: Record<FigureId, string> = {
  "field-service": "126,231,214",
  "report-agent": "255,138,108",
  "platform-operations": "146,186,255",
  payments: "255,190,120",
  membership: "255,160,200",
  "service-agent": "209,245,138",
  harness: "188,168,255",
};

// The figure spread over exactly `count` dots, so every scene can be drawn
// with the same particles. Extra dots fill the gap to the next dot of the same
// stroke (a ring, a line, a lattice edge); where the next dot is far away they
// stack on the dot they repeat.
const NEIGHBOUR = 0.33;
const spread = new Map<string, CloudPoint[]>();
export function resample(id: FigureId, count: number): CloudPoint[] {
  const key = `${id}:${count}`;
  let points = spread.get(key);
  if (!points) {
    const source = figure(id);
    points = Array.from({ length: count }, (_, i) => {
      const at = (i * source.length) / count;
      const p = source[Math.floor(at)];
      const q = source[(Math.floor(at) + 1) % source.length];
      const near = !p.end && Math.hypot(q.x - p.x, q.y - p.y, q.z - p.z) < NEIGHBOUR;
      const t = near ? at % 1 : 0;
      return { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t, z: p.z + (q.z - p.z) * t, u: p.u, tone: p.tone };
    });
    spread.set(key, points);
  }
  return points;
}

// Camera sway of the scene stage for a scroll position counted in scenes
// (2.5 = halfway through the third case). Every whole number gives the same
// pose, so crossing from one scene into the next never jumps.
export function scenePose(position: number): { yaw: number; lift: number } {
  const sway = Math.sin(position * TAU);
  return { yaw: -0.8 + sway * 0.16, lift: sway * 20 };
}
