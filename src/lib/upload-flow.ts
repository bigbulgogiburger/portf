// Serial vs. thread-pool upload for the platform-operations case. Notes quote
// the published decision text; row and thread counts are illustrative only.
export const uploadFlow = {
  decision: "엑셀 대량 업로드의 비동기·병렬 처리",
  label: "엑셀 대량 업로드의 직렬 처리와 스레드 풀 병렬 처리 비교",
  rows: ["1행", "2행", "3행", "4행"],
  pool: 2,
  before: {
    tag: "이전 · 직렬 처리",
    bar: "응답 대기",
    status: "대기 시간이 행 수만큼 누적",
    note: "행마다 외부 API 응답을 기다린 뒤 다음 행을 처리하는 직렬 구조라 대기 시간이 행 수만큼 누적됐습니다.",
  },
  after: {
    tag: "변경 후 · 스레드 풀 병렬 처리",
    bar: "스레드",
    status: "행별 성공·실패와 사유를 반환",
    note: "CompletableFuture로 행별 처리를 비동기 작업으로 나누고 ExecutorService의 스레드 풀에서 병렬 실행했습니다. 동시 실행 수는 스레드 풀로 제한했습니다.",
  },
} as const;

// Time slot of each row: one after another, or in waves of `pool` rows.
export function uploadSlots(side: "before" | "after"): number[] {
  return uploadFlow.rows.map((_, i) => (side === "before" ? i : Math.floor(i / uploadFlow.pool)));
}
