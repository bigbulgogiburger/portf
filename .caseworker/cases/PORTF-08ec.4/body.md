## 배경
연락처 이메일은 `mailto:` 링크뿐이라 메일 앱이 없는 환경(사내 PC 등)에서는 주소를 직접 선택해 복사해야 한다. rauno.me처럼 클릭 복사와 확인 표시를 제공한다.

## 작업 범위
- 홈 `05 / CONTACT`의 이메일과 사례 하단 `case-contact` 이메일에 복사 동작 추가
- 복사 직후 "복사됨" 표시, 화면 낭독기에도 안내(aria-live)

## 인수조건
- [ ] 클릭·키보드(Enter/Space) 모두 복사되고 "복사됨"이 표시된다
- [ ] Clipboard API 실패·미지원 시 기존 `mailto:` 동작으로 돌아간다
- [ ] `prefers-reduced-motion`에서 표시 애니메이션을 줄인다
- [ ] aside 브라우저로 데스크톱·모바일 너비에서 확인한다

## 참고
- 관련 파일: src/app/page.tsx, src/app/projects/[slug]/page.tsx, src/app/globals.css
