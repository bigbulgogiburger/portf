## 배경
사례의 `decisions[]`에는 제목과 본문뿐이라, 다른 선택지를 검토하고 버린 근거가 드러나지 않는다. Case 테마의 결정 로그(맥락 → 검토한 대안 → 선택 이유 → 결과)를 참고한다.

## 작업 범위
- `Project`의 decision 항목에 선택 필드(검토한 대안 · 고르지 않은 이유) 추가
- 사례 상세 `02 / DECISIONS`에서 값이 있을 때만 렌더
- 채울 결정 후보와 질문을 정리해 본인 확인을 받는다(예: 수리엔 Spring 통일 vs Next.js 백엔드 유지)

## 인수조건
- [ ] 문장은 편도훈 위키 원본 또는 본인 확인을 거친 것만 사용한다(지어내지 않음)
- [ ] 값이 없는 결정은 현재 화면과 동일하다
- [ ] 인쇄본(`/print`)과 AI 답변 원본(`publicKnowledge`)의 반영 여부를 결정하고 일관되게 처리한다
- [ ] `npm test` 통과

## 참고
- 관련 파일: src/data/portfolio.ts, src/app/projects/[slug]/page.tsx, src/app/print/page.tsx
