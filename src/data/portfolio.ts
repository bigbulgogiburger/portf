export const profile = {
  name: "편도훈", englishName: "DOHOON PYUN",
  headline: "Java·Spring 백엔드 개발자",
  email: "dohoon321@gmail.com", github: "https://github.com/bigbulgogiburger",
  description: "2021년 5월부터 결제·회원·A/S 서비스를 개발해 왔습니다. 현재 DB Inc.에서 백엔드 개발과 PM을 맡고 있으며, CS AI Agent와 AI Coding 검증 도구를 개발했습니다.",
};
export type Project = {
  id: string; number: string; category: string; title: string; subtitle: string;
  summary: string; role: string; period: string; status: string;
  tags: string[]; accent: string; metric: string; metricLabel: string;
  challenge: string; decisions: { title: string; body: string }[];
  outcome: string; flow: string[]; github?: string;
};
export const projects: Project[] = [
  {
    id: "field-service", number: "01", category: "업무 시스템 설계·구현",
    title: "전동공구 A/S 관리 플랫폼", subtitle: "Stanley CS · DB Inc.",
    summary: "고객사와 업무 용어·권한·정산 규칙을 협의하고, 접수부터 정산까지의 DB·API·화면을 개발하고 있습니다.",
    role: "요구사항 협의 · 도메인·DB 설계 · 백엔드·화면·QA·배포 1인 담당",
    period: "DB Inc. 재직 중", status: "개발·검증 중",
    tags: ["Java 21", "Spring Boot 3.3", "JPA · QueryDSL", "MySQL", "Vue 3"], accent: "cyan",
    metric: "요구사항 협의부터 구현까지", metricLabel: "고객사와 설계 기준을 맞추며 개발",
    challenge: "화면 와이어프레임을 실제 A/S 업무 시스템으로 옮겨야 했습니다. 같은 ‘고객’이라는 표현에도 시스템을 쓰는 조직, 수리를 맡기는 사람, B2B 거래 주체가 섞여 있어 데이터 모델과 조회·수정 권한부터 구분했습니다.",
    decisions: [
      { title: "고객사·수리 고객·B2B 거래처 구분", body: "고객사는 시스템 사용 조직, 고객은 수리 접수자, 거래처는 B2B 거래 주체로 정의했습니다. 각 주체의 데이터와 역할별 접근 범위를 나누고 백엔드 권한 검사에 반영했습니다." },
      { title: "접수·수리·정산의 상태와 API 구현", body: "접수·배정·진단·견적·승인·수리·정산의 처리 주체와 예외 조건을 검토했습니다. 업무 흐름을 상태 모델로 설계하고 Java·Spring 서버와 Vue 화면으로 구현하고 있습니다." },
      { title: "정산 생성 시점의 금액 보관", body: "정산 이후 부품 단가나 모델명이 바뀌어도 과거 정산 내역은 유지돼야 했습니다. 고객사 담당자와 화면을 보며 협의해 수리 건과 금액을 별도 정산 테이블에 보관하고, 원본 수리 데이터와 독립적으로 관리하는 설계에 합의했습니다." },
    ],
    outcome: "요구사항 검토, 도메인·DB 설계, 서버·화면 개발과 QA·배포를 담당하고 있습니다. 도메인별 개발 가이드와 검증 기록을 남기며 추가 요구사항을 반영하고 있습니다. 정산 데이터 보관 방식은 고객사와 협의한 설계 기준입니다.",
    flow: ["요구사항 협의", "도메인·권한 설계", "DB·API·화면", "QA·배포"],
  },
  {
    id: "harness", number: "02", category: "오픈소스 · AI CODING",
    title: "jira-harness", subtitle: "Claude Code 개발·검증 플러그인",
    summary: "테스트·리뷰 기록이 커밋할 코드를 검증한 결과인지 Git tree ID로 확인하는 플러그인입니다.",
    role: "플러그인 설계·개발 · MIT 라이선스 공개", period: "2026", status: "공개",
    tags: ["JavaScript", "Node.js", "Git hooks", "Claude Code"], accent: "violet",
    metric: "Git tree ID 대조", metricLabel: "검증한 코드와 커밋할 코드의 일치 확인",
    challenge: "AI가 코드를 수정한 뒤 이전 테스트·리뷰 결과를 그대로 사용하면 현재 변경분이 검증되지 않은 채 커밋될 수 있습니다. 검증 기록과 코드 상태를 함께 확인할 장치가 필요했습니다.",
    decisions: [
      { title: "계획·구현·검증 절차를 워크플로로 구성", body: "Jira 이슈의 계획과 구현, 리뷰·검증 흐름을 Claude Code 플러그인으로 구성했습니다. 실행 상태와 검증 결과는 스크립트가 JSON 파일로 기록합니다." },
      { title: "검증 시점의 Git tree ID 기록", body: "테스트·리뷰 시점의 Git tree ID를 저장하고 커밋 대상과 대조합니다. 차단 모드에서 검증 미실행·실패 또는 검증 이후 코드 변경을 감지하면 커밋을 막고 재검증하도록 구성했습니다." },
      { title: "프로젝트별 검증 명령과 정책 분리", body: "프로젝트의 빌드·테스트 명령과 브랜치 정책을 설정으로 분리했습니다. 차단 조건과 예외는 공개 저장소의 코드와 문서에서 확인할 수 있습니다." },
    ],
    outcome: "Claude Code 플러그인을 MIT 라이선스로 공개했습니다. 이전 스킬 묶음에서 발전시킨 현재 버전으로, 검증 결과와 커밋 대상의 일치를 확인하는 방식에 초점을 맞췄습니다.",
    flow: ["구현", "테스트·리뷰", "tree ID 기록", "커밋 대상 대조"],
    github: "https://github.com/bigbulgogiburger/jira-harness",
  },
  {
    id: "service-agent", number: "03", category: "AI 업무 연동",
    title: "수리엔 CS AI Agent", subtitle: "접수·현황·정산 조회와 신규 접수 초안",
    summary: "여러 화면에서 찾던 운영 정보를 대화로 조회하고, 신규 접수는 사람이 초안을 확인해 등록하도록 구현했습니다.",
    role: "업무 시나리오 · LLM API·도구 연동 · 권한 통제 · QA 배포",
    period: "2026 · 7월 QA 배포", status: "개발·도입",
    tags: ["LLM API", "Tool-calling", "SELECT 전용 도구", "백엔드 인증·인가"], accent: "lime",
    metric: "접수 초안 → 사용자 등록", metricLabel: "조회 권한과 실제 접수 생성을 백엔드에서 통제",
    challenge: "운영자가 접수·현황·정산 정보를 여러 화면에서 반복해서 조회했습니다. 자연어 조회를 제공하면서 소속 그룹의 데이터 범위를 지키고, 모델의 응답만으로 접수가 생성되지 않도록 해야 했습니다.",
    decisions: [
      { title: "허용 도구와 SELECT 전용 SQL", body: "LLM API에 업무별 도구를 연결하고 호출 가능한 도구를 제한했습니다. SQL 조회 도구는 SELECT 전용으로 구성해 운영 데이터를 조회하도록 했습니다." },
      { title: "소속 그룹의 데이터 범위 검사", body: "사용자와 소속 그룹의 권한을 백엔드에서 검사합니다. 모델에 전달하는 지시문과 별도로 실제 조회 가능한 데이터 범위를 제한했습니다." },
      { title: "5분 동안 유효한 신규 접수 초안", body: "Agent가 작성한 초안 카드에서 사용자가 내용을 확인하고 [등록]을 눌러야 접수가 생성됩니다. 5분 안에 등록하지 않은 초안은 만료됩니다." },
    ],
    outcome: "CS AI Agent를 개발·도입하고, 2026년 7월 QA 환경에 배포했습니다. 조회와 접수 초안·등록 절차를 설명한 사용 매뉴얼을 작성해 현업 테스트를 지원했습니다.",
    flow: ["자연어 요청", "권한 내 조회", "접수 초안", "사용자 등록"],
  },
  {
    id: "platform-operations", number: "04", category: "백엔드 이관·운영 개선",
    title: "수리엔 API 이관과 배포 자동화", subtitle: "수리 매칭 플랫폼 · DB Inc.",
    summary: "Next.js API 약 50개를 Spring Boot로 이관하고, 서버마다 반복하던 배포를 약 1시간에서 약 10분으로 줄였습니다.",
    role: "백엔드 개발·PM · 데이터 모델 이관 · CI/CD·모니터링",
    period: "2023.11 – 현재", status: "개발·운영",
    tags: ["Spring Boot", "MySQL", "Jenkins · Docker", "Prometheus · Grafana"], accent: "cyan",
    metric: "약 1시간 → 약 10분", metricLabel: "수동 배포를 자동화한 전후 소요 시간",
    challenge: "외주에서 인계한 Next.js·MongoDB 서버를 내부에서 유지보수해야 했습니다. 배포 때마다 SVN checkout, 파일 이동, deploy.sh 실행을 서버별로 반복하는 작업도 개선이 필요했습니다.",
    decisions: [
      { title: "React 화면을 유지하며 백엔드 이관", body: "Next.js 백엔드 API 약 50개를 Spring Boot로 이관했습니다. MongoDB 데이터를 MySQL·JPA 구조로 재설계하고 기존 React 화면과 연동했습니다." },
      { title: "서버별 수작업을 배포 파이프라인으로", body: "GitLab·Jenkins·Docker로 빌드·이미지 생성·배포 과정을 자동화했습니다. AWS·Nginx 운영 환경과 Prometheus·Grafana 모니터링도 구축했습니다." },
      { title: "엑셀 대량 업로드의 비동기·병렬 처리", body: "엑셀 대량 업로드에서 행마다 Geocoding API 응답을 기다린 뒤 다음 행을 처리해 대기 시간이 누적됐습니다. CompletableFuture로 행별 호출을 비동기 작업으로 나누고 ExecutorService의 스레드 풀에서 병렬 실행했습니다. 결과를 모아 행별 성공·실패와 사유를 반환했습니다." },
    ],
    outcome: "백엔드 API 약 50개를 Spring Boot로 이관하고, 배포 작업을 약 1시간에서 약 10분으로 단축했습니다. Flutter 앱의 Play Store·TestFlight 배포와 Vue·React 화면 유지보수도 담당했습니다.",
    flow: ["GitLab", "Jenkins 빌드", "Docker 이미지", "배포·모니터링"],
  },
  {
    id: "payments", number: "05", category: "결제 연동·장애 분석",
    title: "스카이탭 결제·Apple 환불 연동", subtitle: "독립 결제 서버와 Spring AOP 오류 수정",
    summary: "서비스 본체와 결제 서버를 분리하고, Apple 환불 검증의 재시도가 실행되지 않는 self-invocation 문제를 해결했습니다.",
    role: "플랫비: 결제·환불 연동 / 교육지대: 회원·결제·모니터링",
    period: "2022.02 – 2023.11", status: "개발·운영 완료",
    tags: ["Java · Spring", "Inicis · Apple API", "Spring Retry", "Pinpoint"], accent: "amber",
    metric: "출시 일정 약 1개월 단축", metricLabel: "독립 결제 서버를 API로 서비스 본체와 통합",
    challenge: "기존 서비스와 기술 스택이 다른 결제 기능을 개발해야 했습니다. 서버 간 요청과 사용자 요청의 인증을 분리하고, Apple 환불 결과를 서비스 DB에 반영해야 했습니다.",
    decisions: [
      { title: "Internal·External 인증 경로 분리", body: "플랫비에서 독립 결제 서버를 개발했습니다(2022.02~11). 서버 간 요청은 헤더 토큰으로, 사용자 요청은 통합회원 서버를 통해 검증하고 Inicis·Apple 결제를 연동했습니다." },
      { title: "@Retryable이 실행되지 않는 원인 추적", body: "Apple Verify API 재시도가 같은 객체 내부 호출로 Spring AOP 프록시를 거치지 않는 문제를 확인했습니다(2022.06~08). 검증 로직을 별도 Bean으로 분리해 프록시 경유 호출로 바꾸고 재시도와 환불 상태 동기화가 동작하도록 수정했습니다." },
      { title: "회원 연동과 운영 모니터링", body: "교육지대에서 스카이탭 회원·로그인·결제 기능을 개발했습니다(2023.02~06). Actuator·Micrometer·Prometheus·Grafana로 지표를 수집·시각화하고 Pinpoint로 호출 경로와 병목을 추적하도록 구성했습니다(2023.03~05)." },
    ],
    outcome: "독립 결제 서버 구축·연동으로 출시 일정을 약 1개월 단축했습니다. Apple 환불 검증의 재시도 오류를 수정하고, 이후 교육지대에서는 회원 연동과 운영 모니터링을 구축했습니다.",
    flow: ["환불 Webhook", "호출 Bean", "AOP Proxy", "검증 Bean", "DB 반영"],
  },
  {
    id: "membership", number: "06", category: "회원 연동·배치",
    title: "링커 통합회원·Redis Q&A", subtitle: "법인 합병 이후에도 이어진 서비스 개발·운영",
    summary: "AWS SNS로 통합 대상 회원 약 1만 명을 전환하고, 회원 DB를 공유할 수 없는 Q&A를 Redis 매핑으로 구현했습니다.",
    role: "링커·플랫비·교육지대 / 백엔드 개발·운영", period: "2021.05 – 2023.09", status: "개발·운영 완료",
    tags: ["AWS SNS", "Redis", "Spring Batch", "MySQL"], accent: "pink",
    metric: "통합 대상 약 1만 명 전환", metricLabel: "전체 회원 규모와 실제 전환 대상을 구분",
    challenge: "링커·모지의 회원 DB를 직접 공유할 수 없는 제약에서 회원 연동과 통합 Q&A를 제공해야 했습니다. 법인 합병으로 소속이 변경된 뒤에도 링커 서비스 개발을 계속 담당했습니다.",
    decisions: [
      { title: "회원 이벤트 규약과 전환 순서 조율", body: "AWS SNS Topic에 가입·전환·정보 변경 이벤트를 게시하고 각 서비스가 구독해 DB에 반영하도록 구현했습니다(2022.04~08). 관련 팀과 이벤트 규약·전환 순서를 협의하고 DB 플래그로 중복 처리를 방지했습니다." },
      { title: "회원번호·관심 정보를 Redis에 매핑", body: "기존 회원 RDB 스키마를 바꾸지 않고 회원번호·관심 학과·대학 정보를 Redis에 매핑해 통합 Q&A를 구현했습니다(2021.10~2022.02). 11월~2월 약 1,000건의 질문을 처리했습니다." },
      { title: "스케줄러 22개를 Batch 서버 1대로", body: "각 서비스에 분산된 반복 작업을 Tasklet·Step·Job으로 구성하고 Spring Batch 서버로 통합했습니다(2021.09~11). 배포·테스트·실행 결과를 한곳에서 관리하도록 변경했습니다." },
    ],
    outcome: "통합 대상 회원 약 1만 명 전환, 기존 회원 DB 스키마 변경 없는 Q&A 구현, 스케줄러 22개의 배치 서버 통합을 수행했습니다. 각 작업은 링커 재직과 합병 이후의 서비스 담당 기간에 걸쳐 진행했습니다.",
    flow: ["회원 변경", "AWS SNS", "서비스별 구독", "자체 DB 반영"],
  },
];
export const career = [
  { period: "2023.11 — 현재", company: "DB Inc.", role: "백엔드 개발 · PM", body: "수리엔 백엔드 이관·운영, 배포 자동화, CS AI Agent 개발·도입. 현재 전동공구사 A/S 플랫폼의 DB·API·화면 개발과 고객사 요구사항 협의 담당." },
  { period: "2023.01 — 2023.11", company: "교육지대", role: "서버개발자", body: "스카이탭 회원·로그인·결제 기능 개발. Prometheus·Grafana·Pinpoint 모니터링 구축. 합병 이후 링커 서비스 운영 지속." },
  { period: "2021.11 — 2023.01", company: "플랫비", role: "서버개발자", body: "독립 결제 서버와 Inicis·Apple 결제·환불 연동. 링커 통합회원 전환과 Q&A 개발 지속." },
  { period: "2021.05 — 2021.11", company: "링커", role: "백엔드개발자", body: "입시 정보·멘토링 서비스 백엔드 개발·운영. Spring Batch 통합과 링커·모지 Q&A 개발 참여." },
];
export const capabilities = [
  { title: "Backend", caption: "A/S 도메인 · 회원·결제 연동", skills: ["Java · Spring Boot", "JPA · QueryDSL · MyBatis", "Spring Security", "MySQL · PostgreSQL · Redis"] },
  { title: "Applied AI", caption: "CS Agent · 개발 결과 검증", skills: ["LLM API · Tool-calling", "업무 도구·백엔드 권한 통제", "Claude Code · jira-harness", "Git tree 기반 검증 기록"] },
  { title: "Delivery & Operations", caption: "배포 자동화 · 지표·요청 추적", skills: ["AWS · Nginx", "Docker · GitLab · Jenkins", "Prometheus · Grafana · Pinpoint", "AWS SNS · Spring Batch"] },
];
// Reviewed public facts, shared by the site and its assistant.
export const publicKnowledge = JSON.stringify({ profile, career, projects });
