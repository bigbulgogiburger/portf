export type NodeState = "idle" | "run" | "done" | "fail" | "wait" | "pass";
export type WireState = "idle" | "run" | "done";
export type TraceFrame = {
  nodes: [NodeState, NodeState, NodeState];
  wires: [WireState, WireState];
  log: string;
  hold: number;
};
type Trace = {
  title: string;
  subtitle: string;
  label: string;
  steps: [string, string, string];
  caption: string;
  frames: TraceFrame[];
};
const frame = (
  nodes: TraceFrame["nodes"],
  wires: TraceFrame["wires"],
  log: string,
  hold: number,
): TraceFrame => ({ nodes, wires, log, hold });

// Step-by-step playback of the two process diagrams. Logs follow the published
// project text; the last frame is the static diagram shown without motion.
export const traces = {
  harness: {
    title: "jira-harness",
    subtitle: "코드 검증 흐름",
    label: "검증한 코드와 커밋 대상 비교 흐름",
    steps: ["테스트·리뷰", "Git tree 기록", "커밋 대상 비교"],
    caption: "차단 모드: 미검증·실패·코드 변경 시 재검증",
    frames: [
      frame(["run", "idle", "idle"], ["idle", "idle"], "▸ 테스트·리뷰 실행", 800),
      frame(["done", "idle", "idle"], ["run", "idle"], "✓ 테스트·리뷰 통과", 550),
      frame(["done", "run", "idle"], ["done", "idle"], "▸ 검증 시점 Git tree ID 기록", 800),
      frame(["done", "done", "idle"], ["done", "run"], "▸ 커밋 요청 · 커밋 대상 tree ID와 대조", 600),
      frame(["done", "done", "fail"], ["done", "done"], "✕ 검증 이후 코드 변경 감지 · 커밋 차단", 1600),
      frame(["run", "idle", "fail"], ["idle", "idle"], "↻ 재검증 · 테스트·리뷰 다시 실행", 800),
      frame(["done", "idle", "fail"], ["run", "idle"], "✓ 테스트·리뷰 통과", 500),
      frame(["done", "run", "fail"], ["done", "idle"], "▸ Git tree ID 다시 기록", 650),
      frame(["done", "done", "fail"], ["done", "run"], "▸ 커밋 대상 tree ID와 다시 대조", 550),
      frame(["done", "done", "pass"], ["done", "done"], "✓ tree ID 일치 · 커밋 진행", 2200),
    ],
  },
  "service-agent": {
    title: "CS AI Agent",
    subtitle: "신규 접수 흐름",
    label: "접수 초안 생성과 사용자 확인 후 접수 흐름",
    steps: ["권한 내 조회", "접수 초안", "확인 후 접수"],
    caption: "초안 유효시간 5분 · 등록 전 사용자 확인",
    frames: [
      frame(["run", "idle", "idle"], ["idle", "idle"], "▸ 소속 그룹 권한 범위 확인", 800),
      frame(["done", "idle", "idle"], ["run", "idle"], "✓ SELECT 전용 도구로 조회", 600),
      frame(["done", "run", "idle"], ["done", "idle"], "▸ 신규 접수 초안 작성 · 5분 유효", 900),
      frame(["done", "done", "idle"], ["done", "run"], "▸ 초안 카드 표시", 550),
      frame(["done", "done", "wait"], ["done", "done"], "… 사용자 확인 대기", 1500),
      frame(["done", "done", "pass"], ["done", "done"], "✓ [등록] 후 접수 생성", 2200),
    ],
  },
} satisfies Record<string, Trace>;
export type TraceId = keyof typeof traces;
