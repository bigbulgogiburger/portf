import { test } from "node:test";
import assert from "node:assert/strict";
import { scrambleText } from "../src/lib/motion";
import { traces } from "../src/lib/trace";
import { assistantPreview, projects } from "../src/data/portfolio";

// Always picks the last glyph, which never appears in the kicker labels.
const lastGlyph = () => 0.999;

test("scrambleText keeps length, spaces and slashes at every step", () => {
  const text = "01 / PROJECTS";
  for (const progress of [0, 0.25, 0.5, 0.75, 0.99]) {
    const out = scrambleText(text, progress, Math.random);
    assert.equal(out.length, text.length);
    [...text].forEach((ch, i) => {
      if (ch === " " || ch === "/") assert.equal(out[i], ch);
    });
  }
});

test("scrambleText resolves characters from left to right", () => {
  const text = "03 / TECHNOLOGY";
  let resolvedBefore = 0;
  for (let step = 0; step <= 20; step++) {
    const out = scrambleText(text, step / 20, lastGlyph);
    const resolved = [...text].filter((ch, i) => ch !== " " && ch !== "/" && out[i] === ch).length;
    const firstUnresolved = [...text].findIndex((ch, i) => out[i] !== ch);
    if (firstUnresolved !== -1)
      assert.ok([...out.slice(firstUnresolved)].every((ch, i) => {
        const original = text[firstUnresolved + i];
        return original === " " || original === "/" || ch !== original;
      }), `only a prefix is resolved at step ${step}`);
    assert.ok(resolved >= resolvedBefore);
    resolvedBefore = resolved;
  }
});

test("scrambleText returns the original text once finished", () => {
  assert.equal(scrambleText("04 / CAREER", 1, Math.random), "04 / CAREER");
  assert.equal(scrambleText("04 / CAREER", 1.4, Math.random), "04 / CAREER");
  assert.notEqual(scrambleText("04 / CAREER", 0, lastGlyph), "04 / CAREER");
});

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
