// Before/after call paths for the payments case. Notes quote the published decision text.
export const retryPath = {
  decision: "@Retryable이 실행되지 않는 원인 추적",
  label: "Apple 환불 검증 재시도의 호출 구조 전후 비교",
  before: {
    tag: "이전",
    bean: "동일 Bean",
    nodes: ["호출 메서드", "this.검증 메서드 · @Retryable"],
    link: "같은 객체 내부 호출",
    status: "재시도 미실행",
    note: "같은 객체 내부 호출로 Spring AOP 프록시를 거치지 않는 문제",
  },
  after: {
    tag: "변경 후",
    nodes: ["호출 Bean", "AOP Proxy", "검증 Bean · @Retryable"],
    link: "프록시 경유 호출",
    status: "재시도 동작",
    note: "검증 로직을 별도 Bean으로 분리해 프록시 경유 호출로 바꾸고 재시도와 환불 상태 동기화가 동작하도록 수정했습니다.",
  },
} as const;
