## 배경
결제 사례의 Apple 환불 검증 재시도 문제는 원인 추적 내용이 결정 본문에 섞여 있다. 장애 회고 서술 틀(증상 → 가설 → 재현 → 원인 → 수정 → 재발 방지)로 순서를 정리하면 훑어보기 쉬워진다.

## 작업 범위
- payments 사례의 `@Retryable` 결정 본문(필요하면 challenge·outcome)을 회고 순서로 재배열
- 기존 `RetryPath` 시각물과 문장 순서가 맞는지 확인

## 인수조건
- [ ] 새 사실을 추가하지 않는다 — 기존 공개 문장의 순서·표제만 바꾼다
- [ ] "재발 방지"는 근거 문장이 있을 때만 넣고, 없으면 생략한다
- [ ] 홈 카드·인쇄본·AI 답변 원본에 같은 데이터가 반영되며 `npm test`(content.test.ts 포함) 통과

## 참고
- 관련 파일: src/data/portfolio.ts, src/components/retry-path.tsx, src/lib/retry-path.ts, tests/content.test.ts
