// Story played by the hero figure: work passes six gates, a code change after
// verification closes the commit gate, and the work is verified again.
// Gate names and log lines follow the published A/S and jira-harness text.
export const gateNames = ["이슈", "계획", "구현", "테스트", "리뷰", "커밋"] as const;
export const COMMIT = gateNames.length - 1;
// Gates that hold the verification record; a code change makes it stale.
const VERIFY = [3, 4];
// Where committed work comes to rest, just past the commit gate.
export const LANDING = 5.62;

export type GateTone = "run" | "pass" | "alert" | "retry";
export type GateFrame = {
  // Signal position in gate units (0 = 이슈 … 5 = 커밋); null once the work is committed.
  signal: number | null;
  // 0 → 1: how far the commit gate is closed.
  block: number;
  // 0 → 1: the code-change flash at the 구현 gate.
  change: number;
  lit: boolean[];
  // 0 → 1: the verification record is stored (once the review gate is passed).
  record: number;
  // The code was changed after verification, so the commit target holds that change.
  edited: boolean;
  log: string;
  tone: GateTone;
};

type Beat = { until: number; from: number; to: number; log: string; tone: GateTone };
const beats: Beat[] = [
  { until: 2300, from: -0.9, to: 2.6, log: "▸ 이슈 · 계획 · 구현", tone: "run" },
  { until: 3500, from: 2.6, to: 4.2, log: "▸ 테스트 · 리뷰 실행", tone: "run" },
  { until: 4100, from: 4.2, to: 4.4, log: "✓ 테스트·리뷰 통과 · 검증 기록 저장", tone: "pass" },
  { until: 6300, from: 4.4, to: 4.66, log: "✕ 검증 이후 코드 변경 감지 · 커밋 차단", tone: "alert" },
  { until: 7300, from: 4.66, to: 2.7, log: "↻ 재검증 · 테스트·리뷰 다시 실행", tone: "retry" },
  { until: 8800, from: 2.7, to: 4.4, log: "↻ 재검증 · 테스트·리뷰 다시 실행", tone: "retry" },
  { until: 10400, from: 4.4, to: LANDING, log: "✓ 검증 기록과 커밋 대상 일치 · 커밋 진행", tone: "pass" },
];
export const STORY_MS = beats[beats.length - 1].until;
// What the figure shows without motion, and after the story has played.
export const restFrame: GateFrame = {
  signal: null,
  block: 0,
  change: 0,
  lit: gateNames.map(() => true),
  record: 1,
  edited: true,
  log: beats[beats.length - 1].log,
  tone: "pass",
};

// The story repeats; the finished state is held this long before it starts over.
export const HOLD_MS = 2600;
// Time within the current pass, for a clock that has been running for `ms`.
export const storyTime = (ms: number) => ms % (STORY_MS + HOLD_MS);

const ease = (t: number) => t * t * (3 - 2 * t);
const ramp = (ms: number, start: number, end: number) => Math.min(1, Math.max(0, (ms - start) / (end - start)));

export function gateFrame(ms: number): GateFrame {
  if (ms >= STORY_MS) return restFrame;
  const index = beats.findIndex((b) => ms < b.until);
  const beat = beats[index];
  const start = index === 0 ? 0 : beats[index - 1].until;
  const signal = beat.from + (beat.to - beat.from) * ease(ramp(ms, start, beat.until));
  const blockedFrom = beats[2].until;
  const reopened = beats[5].until;
  const block = ramp(ms, blockedFrom, blockedFrom + 500) * (1 - ramp(ms, reopened - 300, reopened + 200));
  const change = ramp(ms, blockedFrom, blockedFrom + 250) * (1 - ramp(ms, blockedFrom + 900, beats[3].until));
  // The record goes stale with the code change and comes back as the work passes again.
  const stale = ms >= blockedFrom;
  const lit = gateNames.map((_, i) => {
    if (i === COMMIT) return index === 6 && signal >= COMMIT;
    if (stale && VERIFY.includes(i)) return index >= 5 && signal >= i;
    return index >= 4 || signal >= i;
  });
  const record = ramp(ms, beats[1].until, beats[1].until + 400);
  return { signal, block, change, lit, record, edited: stale, log: beat.log, tone: beat.tone };
}
