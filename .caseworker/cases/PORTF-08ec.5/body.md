## 배경
사례 상세는 섹션이 여러 개라 현재 위치를 알기 어렵다. 읽기 진행 표시는 선택 사항이며 우선순위가 낮다.

## 작업 범위
- 사례 상세 상단에 읽기 진행 막대 추가(CSS `animation-timeline: scroll()` 우선 검토)

## 인수조건
- [ ] 미지원 브라우저에서는 표시하지 않는다(`@supports`) — 레이아웃이 깨지지 않는다
- [ ] `prefers-reduced-motion` 존중
- [ ] 적용 전에 브라우저 지원 현황을 caniuse로 확인해 기록한다
- [ ] 홈 Lighthouse 성능 점수가 기존 기준(81)보다 떨어지지 않는다

## 참고
- 관련 파일: src/app/projects/[slug]/page.tsx, src/app/globals.css
- 근거: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
