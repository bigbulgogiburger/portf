# 편도훈 · Portfolio

Next.js App Router, React, TypeScript 기반의 한국어 포트폴리오입니다. Vercel에 배포하며 데이터베이스를 사용하지 않습니다.

## 실행

Node.js 22 LTS를 사용합니다.

```sh
npm ci
npm run dev -- --port 3100
```

[로컬 사이트](http://localhost:3100)

## 콘텐츠와 공개 범위

- `src/data/portfolio.ts`: 메인·상세·인쇄 페이지·AI가 공유하는 공개용 콘텐츠.
- 경력 회사명은 공개하고 고객사는 익명화했습니다. 고객사 원본 PDF·화면·내부 로그·전화번호는 저장소에 포함하지 않습니다.
- 업무 플랫폼 개발 기간·테스트 개수는 제외했습니다. CS AI Agent 도입은 소유자 확인을 반영했습니다.
- 회사별 경력은 상세 이력 기준입니다. 최신 PDF에서 여러 회사를 하나로 묶은 기간을 단일 고용 이력으로 확장하지 않았습니다.
- 카드 그래픽과 흐름은 설명용으로 직접 제작한 시각화입니다.
- 원본 성과 기준: Excel 100건 3분+ → 500건 수초, 배포 약 1시간 → 약 10분, 통합 대상 약 1만 명 무에러 전환(무중단으로 확대하지 않음).
- 페이지의 내용을 수정한 뒤 공개 PDF도 재생성합니다.

## PDF

개발 서버를 실행한 상태에서:

```sh
npm run pdf
```

Chrome을 사용해 `/print`에서 6페이지의 `public/dohoon-portfolio.pdf`를 생성합니다. 다른 포트는 `PORTFOLIO_BASE_URL`로 지정할 수 있습니다. PDF는 확인 후 커밋하는 공개용 산출물입니다.

## AI 어시스턴트

`.env.example`을 참고해 로컬 `.env.local` 또는 Vercel 환경변수를 설정합니다. 키를 저장소에 커밋하지 않습니다.

| 환경변수               | 용도                               |
| ---------------------- | ---------------------------------- |
| `OPENAI_API_KEY`       | 서버 전용 OpenAI API 키            |
| `OPENAI_MODEL`         | 기본값 `gpt-5.6-luna`              |
| `CHAT_RATE_LIMIT_ID`   | 배포된 Vercel Firewall SDK 규칙 ID |
| `NEXT_PUBLIC_SITE_URL` | 확정된 HTTPS 대표 URL, 끝에 / 제외 |

[공식 Luna 모델 문서](https://developers.openai.com/api/docs/models/gpt-5.6-luna)의 Responses API를 사용합니다. 실제 키의 모델 접근권한은 연결 후 확인해야 합니다. 키 미설정 시 HTTP 503과 준비 중 안내를 반환하며 가짜 생성 답변을 표시하지 않습니다.

- 공개된 코퍼스 전체를 서버 instructions에 넣습니다. 벡터 DB나 외부 검색은 사용하지 않습니다.
- Structured Outputs로 답변과 근거 프로젝트 ID를 받고 허용된 ID만 링크합니다.
- 사용자 메시지 800자, 최대 15개 메시지(8번째 질문까지), 입력 총 16,000자, 본문 최대 64KB, 출력 최대 1,100 토큰.
- 출력은 텍스트로 렌더링하며 임의 HTML·링크를 실행하지 않습니다.
- `store:false`, 브라우저 메모리에만 대화 유지. 앱은 질문과 응답을 로그에 남기지 않습니다.
- localhost에서는 메모리 기반 분당 10회 제한(개발용). Vercel에서는 Firewall SDK를 사용하며 규칙 ID 미설정 또는 검사 오류 시 호출을 차단합니다. 메모리 제한을 분산 배포의 제한으로 취급하지 않습니다.
- Vercel Firewall에서 SDK 조건과 전용 규칙 ID를 생성하고 IP당 10회/60초, 초과 시 차단으로 설정한 뒤 게시합니다. 지역별 제한 특성은 [Vercel 문서](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk)를 참고합니다.
- 공개 운영 전 OpenAI 프로젝트 예산 알림·사용량을 설정하고 Vercel Firewall 차단과 실제 모델 응답을 확인합니다.
- 챗봇 중단: Vercel의 `OPENAI_API_KEY`를 제거하고 재배포. 사이트와 이메일 링크는 계속 사용할 수 있습니다.

## 검증

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

브라우저 검수: 데스크톱/모바일, 프로젝트 상세 5개, 메뉴·키보드 포커스, 챗봇 연결 전 상태와 mocked API 정상 응답, PDF 다운로드, 가로 넘침, 접근성.

## Vercel 배포

1. GitHub `bigbulgogiburger/portf`를 Vercel에서 Import, Framework: Next.js, Node.js: 22.x.
2. 환경변수를 설정하고 Firewall 제한 규칙을 게시합니다. AI 키가 없어도 사이트 배포는 가능합니다.
3. 배포된 HTTPS URL을 `NEXT_PUBLIC_SITE_URL`에 넣고 재배포해 sitemap을 활성화합니다.
4. AI 실제 응답·근거 링크·요청 제한을 배포 환경에서 확인합니다.

토큰은 로컬 환경이나 Vercel에서 설정합니다. 인증 정보는 문서·소스·Git에 넣지 않습니다.
