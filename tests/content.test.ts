import { test } from "node:test";
import assert from "node:assert/strict";
import { problemLead, projects } from "../src/data/portfolio";
import { retryPath } from "../src/lib/retry-path";
import { uploadFlow, uploadSlots } from "../src/lib/upload-flow";

test("each home-card highlight is one of the project's published decisions", () => {
  for (const p of projects) {
    assert.ok(p.decisions.some((d) => d.title === p.highlight), p.id);
  }
});

test("problemLead is the opening sentence of the published challenge", () => {
  for (const p of projects) {
    const lead = problemLead(p);
    assert.ok(p.challenge.startsWith(lead), p.id);
    assert.ok(lead.endsWith("다."), p.id);
  }
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
