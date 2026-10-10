import { test } from "node:test";
import assert from "node:assert/strict";
import { careerYears, projects } from "../src/data/portfolio";
import { migration } from "../src/lib/migration";
import { fanout } from "../src/lib/fanout";
import { retryPath } from "../src/lib/retry-path";
import { uploadFlow, uploadSlots } from "../src/lib/upload-flow";

test("each home-card highlight is one of the project's published decisions", () => {
  for (const p of projects) {
    assert.ok(p.decisions.some((d) => d.title === p.highlight), p.id);
  }
});

test("each case summary states its problem in one short sentence", () => {
  for (const p of projects) {
    assert.ok(p.problem.length <= 60, p.id);
    assert.equal(p.problem.match(/다\./g)?.length, 1, p.id);
    assert.ok(p.problem.endsWith("다."), p.id);
  }
});

test("project numbers follow the display order", () => {
  projects.forEach((p, i) => assert.equal(p.number, String(i + 1).padStart(2, "0"), p.id));
});

test("careerYears counts whole years since the first month", () => {
  assert.equal(careerYears(new Date(2026, 9, 9)), 5);
  assert.equal(careerYears(new Date(2027, 3, 30)), 5);
  assert.equal(careerYears(new Date(2027, 4, 1)), 6);
});

test("migration sketch only names technology from the platform case", () => {
  const platform = projects.find((p) => p.id === "platform-operations")!;
  const published = [platform.summary, platform.challenge, ...platform.decisions.flatMap((d) => [d.title, d.body])].join(" ");
  const cells = migration.rows.flatMap((r) => [r.before, r.after]).join(" ");
  for (const word of cells.match(/[A-Za-z][A-Za-z.]*/g) ?? []) assert.ok(published.includes(word), word);
  assert.ok(published.includes("약 50개") && published.includes("기존 React 화면과 연동"));
});

test("fan-out sketch quotes the membership case", () => {
  const membership = projects.find((p) => p.id === "membership")!;
  const published = [membership.problem, ...membership.flow, ...membership.decisions.map((d) => d.body)].join(" ");
  for (const text of [fanout.source.name, fanout.source.detail, fanout.topic.name])
    assert.ok(published.includes(text), text);
  // The caption keeps the duplicate guard without claiming an order the case text does not state.
  for (const text of ["자체 DB", "DB 플래그로 중복 처리"])
    assert.ok(fanout.caption.includes(text) && published.includes(text), text);
});

test("retry path notes quote the payments decision it illustrates", () => {
  const payments = projects.find((p) => p.id === "payments")!;
  const decision = payments.decisions.find((d) => d.title === retryPath.decision);
  assert.ok(decision);
  assert.ok(decision.body.includes(retryPath.before.note));
  assert.ok(decision.body.includes(retryPath.after.note));
  assert.ok(decision.body.includes(retryPath.before.link));
  assert.ok(decision.body.includes(retryPath.after.link));
  for (const node of ["AOP Proxy", "호출 Bean", "검증 Bean"]) {
    assert.ok(payments.flow.includes(node), node);
  }
});

test("upload flow notes quote the platform decision and respect the pool size", () => {
  const platform = projects.find((p) => p.id === "platform-operations")!;
  const decision = platform.decisions.find((d) => d.title === uploadFlow.decision);
  assert.ok(decision);
  assert.ok(decision.body.includes(uploadFlow.before.note));
  assert.ok(decision.body.includes(uploadFlow.after.note));
  assert.ok(decision.body.includes("행별 성공·실패와 사유를 반환"));
  const after = uploadSlots("after");
  for (const slot of new Set(after)) {
    assert.ok(after.filter((s) => s === slot).length <= uploadFlow.pool);
  }
  assert.ok(Math.max(...after) < Math.max(...uploadSlots("before")));
});

test("upload flow summary matches the illustrated slots", () => {
  assert.equal(uploadFlow.rows.length, 4);
  assert.equal(uploadFlow.pool, 2);
  assert.deepEqual(uploadSlots("after"), [0, 0, 1, 1]);
  assert.ok(uploadFlow.summary.includes("스레드 2개"));
});
