import { test } from "node:test";
import assert from "node:assert/strict";
import { traces } from "../src/lib/trace";
import { assistantPreview, projects } from "../src/data/portfolio";

test("process traces keep the published step labels and captions", () => {
  assert.deepEqual(traces.harness.steps, ["테스트·리뷰", "Git tree 기록", "커밋 대상 비교"]);
  assert.equal(traces.harness.caption, "차단 모드: 미검증·실패·코드 변경 시 재검증");
  assert.deepEqual(traces["service-agent"].steps, ["권한 내 조회", "접수 초안", "확인 후 접수"]);
  assert.equal(traces["service-agent"].caption, "초안 유효시간 5분 · 등록 전 사용자 확인");
});

test("every trace starts from a clean slate and rests on the static design", () => {
  for (const [id, trace] of Object.entries(traces)) {
    const first = trace.frames[0];
    assert.ok(!first.nodes.includes("pass") && !first.nodes.includes("done"), id);
    const last = trace.frames[trace.frames.length - 1];
    assert.deepEqual(last.nodes, ["done", "done", "pass"], id);
    assert.deepEqual(last.wires, ["done", "done"], id);
  }
});

test("trace frames are well formed and short enough to watch", () => {
  for (const [id, trace] of Object.entries(traces)) {
    for (const frame of trace.frames) {
      assert.equal(frame.nodes.length, 3, id);
      assert.equal(frame.wires.length, 2, id);
      assert.ok(frame.log.trim().length > 0, id);
      assert.ok(frame.hold >= 300 && frame.hold <= 2500, id);
    }
    // Playback stops on the last frame, so its hold never runs.
    const total = trace.frames.slice(0, -1).reduce((sum, frame) => sum + frame.hold, 0);
    assert.ok(total <= 8000, `${id} runs ${total}ms`);
  }
});

test("harness trace blocks a changed commit, re-verifies, then passes", () => {
  const frames = traces.harness.frames;
  const blocked = frames.findIndex((f) => f.nodes[2] === "fail");
  assert.ok(blocked > 0, "shows the blocked commit");
  assert.ok(frames.slice(blocked + 1).some((f) => f.nodes[0] === "run"), "re-runs tests and review");
  assert.equal(frames.findIndex((f) => f.nodes[2] === "pass"), frames.length - 1);
});

test("payments trace bypasses the proxy, then passes through it after the fix", () => {
  const frames = traces.payments.frames;
  const bypass = frames.findIndex((f) => f.nodes[1] === "fail");
  assert.ok(bypass > 0, "shows the bypassed proxy");
  assert.ok(frames.slice(bypass + 1).some((f) => f.nodes[1] === "run"), "calls through the proxy after the fix");
  assert.equal(frames.findIndex((f) => f.nodes[2] === "pass"), frames.length - 1);
});

test("service agent trace waits for the user before the ticket is created", () => {
  const states = traces["service-agent"].frames.map((f) => f.nodes[2]);
  const wait = states.indexOf("wait");
  assert.ok(wait > 0 && wait < states.indexOf("pass"));
  assert.ok(!states.includes("fail"));
});

test("assistant preview answers only with published project sentences", () => {
  const harness = projects.find((p) => p.id === "harness");
  assert.ok(harness);
  assert.match(assistantPreview.question, /jira-harness/);
  const published = [harness.challenge, ...harness.decisions.map((d) => d.body)].join(" ");
  for (const sentence of assistantPreview.answer.split(/(?<=다\.)\s+/))
    assert.ok(published.includes(sentence), `unpublished sentence: ${sentence}`);
});
