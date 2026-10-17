# PORTF-08ec.1 · 08ec.3 · 08ec.4 · 08ec.5 개발 가이드

- 대상 이슈: PORTF-08ec.1(결정에 검토한 대안), PORTF-08ec.3(결제 재시도 결정의 회고 순서), PORTF-08ec.4(이메일 복사), PORTF-08ec.5(읽기 진행 막대)
- 제외: PORTF-08ec.2(한계 한 줄) — 확정 결정 2로 abandoned. 키는 브랜치 이름에 남아 있지만 이 가이드 범위가 아니다.
- 작성 시각: 2026-10-17T03:05:06Z
- 코드 작성 전 필독: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`(복사 버튼을 client 컴포넌트로 분리), `11-css.md`(전역 CSS). Next.js 16.3.4는 학습 데이터와 다르다(AGENTS.md).

## 요구

| id | 문장(검증 가능) | 근거 |
|---|---|---|
| R1 | `Project`의 decision 항목에 선택 필드 `alternative?: string`(검토한 대안), `rejectedBecause?: string`(고르지 않은 이유)이 있다. 두 필드 모두 생략할 수 있다. | 08ec.1 작업 범위 1 |
| R2 | 사례 상세 `02 / DECISIONS`는 `alternative`가 있을 때만 대안 블록을 렌더하고, `rejectedBecause`도 값이 있을 때만 그 줄을 렌더한다. | 08ec.1 작업 범위 2 |
| R3 | 값은 `platform-operations`의 "React 화면을 유지하며 백엔드 이관" 결정 1건에만 채운다. `alternative` = "외주 Next.js·MongoDB 백엔드 유지", `rejectedBecause` = 기존 challenge 문장 "사내에서는 이미 Spring Boot를 쓰고 있었고 백엔드 개발자는 2명이라, 별도 스택을 계속 유지하기 어려웠습니다." 를 그대로 인용한다. | 확정 결정 1 |
| R4 | 값이 없는 결정의 렌더 결과(DOM)는 지금과 같다. | 08ec.1 인수조건 2 |
| R5 | `/print`는 새 필드를 렌더하지 않는다. AI 답변 원본 `publicKnowledge`는 `projects` 전체를 직렬화하므로 별도 코드 없이 새 필드가 들어간다. | 08ec.1 인수조건 3, 확정 결정 5 |
| R6 | payments의 "@Retryable이 실행되지 않는 원인 추적" 결정 본문이 `증상: … 재현: … 원인: … 수정: …` 순서로 읽힌다. 문장은 기존 공개 문장(본문·`problem`·`retryPath`)에서만 가져온다. | 08ec.3 작업 범위 1, 인수조건 1 |
| R7 | "재발 방지" 표제는 넣지 않는다. "가설" 단계도 근거 문장이 없으므로 넣지 않는다. | 확정 결정 4, 08ec.3 인수조건 1·2 |
| R8 | 결정 제목·`retryPath.before/after.note`·`link` 인용 문장은 재배열 후에도 본문에 그대로 남고, `RetryPath`의 이전 → 변경 후 순서가 원인 → 수정 순서와 맞는다. | 08ec.3 작업 범위 2 |
| R9 | 홈 카드(제목 `highlight`)·`/print`·`publicKnowledge`가 같은 데이터를 쓰며 `npm test`가 통과한다. | 08ec.3 인수조건 3 |
| R10 | 홈 `05 / CONTACT`의 `a.contact-email` 옆과 사례 하단 `.case-contact` 이메일 옆에 [복사] 버튼이 하나씩 있다. 기존 `mailto:` 링크는 그대로 남는다. | 확정 결정 3, 08ec.4 작업 범위 1 |
| R11 | 클릭과 키보드(Enter/Space) 모두로 주소가 복사되고, 직후 "복사됨"이 보인다. | 08ec.4 인수조건 1 |
| R12 | "복사됨" 안내는 `aria-live="polite"` 영역으로 전달된다. | 08ec.4 작업 범위 2, 확정 결정 3 |
| R13 | Clipboard API가 없거나 `writeText`가 실패하면 `mailto:` 주소로 이동한다(기존 링크 동작과 같은 결과). | 08ec.4 인수조건 2 |
| R14 | `prefers-reduced-motion: reduce`에서는 "복사됨" 표시에 애니메이션이 없다. | 08ec.4 인수조건 3 |
| R15 | aside 브라우저로 데스크톱 너비와 모바일 너비(프록시+iframe)에서 복사·"복사됨"을 확인한다. | 08ec.4 인수조건 4, 확정 결정 6 |
| R16 | 사례 상세 상단에 읽기 진행 막대가 있고, CSS `animation-timeline: scroll()`로 구현한다(JS 없음). | 08ec.5 작업 범위 1 |
| R17 | 막대는 `@supports (animation-timeline: scroll())` 안에서만 보이며, 미지원 브라우저에서는 `display:none`이라 레이아웃에 영향이 없다. | 08ec.5 인수조건 1 |
| R18 | `prefers-reduced-motion: reduce`에서는 막대를 표시하지 않는다. | 08ec.5 인수조건 2 |
| R19 | caniuse 지원 현황을 아래 "설계 › 08ec.5"에 기록했다(적용 전 확인). | 08ec.5 인수조건 3 |
| R20 | 홈 Lighthouse 모바일 성능 점수가 81 이상이다(기준: 2026-10-10, Lighthouse 13.5, 로컬 `next start`, 3회 중앙값). | 08ec.5 인수조건 4 |

## 범위 밖

- PORTF-08ec.2(한계 한 줄) 전체 — 확정 결정 2. 약점·한계·미측정 면책 문장은 어디에도 쓰지 않는다(확정 결정 6).
- `/print`에 검토한 대안 표시 — 확정 결정 5(build-pdf 7쪽 넘침 검사).
- 수리엔 이관 외 결정(A/S 정산, CS Agent, 링커 Redis 등)에 대안 값 채우기 — 확정 결정 1.
- 08ec.1에서 맥락·결과 등 두 필드 외의 새 필드.
- 08ec.3에서 "재발 방지"·"가설" 신설, 다른 결정·다른 사례 재배열, `challenge`·`outcome` 수정(현재 문장이 회고 순서와 충돌하지 않으므로 손대지 않는다).
- 08ec.4에서 `mailto:` 링크 제거·대체, 두 곳(홈 CONTACT 대표 이메일, `.case-contact`) 외 복사 버튼(`contact-links`의 "이메일" 링크, `/print` 포함).
- 08ec.5에서 사례 상세 외 페이지의 진행 막대, JS 기반 대체 구현.

## 설계

### 08ec.1 — 결정의 검토한 대안 (`src/data/portfolio.ts`, `src/app/projects/[slug]/page.tsx`, `src/app/globals.css`)

- 타입: `Project.decisions`를 `{ title: string; body: string; alternative?: string; rejectedBecause?: string }[]`로 넓힌다. 기존 인라인 타입 표기 방식을 따른다(별도 타입 추출은 하지 않는다).
- 데이터: `platform-operations`의 첫 결정에만 R3 값 두 개를 넣는다. `rejectedBecause`는 `challenge` 문자열의 부분 문자열이어야 한다(새 문장 금지를 테스트로 고정). 소스 표기는 `rejectedBecause: "사내에서는 …"`(콜론 뒤 공백 하나, 큰따옴표)로 쓴다 — D5 위반 주입 프로브가 이 토큰을 찾는다.
- 렌더: 상세 페이지 decisions 루프에서 `<p>{d.body}</p>` 바로 뒤, 시각물(`RetryPath`·`UploadFlow`) 앞에 둔다.

  ```tsx
  {d.alternative && (
    <dl className="decision-alternative">
      <div><dt>검토한 대안</dt><dd>{d.alternative}</dd></div>
      {d.rejectedBecause && <div><dt>고르지 않은 이유</dt><dd>{d.rejectedBecause}</dd></div>}
    </dl>
  )}
  ```

  값이 없으면 아무 노드도 만들지 않으므로 R4가 성립한다. 서버 컴포넌트 그대로 둔다.
- 스타일: `globals.css`의 `.decisions` 블록(약 1530~1545행, 반응형 2129~2138·2418~2420행) 옆에 `.decision-alternative`를 추가한다. 기존 `project-facts`(`dl > div > dt/dd`) 표기 관례를 따른다.
- `/print`(`src/app/print/page.tsx`)는 수정하지 않는다. `d.title`/`d.body`만 쓰므로 새 필드는 자동으로 빠진다. `publicKnowledge`(`portfolio.ts` 193행 부근)는 `JSON.stringify(projects)`라 자동 반영된다 — `tests/chat.test.ts`가 깨지지 않는지만 확인한다.
- 테스트(`tests/content.test.ts`, 기존 패턴 그대로 데이터 문자열 정합성 검사): 이름이 `decision alternative`로 시작하는 테스트 **2개**로 나눈다(D2가 이름 단위로 통과 건수를 센다).
  - 대안 값이 있는 결정은 `platform-operations`의 "React 화면을 유지하며 백엔드 이관" 하나뿐이다.
  - 그 `rejectedBecause`는 `challenge`에 그대로 들어 있고, `alternative`·`rejectedBecause`가 `publicKnowledge`에 들어 있다(R5).

### 08ec.3 — 재시도 결정의 회고 순서 (`src/data/portfolio.ts`, `tests/content.test.ts`)

- 결정 제목 "@Retryable이 실행되지 않는 원인 추적"은 유지한다 → `retryPath.decision`, `payments.highlight`(홈 카드), 기존 테스트가 그대로 맞는다. `src/lib/retry-path.ts`, `src/components/retry-path.tsx`는 수정하지 않는다.
- 본문은 표제를 문장 앞 접두어로 붙여 하나의 문자열로 유지한다(새 필드·새 렌더 없음 → 홈·상세·`/print`·`publicKnowledge`가 같은 문자열을 공유). 목표 문안(모든 구절이 기존 공개 문장에서 온다):

  > 증상: Apple Verify API 재시도가 실행되지 않았습니다. 재현: 테스트 코드로 재현해 확인했습니다(2022.06~08). 원인: 같은 객체 내부 호출로 Spring AOP 프록시를 거치지 않는 문제였습니다. 수정: 검증 로직을 별도 Bean으로 분리해 프록시 경유 호출로 바꾸고 재시도와 환불 상태 동기화가 동작하도록 수정했습니다.

  - 증상 문장 출처: `payments.problem`("Apple 환불 검증에서 재시도가 실행되지 않아…")과 기존 본문의 "Apple Verify API 재시도".
  - 원인 문장은 `retryPath.before.note`("같은 객체 내부 호출로 Spring AOP 프록시를 거치지 않는 문제")를, 수정 문장은 `retryPath.after.note` 전체를 글자 그대로 포함한다(`link` 두 개도 포함됨).
- 시각물 정합: `RetryPath`는 "이전(재시도 미실행) → 변경 후(재시도 동작)"이므로 원인 → 수정 순서와 맞다. 시각물 변경 없음.
- 테스트: 이름이 `retry decision`으로 시작하는 테스트를 추가하고 다음을 검사한다 — 본문에서 `증상:` < `재현:` < `원인:` < `수정:` 순으로 나타나고, `재발 방지`·`가설`이 없으며, 재배열된 본문이 `publicKnowledge`에 들어 있다(R9). 기존 "retry path notes quote…" 테스트는 그대로 통과해야 한다(D3는 `✔ retry` 통과 건수 2 이상).
- `/print` 문장 길이가 약 10자 늘어난다 → build-pdf 넘침 검사를 사람이 확인한다(DoD D13).

### 08ec.4 — 이메일 복사 (`src/lib/copy-email.ts`, `src/components/copy-email.tsx`, `src/app/page.tsx`, `src/app/projects/[slug]/page.tsx`, `src/app/globals.css`, `tests/copy-email.test.ts`)

- 순수 로직 `src/lib/copy-email.ts`(React·브라우저 전역 의존 없음, 테스트에서 import):

  ```ts
  export type CopyDeps = { writeText?: (text: string) => Promise<void>; openMailto: (href: string) => void };
  export async function copyEmail(email: string, deps: CopyDeps): Promise<"copied" | "mailto">
  ```

  `writeText`가 없거나 reject하면 `openMailto("mailto:" + email)`를 부르고 `"mailto"`를 돌려준다. 성공이면 `"copied"`.
- client 컴포넌트 `src/components/copy-email.tsx`(`"use client"`, 기존 `retry-path.tsx`·`answer-preview.tsx`처럼 서버 페이지가 import):
  - `<button type="button">복사</button>` — 네이티브 버튼이라 Enter/Space가 기본으로 click을 낸다(R11). `aria-label`은 "이메일 주소 복사".
  - 옆에 항상 렌더되는 `<span className="copy-email-status" aria-live="polite">`에 성공 시 "복사됨"을 넣고 2초 뒤 비운다. 재클릭 시 타이머를 다시 건다. 언마운트 시 타이머 정리.
  - deps는 `navigator.clipboard?.writeText.bind(navigator.clipboard)`와 `(href) => { window.location.href = href; }`.
  - props: `{ email: string }`. 서버 페이지에서 `profile.email`을 넘긴다.
- 배치: 홈은 `a.contact-email` 바로 뒤, 사례 상세는 `.case-contact`의 `a.text-link` 바로 뒤. 링크 마크업은 바꾸지 않는다.
- 스타일: `.copy-email`, `.copy-email-status`를 `.case-contact`(약 1603행) 근처에 추가. "복사됨"은 애니메이션·전환 없이 글자만 바꾼다 — reduced-motion에서도 움직임이 없으므로 R14가 설계로 성립하고, `copy-email` 규칙에 `animation`/`transition`이 없음을 D15로 확인한다.
- 아이콘은 쓰지 않는다(텍스트 버튼). `src/components/icons.tsx`는 건드리지 않는다.

### 08ec.5 — 읽기 진행 막대 (`src/app/projects/[slug]/page.tsx`, `src/app/globals.css`)

- caniuse 확인 기록(2026-10-17, https://caniuse.com/mdn-css_properties_animation-timeline_scroll): Chrome 115+, Edge 115+, Safari 26.0+, Safari iOS 26.0+, Samsung Internet 23+, Firefox 161+. 전역 사용률 87.84%. 같은 내용을 CSS 주석 한 줄로도 남긴다.
- 마크업: 상세 페이지 반환 JSX 맨 앞에 `<div className="read-progress" aria-hidden="true" />` 하나. JS 없음(서버 컴포넌트 유지).
- CSS(관례: 모션은 `prefers-reduced-motion: no-preference` 안에서만; `@supports`는 이 파일 첫 사용):

  ```css
  .read-progress { display:none; }
  @supports (animation-timeline: scroll()) {
    @media (prefers-reduced-motion: no-preference) {
      .read-progress { display:block; position:fixed; inset:0 0 auto 0; height:3px; transform-origin:0 50%;
        transform:scaleX(0); animation:read-progress linear both; animation-timeline:scroll(root block);
        pointer-events:none; z-index:/* nav 위 */; background:/* 기존 강조색 토큰 */; }
    }
  }
  @keyframes read-progress { to { transform:scaleX(1); } }
  html[data-motion="paused"] .read-progress { display:none; }
  ```

  `position:fixed` + `transform`만 쓰므로 레이아웃 이동(CLS)이 없다. 사이트 전체 일시정지(`data-motion="paused"`)에서도 숨기는 것은 기존 일시정지 관례에 맞춘 설계 선택이다.
- 홈에는 아무것도 추가되지 않으므로 홈 Lighthouse 영향은 CSS 바이트 증가분뿐이다. 측정은 기준과 같은 방법으로 한다.

## 작업 항목

레인 1개(`case-polish`). 네 이슈가 `portfolio.ts`·상세 `page.tsx`·`globals.css`를 함께 고치므로 레인을 나누면 같은 파일을 동시에 고치게 된다. 작업량도 작다.

순서와 경계:

1. 데이터(08ec.1·08ec.3): `portfolio.ts` 타입 확장과 값 → `content.test.ts` 새 테스트 2개. **경계:** 데이터 쪽이 `decisions[i].alternative/rejectedBecause`를 제공하고, 상세 페이지 렌더가 이를 읽는다. `publicKnowledge`는 자동으로 받는다. `/print`는 받지 않는다.
2. 렌더(08ec.1): 상세 페이지 `dl.decision-alternative` + CSS.
3. 복사(08ec.4): `lib/copy-email.ts` → `tests/copy-email.test.ts`(성공 1, 미지원 1, 실패 1 이상) → `components/copy-email.tsx` → 두 페이지에 배치 + CSS. **경계:** 서버 페이지가 `<CopyEmail email={profile.email} />`를 부르고, client 컴포넌트가 `copyEmail()`을 부른다.
4. 진행 막대(08ec.5): 상세 페이지 `div.read-progress` + CSS(`@supports`).
5. 검증: `npm test`·`typecheck`·`lint`·`build` → `next start`로 aside E2E(데스크톱·모바일), build-pdf, 홈 Lighthouse.

## DoD

| id | 확인할 것 | 프로브 명령 | 기대 | 사람 확인 |
|---|---|---|---|---|
| D1 | 전체 단위 테스트 통과(기존 22 + 새 4 이상) | `npm test 2>&1 \| awk '/^# pass/{p=$3} /^# fail/{f=$3} END{print p; exit (f!=0)}'` | 숫자 한 줄, 26 이상 | 아니오 |
| D2 | 대안 값은 이관 결정 1건뿐, 이유는 challenge 인용, 두 값이 `publicKnowledge`에 들어감 | `npx tsx --test --test-reporter=spec tests/content.test.ts 2>&1 \| grep -cE "✔ decision alternative"` | 숫자 한 줄, 2 이상 | 아니오 |
| D3 | 재시도 결정이 증상→재현→원인→수정 순, 재발 방지·가설 없음, 본문이 `publicKnowledge`에 들어감(기존 retry path 인용 테스트 포함) | `npx tsx --test --test-reporter=spec tests/content.test.ts 2>&1 \| grep -cE "✔ retry"` | 숫자 한 줄, 2 이상 | 아니오 |
| D4 | 복사 성공/미지원/실패 → mailto 대체(거부 케이스 포함) | `npx tsx --test tests/copy-email.test.ts 2>&1 \| awk …(D1과 같은 숫자 출력)` | 숫자 한 줄, 3 이상 | 아니오 |
| D5 | 지어낸 이유 문장을 주입하면 테스트가 잡는다(위반 주입) | 사이드카 D5 한 줄(사본 복구 방식, 토큰 없으면 비0 종료) | `INJECTION_FIRED` | 아니오 |
| D6 | 타입 검사 | `npm run typecheck && echo TYPECHECK_OK` | `TYPECHECK_OK` | 아니오 |
| D7 | 린트 | `npm run lint && echo LINT_OK` | `LINT_OK` | 아니오 |
| D8 | `/print`가 새 필드를 렌더하지 않는다 | `! grep -nE "alternative\|rejectedBecause" src/app/print/page.tsx && echo PRINT_CLEAN` | `PRINT_CLEAN` | 아니오 |
| D9 | 진행 막대가 `@supports`·reduced-motion 안에만 있다 | `grep -q "@supports (animation-timeline: scroll())" src/app/globals.css && grep -q "read-progress" "src/app/projects/[slug]/page.tsx" && echo PROGRESS_GUARDED` | `PROGRESS_GUARDED` | 아니오 |
| D10 | 프로덕션 빌드 | `npm run build 2>&1 \| tail -n 40` | `Compiled successfully` | 아니오 |
| D11 | aside: 데스크톱·모바일 너비에서 홈·사례 복사(클릭·Enter·Space), "복사됨" 표시와 live 영역, 클립보드 차단 시 mailto 이동, 대안 블록이 이관 결정에만 보임 | — | 모두 확인 | 예 |
| D12 | aside: 사례 상세 진행 막대가 스크롤에 따라 차고, reduced-motion·일시정지에서 숨고, 레이아웃 이동 없음(DOM·computed style로 확인) | — | 모두 확인 | 예 |
| D13 | `next start -p 3100` 후 `npm run pdf`가 넘침 오류 없이 7쪽 생성 | — | 오류 없음 | 예 |
| D14 | 홈 Lighthouse 13.5 모바일, 로컬 `next start`, 3회 중앙값 ≥ 81 | — | ≥ 81 | 예 |
| D15 | "복사됨" 표시에 애니메이션·전환이 없다(R14) | `awk '/copy-email/{f=1} f && /(animation\|transition)/{bad=1} /\}/{f=0} END{exit bad}' src/app/globals.css && echo COPY_NO_MOTION` | `COPY_NO_MOTION` | 아니오 |

> 계획 검증(Verify) 차단 3건은 메인이 반영했다: D2·D3을 이름 단위 통과 건수(spec 리포터)로 바꿈 — `--test-name-pattern`은 매치 0건도 파일 단위 "1 passed"로 잡혔다 · R5·R9의 `publicKnowledge` 반영을 테스트 단언으로 고정 · R14를 D15로 확인.

## 리스크

| 리스크 | 되돌리기 비용 | 완화 |
|---|---|---|
| 대안·이유 문장이 `publicKnowledge`를 통해 AI 답변에 노출된다. 지어낸 문장이면 공개 사실 오류가 된다. | 높음(배포·응답 기록에 남음) | 이유는 challenge 문장을 글자 그대로 인용하고 D2·D5로 고정. 대안 문구는 확정 결정 1의 문구만 쓴다. |
| 08ec.3 재배열 중 제목이나 인용 문장이 바뀌면 `RetryPath`·홈 카드·기존 테스트가 함께 어긋난다. | 중간 | 제목 유지, `retryPath` 두 note를 본문에 그대로 둔다. 기존 테스트 + D3. |
| 문장 길이 증가로 `/print`가 넘쳐 PDF 7쪽이 깨진다. | 중간(제출 PDF) | 대안은 `/print`에 넣지 않음(D8). 재배열 문안은 약 10자 증가에 그침. D13으로 확인하고, 넘치면 접두어를 짧게 하지 말고 본인에게 보고한다. |
| 클립보드 실패 시 `location.href = mailto:`가 메일 앱 없는 환경에서 아무 반응이 없을 수 있다. | 낮음 | 이슈 인수조건대로 mailto 대체를 따르고, 링크 텍스트는 그대로 남아 직접 선택 복사가 가능하다. |
| 진행 막대가 nav와 겹치거나 미지원 브라우저에서 빈 공간을 만든다. | 낮음 | 기본 `display:none`, `position:fixed`·`transform`만 사용, `pointer-events:none`. D12. |
| 홈 Lighthouse 하락. | 낮음 | 홈에는 마크업·JS 추가 없음(CSS 몇 줄). D14에서 81 미만이면 원인을 기록하고 보고한다. |
| 브랜치의 기존 미커밋 변경(`.gitignore`, `.caseworker/`, `.claude/`)과 `next dev`가 다시 쓰는 `AGENTS.md`가 커밋에 섞인다. | 낮음(히스토리 재작성 금지) | 커밋 시 파일을 명시해 추가한다(`git add -A` 금지). |
