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

// Step-by-step playback of the process diagrams. Logs follow the published
// project text; the last frame is the static diagram shown without motion.
export const traces = {
  "report-agent": {
    title: "문제 보고 도우미",
    subtitle: "제보에서 이슈 초안까지",
    label: "제보를 구조화하고 소스를 조사해 초안을 만든 뒤 사람이 확인하는 흐름",
    steps: ["제보 구조화", "소스 조사", "초안 · 사람 확인"],
    caption: "도구 9종은 전부 읽기 전용 · 이슈는 사람이 눌러야 생성",
    frames: [
      frame(["run", "idle", "idle"], ["idle", "idle"], "▸ 제보를 화면·조작·실제·기대로 구조화", 900),
      frame(["done", "idle", "idle"], ["run", "idle"], "▸ 라우트·API·오류 코드 색인 조회", 650),
      frame(["done", "run", "idle"], ["done", "idle"], "▸ 배포 커밋의 소스를 줄 단위로 읽기", 900),
      frame(["done", "done", "idle"], ["done", "run"], "✓ 의심 위치를 서버가 다시 확인 · 없는 줄은 버림", 800),
      frame(["done", "done", "wait"], ["done", "done"], "… 초안 카드 · 사람 확인 대기", 1500),
      frame(["done", "done", "pass"], ["done", "done"], "✓ [이슈 만들기] · Jira 이슈 생성", 2200),
    ],
  },
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
  payments: {
    title: "스카이탭 결제",
    subtitle: "Apple 환불 검증 재시도",
    label: "Apple 환불 검증 재시도의 호출 구조 변경 흐름",
    steps: ["호출 Bean", "AOP Proxy", "검증 Bean"],
    caption: "검증 로직을 별도 Bean으로 분리해 프록시 경유 호출",
    frames: [
      frame(["run", "idle", "idle"], ["idle", "idle"], "▸ 환불 Webhook 수신 · 검증 메서드 호출", 800),
      frame(["done", "fail", "idle"], ["idle", "idle"], "✕ 같은 객체 내부 호출 · 프록시 미경유 · 재시도 미실행", 1600),
      frame(["done", "fail", "idle"], ["idle", "idle"], "▸ 테스트 코드로 재현해 원인 확인", 900),
      frame(["run", "idle", "idle"], ["idle", "idle"], "↻ 검증 로직을 별도 Bean으로 분리", 900),
      frame(["done", "idle", "idle"], ["run", "idle"], "▸ 프록시 경유 호출", 550),
      frame(["done", "run", "idle"], ["done", "idle"], "▸ @Retryable 재시도 적용", 700),
      frame(["done", "done", "idle"], ["done", "run"], "▸ Apple Verify API 검증", 600),
      frame(["done", "done", "pass"], ["done", "done"], "✓ 재시도와 환불 상태 동기화 동작", 2200),
    ],
  },
} satisfies Record<string, Trace>;
export type TraceId = keyof typeof traces;
