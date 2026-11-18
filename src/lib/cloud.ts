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
};
export type FigureId =
  | "field-service"
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
  for (let i = 0; i < n; i++) {
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
// Evenly spread dots on a small sphere.
function ball(add: Add, c: [number, number, number], r: number, n: number, u: number, tone: 0 | 1 = 0) {
  for (let i = 0; i < n; i++) {
    const y = 1 - (2 * (i + 0.5)) / n;
    const s = Math.sqrt(1 - y * y);
    const a = i * 2.39996;
    add(c[0] + Math.cos(a) * s * r, c[1] + y * r, c[2] + Math.sin(a) * s * r, u, tone);
  }
}

const builders: Record<FigureId, (add: Add) => void> = {
  // Seven stages in a row, 접수 → 정산; the last one is filled in: the stored settlement.
  "field-service": (add) => {
    const stages = 7;
    for (let i = 0; i < stages; i++) {
      const x = -1 + (2 * i) / (stages - 1);
      const u = i / (stages - 1);
      const last = i === stages - 1;
      ring(add, x, 0.5, 44, u, last ? 1 : 0, i * 0.2);
      if (last) {
        ring(add, x, 0.34, 30, u, 1);
        ring(add, x, 0.18, 16, u, 1);
        add(x, 0, 0, u, 1);
      }
    }
    line(add, [-1.2, 0, 0], [1.2, 0, 0], 49, 0, 1);
  },
  // A loose cloud on the left, the same dots in an ordered lattice on the right:
  // the backend moved onto one stack.
  "platform-operations": (add) => {
    const rand = seeded(7);
    const loose = (): [number, number, number] => {
      const a = rand() * TAU;
      const b = Math.acos(2 * rand() - 1);
      const r = 0.15 + rand() * 0.5;
      return [-0.68 + Math.sin(b) * Math.cos(a) * r, Math.cos(b) * r * 1.15, Math.sin(b) * Math.sin(a) * r];
    };
    for (let i = 0; i < 70; i++) add(...loose(), rand() * 0.3, 0);
    const n = 4;
    for (let ix = 0; ix < n; ix++)
      for (let iy = 0; iy < n; iy++)
        for (let iz = 0; iz < n; iz++) {
          const cell = (i: number) => (i / (n - 1) - 0.5) * 0.96;
          add(0.6 + cell(ix), cell(iy), cell(iz), 0.3 + (ix / (n - 1)) * 0.5 + rand() * 0.2, 1, loose());
        }
    line(add, [-0.12, 0, 0], [0.04, 0, 0], 4, 0.3, 0.34);
  },
  // A call that runs through the proxy ring, then comes round once more: the retry.
  payments: (add) => {
    ring(add, -0.42, 0.5, 56, 0.3, 1);
    ring(add, -0.42, 0.6, 40, 0.3, 0, 0.08);
    line(add, [-1.2, 0, 0], [0.28, 0, 0], 40, 0, 0.5, 1);
    for (let i = 0; i < 44; i++) {
      const a = -Math.PI / 2 + (i / 44) * TAU;
      add(0.28 + Math.cos(a) * 0.36, 0.36 + Math.sin(a) * 0.36, 0, 0.5 + (i / 44) * 0.36, 1);
    }
    line(add, [0.36, 0, 0], [1.2, 0, 0], 22, 0.86, 1, 1);
  },
  // One change, published once, taken up by each subscribing service.
  membership: (add) => {
    ball(add, [-1, 0, 0], 0.17, 30, 0, 1);
    line(add, [-0.8, 0, 0], [-0.34, 0, 0], 9, 0.08, 0.3);
    ring(add, -0.24, 0.3, 34, 0.34, 1);
    ring(add, -0.24, 0.16, 16, 0.34, 0);
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * TAU + Math.PI / 2;
      const target: [number, number, number] = [0.92, Math.sin(a) * 0.66, Math.cos(a) * 0.66];
      line(add, [-0.14, 0, 0], [target[0] - 0.16, target[1] * 0.88, target[2] * 0.88], 18, 0.4, 0.86);
      ball(add, target, 0.16, 26, 0.94, 1);
    }
  },
  // Requests narrow through the permission gate; one draft waits behind it for a person.
  "service-agent": (add) => {
    const steps = 9;
    for (let k = 0; k <= steps; k++) {
      const t = k / steps;
      ring(add, -1.1 + t * 1.05, 0.82 - t * 0.5, Math.round(40 - t * 20), t * 0.48, 0, k * 0.3);
    }
    ring(add, 0.06, 0.32, 40, 0.55, 1);
    ring(add, 0.06, 0.4, 30, 0.55, 1, 0.1);
    line(add, [0.14, 0, 0], [0.74, 0, 0], 11, 0.6, 0.82);
    const s = 0.3;
    const corners: [number, number][] = [[-s, -s], [s, -s], [s, s], [-s, s]];
    corners.forEach(([y, z], i) => {
      const [ny, nz] = corners[(i + 1) % 4];
      line(add, [0.9, y, z], [0.9, ny, nz], 9, 0.94, 0.94, 1);
    });
    for (const y of [-0.12, 0, 0.12]) line(add, [0.9, y, -0.18], [0.9, y, 0.18], 5, 0.97, 0.97);
  },
  // The tree that was verified and the tree about to be committed, set side by side.
  harness: (add) => {
    const n = 5;
    for (let iy = 0; iy < n; iy++)
      for (let iz = 0; iz < n; iz++) {
        const y = (iy / (n - 1) - 0.5) * 1.1;
        const z = (iz / (n - 1) - 0.5) * 1.1;
        const row = iy / (n - 1);
        add(-0.8, y, z, row * 0.28, 0);
        add(0.8, y, z, 0.72 + row * 0.28, 1);
        const corner = (iy === 0 || iy === n - 1) && (iz === 0 || iz === n - 1);
        if (corner || (iy === 2 && iz === 2)) line(add, [-0.68, y, z], [0.68, y, z], 13, 0.34 + row * 0.1, 0.6 + row * 0.1);
      }
  },
};

const cache = new Map<FigureId, CloudPoint[]>();
export function figure(id: FigureId): CloudPoint[] {
  let points = cache.get(id);
  if (!points) {
    const built: CloudPoint[] = [];
    builders[id]((x, y, z, u, tone = 0, from) => built.push({ x, y, z, u, tone, from }));
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
