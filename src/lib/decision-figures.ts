// Small figures shown under a decision. Every label quotes that decision's
// published text (checked in tests); dot positions are illustrative.
export const batchFigure = {
  decision: "스케줄러 22개를 Batch 서버 1대로",
  label: "서비스마다 흩어진 스케줄러 22개를 Batch 서버 1대로 모으는 그림",
  count: 22,
  before: "각 서비스에 분산된 반복 작업",
  unit: "Tasklet·Step·Job",
  after: "Spring Batch 서버",
  note: "배포·테스트·실행 결과를 한곳에서 관리",
} as const;

export const settlementFigure = {
  decision: "정산 생성 시점의 금액 보관",
  label: "원본 수리 데이터가 바뀌어도 정산 테이블의 금액은 유지되는 그림",
  source: { name: "원본 수리 데이터", rows: ["부품 단가", "모델명"], status: "정산 이후 변경" },
  link: "정산 생성 시점에 보관",
  snapshot: { name: "별도 정산 테이블", rows: ["수리 건", "금액"], status: "과거 정산 내역은 유지" },
} as const;

export const draftFigure = {
  decision: "5분 동안 유효한 신규 접수 초안",
  label: "접수 초안이 사용자 확인 후 등록되거나 5분 뒤 만료되는 그림",
  minutes: 5,
  draft: "초안 카드",
  outcomes: [
    { when: "내용을 확인하고 [등록]", then: "접수가 생성됩니다", tone: "pass" },
    { when: "5분 안에 등록하지 않은 초안", then: "만료됩니다", tone: "expire" },
  ],
} as const;

export const toolsFigure = {
  decision: "쓰기 도구가 없는 에이전트",
  label: "에이전트는 읽기 전용 도구 9종만 쓰고, 이슈는 사람이 누르고 서버가 검증해야 만들어지는 그림",
  agent: { name: "에이전트의 도구", count: 9, kind: "읽기 전용", missing: "이슈를 만드는 도구", status: "프롬프트 주입이 성공해도 이슈를 만들 방법이 없습니다" },
  link: "초안",
  issue: { name: "이슈 생성", rows: [["사람", "[이슈 만들기]"], ["서버", "확인 체크·대화 소유자·최신 초안"]], status: "검증해야 만들어집니다" },
} as const;

// Scattered start and gathered end position of each scheduler dot, in the figure's 640×220 box.
export function batchDots() {
  let a = 22;
  const rand = () => {
    a = (a * 1103515245 + 12345) & 0x7fffffff;
    return a / 0x7fffffff;
  };
  return Array.from({ length: batchFigure.count }, (_, i) => ({
    from: [34 + rand() * 236, 44 + rand() * 132] as const,
    to: [452 + (i % 6) * 22, 84 + Math.floor(i / 6) * 22] as const,
  }));
}
