export const profile = {
  name: "편도훈", englishName: "DOHOON PYUN",
  headline: "Java·Spring 백엔드 개발자",
  email: "dohoon321@gmail.com", github: "https://github.com/bigbulgogiburger",
  description: "2021년 5월부터 결제·회원·A/S 서비스를 개발해 왔습니다. 현재 DB Inc.에서 백엔드 개발과 PM을 맡고 있으며, CS AI Agent와 AI Coding 검증 도구를 개발했습니다.",
  // First month of backend work (YYYY-MM), for the years-of-experience line.
  since: "2021-05",
};
// Whole years of experience since profile.since.
export function careerYears(now = new Date()): number {
  const [year, month] = profile.since.split("-").map(Number);
  return Math.floor((now.getFullYear() * 12 + now.getMonth() + 1 - (year * 12 + month)) / 12);
}
export type Project = {
  id: string; number: string; category: string; title: string; subtitle: string;
  // One-sentence problem shown in the case-study summary.
  problem: string;
  summary: string; role: string; period: string; status: string;
  tags: string[]; accent: string; metric: string; metricLabel: string;
  challenge: string; decisions: { title: string; body: string }[];
  outcome: string; flow: string[]; github?: string;
  // Title of the decision shown on the home card.
  highlight: string;
};
export const projects: Project[] = [
  {
    id: "platform-operations", number: "01", category: "백엔드 이관·운영 개선",
    title: "수리엔 API 이관과 배포 자동화", subtitle: "수리 매칭 플랫폼 · DB Inc.",
    problem: "외주 백엔드를 내부에서 유지보수하고 서버별 수작업 배포를 줄여야 했습니다.",
    summary: "React 화면을 유지하며 Next.js·MongoDB 백엔드를 Spring Boot·MySQL로 이관했습니다.",
    role: "백엔드 개발·PM · 데이터 모델 이관 · CI/CD·모니터링",
    period: "2023.11 – 현재", status: "개발·운영",
    tags: ["Spring Boot · JPA", "MySQL", "Jenkins · Docker", "Prometheus · Grafana", "Spring Security · JWT"], accent: "cyan",
    metric: "약 1시간 → 약 10분", metricLabel: "서버 2대 기준 · 수동 배포 약 1시간 → Jenkins 파이프라인 약 10분 (배포 기록·작업 체감)",
    challenge: "외주에서 인계한 Next.js·MongoDB 서버를 내부에서 유지보수해야 했습니다. 사내에서는 이미 Spring Boot를 쓰고 있었고 백엔드 개발자는 2명이라, 별도 스택을 계속 유지하기 어려웠습니다. 배포 때마다 SVN checkout, 파일 이동, deploy.sh 실행을 서버별로 반복하는 작업도 개선이 필요했습니다.",
    decisions: [
      { title: "React 화면을 유지하며 백엔드 이관", body: "백엔드를 Spring Boot·MySQL로 통일하기로 하고 Next.js 백엔드 API 약 50개를 이관했습니다. MongoDB 모델은 MySQL 기반 JPA Entity로 재설계하고 기존 React 화면과 연동했습니다. Internal·External·Bypass 호출 경로와 인증을 나누고, Java 11→21·Spring Boot 2.7→3.3으로 버전을 올렸습니다." },
      { title: "서버별 수작업을 배포 파이프라인으로", body: "형상관리를 SVN에서 GitLab으로 옮기고, Jenkins·Docker로 빌드·이미지 생성·배포를 자동화했습니다. 서버 2대는 1대를 먼저 배포해 헬스체크를 통과하면 나머지 1대를 배포하는 순차 무중단 방식이며, Jenkins 전환도 1대에서 먼저 검증한 뒤 전체에 적용했습니다. AWS ALB 뒤 Nginx 멀티서버를 운영하고 Prometheus·Grafana 모니터링을 구성했습니다." },
      { title: "엑셀 대량 업로드의 비동기·병렬 처리", body: "엑셀 대량 업로드는 행마다 외부 API 응답을 기다린 뒤 다음 행을 처리하는 직렬 구조라 대기 시간이 행 수만큼 누적됐습니다. CompletableFuture로 행별 처리를 비동기 작업으로 나누고 ExecutorService의 스레드 풀에서 병렬 실행했습니다. 동시 실행 수는 스레드 풀로 제한했습니다. 모든 작업의 결과를 모아 행별 성공·실패와 사유를 반환했습니다." },
    ],
    outcome: "백엔드 API 약 50개를 Spring Boot로 이관해 외주 의존을 없애고, 배포 작업을 약 1시간에서 약 10분으로 단축했습니다. Flutter 앱의 Play Store·TestFlight 배포와 Vue·React 화면 유지보수도 담당했습니다. 별도 기업 홈페이지는 React.js·Tailwind CSS로 신규 구축(2025.12)하고 2026.08 전면 개편했으며, 어드민 연동과 배포까지 맡았습니다.",
    flow: ["GitLab", "Jenkins 빌드", "Docker 이미지", "배포·모니터링"],
    highlight: "엑셀 대량 업로드의 비동기·병렬 처리",
  },
  {
    id: "payments", number: "02", category: "결제 연동·장애 분석",
    title: "스카이탭 결제·Apple 환불 연동", subtitle: "1:1 태블릿 과외 · 독립 결제 서버와 Spring AOP 오류 수정",
    problem: "Apple 환불 검증에서 재시도가 실행되지 않아 호출 구조를 확인해야 했습니다.",
    summary: "기술 스택이 다른 결제 기능을 독립 서버로 개발하고, 호출 주체별로 인증 경로를 나눴습니다.",
    role: "플랫비: 결제·환불 연동 / 교육지대: 회원·결제·모니터링",
    period: "2022.02 – 2023.11", status: "개발·운영 완료",
    tags: ["Java · Spring", "Inicis · Apple API", "Spring Retry", "Pinpoint", "PostgreSQL"], accent: "amber",
    metric: "Apple 환불 검증 재시도 복구", metricLabel: "검증 로직을 별도 Bean으로 분리해 AOP 프록시 경유 호출로 변경",
    challenge: "기존 서비스와 기술 스택이 다른 결제 기능을 개발해야 했습니다. 서버 간 요청과 사용자 요청의 인증을 분리하고, Apple 환불 결과를 서비스 DB에 반영해야 했습니다.",
    decisions: [
      { title: "Internal·External 인증 경로 분리", body: "플랫비에서 독립 결제 서버를 개발했습니다(2022.02~11). 서버 간 요청은 헤더 토큰으로, 사용자 요청은 통합회원 서버를 통해 검증하고 Inicis·Apple 결제를 연동했습니다." },
      { title: "@Retryable이 실행되지 않는 원인 추적", body: "Apple Verify API 재시도가 같은 객체 내부 호출로 Spring AOP 프록시를 거치지 않는 문제를 테스트 코드로 재현해 확인했습니다(2022.06~08). 검증 로직을 별도 Bean으로 분리해 프록시 경유 호출로 바꾸고 재시도와 환불 상태 동기화가 동작하도록 수정했습니다." },
      { title: "회원 연동과 운영 모니터링", body: "교육지대에서는 족보닷컴 통합회원 체계에 맞춰 스카이탭 가입·로그인·결제를 연결했습니다(2023.02~06). Actuator·Micrometer·Prometheus·Grafana로 지표를 수집·시각화하고 Pinpoint로 호출 경로와 병목을 추적하도록 구성했습니다(2023.03~05)." },
    ],
    outcome: "서비스 본체와 API로 연동하는 결제 서버를 운영하며, Spring AOP 자기 호출로 동작하지 않던 Apple 환불 검증 재시도를 복구했습니다. 이후 교육지대에서는 회원 연동과 운영 모니터링을 추가로 담당했습니다.",
    flow: ["환불 Webhook", "호출 Bean", "AOP Proxy", "검증 Bean", "DB 반영"],
    highlight: "@Retryable이 실행되지 않는 원인 추적",
  },
  {
    id: "field-service", number: "03", category: "업무 시스템 설계·구현",
    title: "전동공구 A/S 관리 플랫폼", subtitle: "글로벌 전동공구 브랜드 · DB Inc.",
    problem: "같은 ‘고객’으로 불리던 조직·수리 접수자·거래처의 데이터와 권한을 구분해야 했습니다.",
    summary: "고객사와 업무 주체·권한·정산 규칙을 협의하고, 접수부터 정산까지의 DB·API·화면을 개발하고 있습니다.",
    role: "요구사항 협의(수리엔 담당자와 함께) · 도메인·DB 설계부터 백엔드·화면·QA·배포까지 1인 담당",
    period: "2026.05 – 현재", status: "개발·검증 중",
    tags: ["Java 21", "Spring Boot 3.3", "JPA · QueryDSL", "MySQL", "Vue 3"], accent: "cyan",
    metric: "업무 주체·권한·정산 기준 설계", metricLabel: "고객사와 협의한 설계 기준 · 개발·검증 중",
    challenge: "화면 와이어프레임을 실제 A/S 업무 시스템으로 옮겨야 했습니다. 같은 ‘고객’이라는 표현에 시스템을 쓰는 조직, 수리를 맡기는 사람, B2B 거래 주체가 섞여 있었습니다. 데이터 모델과 조회·수정 권한부터 구분해야 했습니다.",
    decisions: [
      { title: "고객사·수리 고객·B2B 거래처 구분", body: "고객사는 시스템 사용 조직, 고객은 수리 접수자, 거래처는 B2B 거래 주체로 정의했습니다. 각 주체의 데이터와 역할별 접근 범위를 나누고 백엔드 권한 검사에 반영했습니다." },
      { title: "접수·수리·정산의 상태와 API 구현", body: "접수부터 배정, 진단·견적, 승인·입금·자재, 수리, 완료, 정산까지 단계별 처리 주체와 예외 조건을 검토했습니다. 업무 흐름을 상태 모델로 설계하고 Java·Spring 서버와 Vue 화면으로 구현하고 있습니다." },
      { title: "정산 생성 시점의 금액 보관", body: "정산 이후 부품 단가나 모델명이 바뀌어도 과거 정산 내역은 유지돼야 했습니다. 고객사 담당자와 화면을 보며 협의해 수리 건과 금액을 별도 정산 테이블에 보관하고, 원본 수리 데이터와 독립적으로 관리하는 설계에 합의했습니다. 본사 SAP 업로드용 CSV 규격도 함께 협의했습니다." },
    ],
    outcome: "정산 시점 데이터의 별도 보관 방식과 본사 SAP 업로드용 CSV 규격을 고객사와 협의했습니다. 도메인·DB 설계, 서버·화면 개발과 QA·배포를 담당하며, 도메인별 개발 가이드와 검증 기록을 남기고 추가 요구사항을 반영하고 있습니다. 개발에는 직접 만든 jira-harness를 사용합니다.",
    flow: ["접수", "배정", "진단·견적", "승인·입금·자재", "수리", "완료", "정산"],
    highlight: "정산 생성 시점의 금액 보관",
  },
  {
    id: "membership", number: "04", category: "회원 연동·배치",
    title: "링커 통합회원·Redis Q&A", subtitle: "입시 정보·멘토링 서비스 · 법인 합병 이후에도 이어진 개발·운영",
    problem: "링커·모지의 회원 DB를 직접 공유할 수 없는 환경에서 회원·Q&A를 연동해야 했습니다.",
    summary: "AWS SNS로 회원 변경을 서비스별 DB에 반영하고, Redis 매핑으로 통합 Q&A를 구현했습니다.",
    role: "링커·플랫비·교육지대 / 백엔드 개발·운영", period: "2021.05 – 2023.09", status: "개발·운영 완료",
    tags: ["AWS SNS", "Redis", "Spring Batch", "MySQL", "MyBatis"], accent: "pink",
    metric: "통합회원 약 1만 명 전환 완료", metricLabel: "DB 집계 기준 · AWS SNS 이벤트로 서비스별 회원 DB에 반영",
    challenge: "링커·모지의 회원 DB를 직접 공유할 수 없는 제약에서 회원 연동과 통합 Q&A를 제공해야 했습니다. 법인 합병으로 소속이 변경된 뒤에도 링커 서비스 개발을 계속 담당했습니다.",
    decisions: [
      { title: "회원 이벤트 규약과 전환 순서 조율", body: "AWS SNS Topic에 가입·전환·정보 변경 이벤트를 게시하고 각 서비스가 구독해 DB에 반영하도록 구현했습니다(2022.04~08). 관련 팀과 이벤트 규약·전환 순서를 협의하고 DB 플래그로 중복 처리를 방지했습니다." },
      { title: "회원번호·관심 정보를 Redis에 매핑", body: "기존 회원 RDB 스키마를 바꾸지 않고 회원번호·관심 학과·대학 정보를 Redis에 매핑해 통합 Q&A를 구현했습니다(2021.10~2022.02). 11월~2월 약 1,000건의 질문을 처리했습니다." },
      { title: "스케줄러 22개를 Batch 서버 1대로", body: "각 서비스에 분산된 반복 작업을 Tasklet·Step·Job으로 구성하고 Spring Batch 서버로 통합했습니다(2021.09~11). 배포·테스트·실행 결과를 한곳에서 관리하도록 변경했습니다." },
      { title: "Apple 탈퇴 연동과 앱 심사 대응", body: "회원 탈퇴 시 Apple 토큰 revoke와 Webhook을 연결하고, 통신 실패에는 Retry를 적용했습니다. 기존 회원 토큰은 스케줄러로 처리해 앱 업데이트 심사에 대응했습니다." },
    ],
    outcome: "통합회원 약 1만 명 전환 완료, 기존 회원 DB 스키마 변경 없는 Q&A 구현, 스케줄러 22개의 배치 서버 통합, Apple 탈퇴 연동을 수행했습니다. 각 작업은 링커 재직과 합병 이후의 서비스 담당 기간에 걸쳐 진행했습니다.",
    flow: ["회원 변경", "AWS SNS", "서비스별 구독", "자체 DB 반영"],
    highlight: "회원 이벤트 규약과 전환 순서 조율",
  },
  {
    id: "service-agent", number: "05", category: "AI 업무 연동",
    title: "수리엔 CS AI Agent", subtitle: "접수·현황·정산 조회와 신규 접수 초안",
    problem: "반복 조회를 줄이면서 조회 권한과 사용자 확인 후 접수 등록 절차를 지켜야 했습니다.",
    summary: "여러 화면에서 찾던 운영 정보를 대화로 조회하고, 신규 접수는 사람이 초안을 확인해 등록하도록 구현했습니다.",
    role: "Python·FastAPI 도구 호출 서비스 · 업무 API·권한 검사 연동 · QA 배포·운영 도입",
    period: "2026.07 – 2026.09", status: "개발·운영 도입",
    tags: ["Python · FastAPI", "LLM API", "Tool-calling", "SELECT 전용 도구", "백엔드 인증·인가"], accent: "lime",
    metric: "2026.09 운영 환경 도입", metricLabel: "2026.07 QA 배포 · 현업이 조회와 접수 초안·등록에 사용",
    challenge: "운영자가 접수·현황·정산 정보를 여러 화면에서 반복해서 조회했습니다. 자연어 조회를 제공하면서 소속 그룹의 데이터 범위를 지키고, 모델의 응답만으로 접수가 생성되지 않도록 해야 했습니다.",
    decisions: [
      { title: "허용 도구와 SELECT 전용 SQL", body: "Python·FastAPI로 도구 호출 서비스를 작성해 기존 업무 API를 자연어로 조회하도록 연결했습니다. LLM은 허용된 도구 목록에서만 도구를 선택하며, 「어제 들어온 미배정 건 보여줘」 「이번 달 고객사 정산 현황 보여줘」 같은 질문을 처리합니다. SQL 조회 도구는 SELECT만 허용하고 테넌트 조건을 강제했습니다." },
      { title: "소속 그룹의 데이터 범위 검사", body: "도구 호출마다 사용자와 소속 그룹의 권한을 백엔드에서 검사합니다. 운영자는 소속 그룹, 관리자는 전체 데이터를 조회하며, 모델에 전달하는 지시문과 별도로 실제 조회 가능한 범위를 제한했습니다." },
      { title: "5분 동안 유효한 신규 접수 초안", body: "Agent가 작성한 초안 카드에서 사용자가 내용을 확인하고 [등록]을 눌러야 접수가 생성됩니다. 5분 안에 등록하지 않은 초안은 만료됩니다. 배정·정보 변경·결제 승인 요청은 Agent가 실행하지 않고 해당 화면으로 안내합니다." },
    ],
    outcome: "CS AI Agent를 개발해 2026년 7월 QA 환경에 배포하고, 2026년 9월 운영 환경에 도입해 현업이 실제 업무에 사용하고 있습니다. 조회와 접수 초안·등록 절차를 설명한 사용 매뉴얼도 작성했습니다. QA 기간에는 매뉴얼의 질문 예시로 현업이 직접 테스트하도록 하고, 배정·변경·승인·발송 요청은 거절하는 것이 정상 동작임을 명시했습니다.",
    flow: ["자연어 요청", "권한 내 조회", "접수 초안", "확인 후 접수"],
    highlight: "소속 그룹의 데이터 범위 검사",
  },
  {
    id: "harness", number: "06", category: "오픈소스 · AI CODING",
    title: "jira-harness", subtitle: "Claude Code 개발·검증 플러그인",
    problem: "검증 후 코드가 바뀌어도 이전 테스트·리뷰 결과로 커밋될 수 있었습니다.",
    summary: "차단 모드에서는 검증 기록과 커밋 대상을 대조해, 검증 이후 코드가 바뀌면 커밋을 막고 재검증하게 합니다.",
    role: "플러그인 설계·개발 · MIT 라이선스 공개", period: "2026", status: "공개",
    tags: ["Claude Code hooks", "JavaScript", "Node.js", "Git"], accent: "violet",
    metric: "전동공구 A/S 개발에 사용 중", metricLabel: "개인 오픈소스 · MIT 라이선스 공개",
    challenge: "AI가 코드를 수정한 뒤 이전 테스트·리뷰 결과를 그대로 사용하면 현재 변경분이 검증되지 않은 채 커밋될 수 있습니다. 검증 기록과 코드 상태를 함께 확인할 장치가 필요했습니다.",
    decisions: [
      { title: "계획·구현·검증 절차를 워크플로로 구성", body: "Jira 이슈의 계획과 구현, 리뷰·검증 흐름을 Claude Code 플러그인으로 구성했습니다. 모델은 계획·구현·리뷰를, 스크립트는 상태와 검증 결과의 JSON 기록을, 훅은 커밋·푸시 직전 판정을 맡도록 역할을 나눴습니다." },
      { title: "검증 시점의 Git tree ID 기록", body: "테스트·리뷰 시점의 Git tree ID와 검증 결과·로그 SHA-256·리뷰 기록을 저장하고, Claude Code의 PreToolUse 훅에서 커밋 대상과 대조합니다. 차단 모드에서 검증 미실행·실패 또는 검증 이후 코드 변경을 감지하면 커밋을 막고 재검증하도록 구성했습니다." },
      { title: "프로젝트별 검증 명령과 정책 분리", body: "프로젝트의 빌드·테스트 명령과 브랜치 정책을 설정으로 분리하고, push에는 전체 빌드·테스트를 요구합니다. 차단 범위는 프로젝트 설정과 브랜치 정책을 따르며 문서 변경은 예외로 둡니다. 차단 조건과 예외는 공개 저장소의 코드와 문서에서 확인할 수 있습니다." },
    ],
    outcome: "Claude Code 플러그인을 MIT 라이선스로 공개하고, 현재 전동공구 A/S 플랫폼 개발에 사용하고 있습니다. 검증 기록과 커밋 대상의 코드 상태를 대조해, 차단 모드에서 검증 미실행·실패·코드 변경을 감지하면 커밋을 막습니다.",
    flow: ["구현", "테스트·리뷰", "tree ID 기록", "커밋 대상 대조"],
    highlight: "검증 시점의 Git tree ID 기록",
    github: "https://github.com/bigbulgogiburger/jira-harness",
  },
];
export const career = [
  { period: "2023.11 — 현재", company: "DB Inc.", role: "백엔드 개발 · PM", body: "수리엔 백엔드 이관·운영, 배포 자동화, React.js 기업 홈페이지 구축·개편, CS AI Agent 개발·운영 도입. 현재 전동공구 A/S 플랫폼의 DB·API·화면 개발과 고객사 요구사항 협의(수리엔 담당자와 함께) 담당." },
  { period: "2021.05 — 2023.11", company: "교육지대(주)", role: "서버 개발자", note: "주식회사 링커 → 플랫비 주식회사 → 교육지대(주) 법인 합병 승계, 연속 재직", body: "입시 정보·멘토링 서비스 백엔드와 링커 통합회원·Q&A, Spring Batch 통합, 스카이탭 독립 결제 서버와 Inicis·Apple 연동, 회원·로그인 기능, Prometheus·Grafana·Pinpoint 모니터링 구축." },
];
export const education = { school: "경희대학교", major: "유전공학과 학사", period: "2009.03 – 2014.02" };
export const certifications = [
  { name: "ADsP", date: "2020.12" },
  { name: "SQLD", date: "2020.12" },
  { name: "NCA", date: "2025.12" },
];
export type Skill = { name: string; where?: string };
export const capabilities: { title: string; caption: string; skills: Skill[] }[] = [
  { title: "Backend", caption: "A/S 도메인 · 회원·결제 연동", skills: [
    { name: "Java · Spring Boot", where: "A/S 플랫폼 · 수리엔 · 스카이탭" },
    { name: "JPA · QueryDSL", where: "A/S 플랫폼 · 수리엔 이관" },
    { name: "Spring Retry · AOP", where: "스카이탭 결제" },
    { name: "Spring Batch", where: "링커 스케줄러 통합" },
    { name: "MySQL", where: "A/S 플랫폼 · 수리엔 · 링커" },
    { name: "Redis", where: "링커 통합 Q&A" },
    { name: "MongoDB → MySQL", where: "수리엔 데이터 이관" },
    { name: "MyBatis", where: "링커" },
    { name: "PostgreSQL", where: "스카이탭" },
    { name: "Spring Security · JWT", where: "수리엔 이관" },
  ] },
  { title: "Applied AI", caption: "CS Agent · 개발 결과 검증", skills: [
    { name: "Python · FastAPI", where: "CS AI Agent" },
    { name: "LLM API · Tool-calling", where: "CS AI Agent" },
    { name: "업무 도구·백엔드 권한 통제", where: "CS AI Agent" },
    { name: "Claude Code · jira-harness", where: "jira-harness" },
    { name: "Git tree 기반 검증 기록", where: "jira-harness" },
  ] },
  { title: "Delivery & Operations", caption: "배포 자동화 · 지표·요청 추적", skills: [
    { name: "AWS · Nginx", where: "수리엔 운영" },
    { name: "GitLab · Jenkins · Docker", where: "수리엔 배포 자동화" },
    { name: "Prometheus · Grafana", where: "수리엔 · 스카이탭" },
    { name: "Pinpoint", where: "스카이탭" },
    { name: "AWS SNS", where: "링커 통합회원" },
  ] },
  { title: "Frontend & Tools", caption: "화면 개발·유지보수 · 결제 연동", skills: [
    { name: "Vue 3", where: "A/S 플랫폼 · 수리엔" },
    { name: "React · Next.js", where: "수리엔 홈페이지 구축·개편 · 이관 원본" },
    { name: "Flutter 앱 배포", where: "수리엔 Play Store·TestFlight" },
    { name: "JavaScript · Node.js", where: "jira-harness" },
    { name: "Inicis · Apple 결제 API", where: "스카이탭" },
  ] },
];
// Result heading by delivery stage: in-progress work is not presented as an outcome.
export function resultLabel(p: Project): { en: string; ko: string } {
  if (p.status.endsWith("중")) return { en: "CURRENT SCOPE", ko: "현재 범위" };
  return { en: "RESULT", ko: "성과" };
}
// Reviewed public facts, shared by the site and its assistant.
export const publicKnowledge = JSON.stringify({ profile, career, education, certifications, projects, capabilities });
// Example exchange on the home page, quoted from the jira-harness project text.
const harness = projects.find((p) => p.id === "harness")!;
export const assistantPreview = {
  question: "jira-harness는 어떤 문제를 해결하나요?",
  answer: [harness.challenge, harness.decisions.find((d) => d.title.includes("Git tree"))!.body].join(" "),
};
