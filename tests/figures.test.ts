import { test } from "node:test";
import assert from "node:assert/strict";
import { projects } from "../src/data/portfolio";
import { figure, figureIds, settled } from "../src/lib/cloud";
import { COMMIT, STORY_MS, gateFrame, gateNames, restFrame } from "../src/lib/gates";
import { traces } from "../src/lib/trace";
import { span, timeline } from "../src/lib/timeline";
import { evidenceRows, searchEntries } from "../src/lib/evidence";

test("every case has a point figure that fits its frame", () => {
  assert.deepEqual([...figureIds].sort(), projects.map((p) => p.id).sort());
  for (const id of figureIds) {
    const points = figure(id);
    assert.ok(points.length > 100, id);
    for (const p of points) {
      assert.ok(Math.hypot(p.x, p.y, p.z) <= 1.45, id);
      assert.ok(p.u >= 0 && p.u <= 1, id);
    }
    assert.equal(figure(id), points, "built once");
  }
});

test("the A/S figure has one ring per published stage", () => {
  const stages = projects.find((p) => p.id === "field-service")!.flow.length;
  const rings = new Set(figure("field-service").filter((p) => Math.hypot(p.y, p.z) > 0.49).map((p) => p.x.toFixed(3)));
  assert.equal(rings.size, stages);
});

test("dots settle only after the flow reaches them", () => {
  assert.equal(settled(0.2, 0.5), 0);
  assert.equal(settled(0.9, 0.5), 1);
  assert.ok(settled(0.6, 0.5) > 0 && settled(0.6, 0.5) < 1);
});

test("gate story follows the published order and log lines", () => {
  assert.deepEqual([...gateNames], ["이슈", "계획", "구현", "리뷰", "테스트", "커밋"]);
  const harnessLogs: string[] = traces.harness.frames.map((f) => f.log);
  const logs = new Set<string>();
  for (let ms = 0; ms <= STORY_MS; ms += 50) logs.add(gateFrame(ms).log);
  for (const quoted of ["✕ 검증 이후 코드 변경 감지 · 커밋 차단", "↻ 재검증 · 테스트·리뷰 다시 실행"]) {
    assert.ok(logs.has(quoted), quoted);
    assert.ok(harnessLogs.includes(quoted), quoted);
  }
});

test("a code change after verification closes the commit gate until the work is verified again", () => {
  const start = gateFrame(0);
  assert.ok(start.signal !== null && start.signal < 0);
  assert.ok(start.lit.every((on) => !on));
  let blocked = false;
  let reverified = false;
  for (let ms = 0; ms < STORY_MS; ms += 20) {
    const f = gateFrame(ms);
    assert.ok(f.signal !== null);
    if (f.block > 0.5) {
      blocked = true;
      assert.ok(f.signal < COMMIT, `signal passed a closed gate at ${ms}ms`);
      assert.equal(f.lit[COMMIT], false);
    }
    if (blocked && f.tone === "retry" && f.lit[3] && f.lit[4]) reverified = true;
    if (f.lit[COMMIT]) assert.ok(reverified, "committed before re-verification");
  }
  assert.ok(blocked && reverified);
  assert.equal(gateFrame(STORY_MS), restFrame);
  assert.ok(restFrame.lit.every(Boolean) && restFrame.signal === null && restFrame.block === 0);
});

test("timeline spans follow the published periods", () => {
  const now = new Date(2026, 10, 19);
  assert.deepEqual(span("2021.05 – 2023.09", now), { start: 0, length: 29, loose: false });
  assert.deepEqual(span("2023.11 — 현재", now), { start: 30, length: 37, loose: false });
  // A bare year has no published months: outlined, and never past the current month.
  assert.deepEqual(span("2026", now), { start: 56, length: 11, loose: true });
  const t = timeline(now);
  assert.equal(t.months, 67);
  assert.deepEqual(t.companies.map((c) => c.name), ["교육지대(주)", "DB Inc."]);
  assert.equal(t.rows.length, projects.length);
  for (const r of t.rows) assert.ok(r.start >= 0 && r.start + r.length <= t.months, r.id);
});

test("evidence matrix and finder only point at published cases", () => {
  for (const row of evidenceRows)
    assert.ok(projects.some((p) => p.tags.some((t) => t.toLowerCase().includes(row.query.toLowerCase()))), row.name);
  for (const entry of searchEntries) {
    const [, id, decision] = entry.href.match(/^\/projects\/([\w-]+)(?:#decision-(\d+))?$/) ?? [];
    const project = projects.find((p) => p.id === id);
    assert.ok(project, entry.href);
    if (decision) assert.ok(Number(decision) <= project.decisions.length, entry.href);
  }
});

test("decision figures quote the decision they sit under", async () => {
  const { batchFigure, batchDots, settlementFigure, draftFigure } = await import("../src/lib/decision-figures");
  const text = (title: string) => {
    const d = projects.flatMap((p) => p.decisions).find((d) => d.title === title);
    assert.ok(d, title);
    return `${d.title} ${d.body}`;
  };
  const batch = text(batchFigure.decision);
  for (const quoted of [`스케줄러 ${batchFigure.count}개`, "Batch 서버 1대", batchFigure.before, batchFigure.unit, batchFigure.after, batchFigure.note])
    assert.ok(batch.includes(quoted), quoted);
  assert.equal(batchDots().length, batchFigure.count);
  const settlement = text(settlementFigure.decision);
  for (const quoted of ["부품 단가", "모델명", "정산 이후", "수리 건", "금액", "별도 정산 테이블", "과거 정산 내역은 유지", "정산 생성 시점"])
    assert.ok(settlement.includes(quoted), quoted);
  const draft = text(draftFigure.decision);
  for (const quoted of [`${draftFigure.minutes}분`, draftFigure.draft, ...draftFigure.outcomes.flatMap((o) => [o.when, o.then])])
    assert.ok(draft.includes(quoted), quoted);
});
