export const profile = {
  name: "편도훈",
  englishName: "DOHOON PYUN",
  headline: "AI 서비스를 만드는 백엔드 엔지니어",
  email: "dohoon321@gmail.com",
  github: "https://github.com/bigbulgogiburger",
  description:
    "Java·Spring으로 서비스의 기반을 만들고, AI를 실제 업무에 연결합니다. 기획부터 개발, 배포와 운영까지. 끝까지 작동하는 시스템을 만듭니다.",
};

export type Project = {
  id: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  summary: string;
  role: string;
  tags: string[];
  accent: string;
  metric: string;
  metricLabel: string;
  challenge: string;
  decisions: { title: string; body: string }[];
  outcome: string;
  takeaway: string;
  flow: string[];
  github?: string;
};

export const projects: Project[] = [
  {
    id: "service-agent",
    number: "01",
    category: "AI APPLICATION",
    title: "AI를 실제 업무에 연결하다",
    subtitle: "A/S 플랫폼 · CS AI Agent",
    summary:
      "반복되는 문의를 이해하고, 허용된 업무만 수행하는 AI Agent. 모델의 답변을 실제 서비스의 동작으로 연결했습니다.",
    role: "PM · Backend · AI Integration · DevOps",
    tags: ["Java 21", "Spring Boot", "LLM API", "Tool Calling", "HITL"],
    accent: "lime",
    metric: "Human in the loop",
    metricLabel: "상태 변경에는 사람의 승인",
    challenge:
      "일반적인 LLM은 접수 상태나 고객의 업무 맥락을 알지 못합니다. 운영 데이터를 조회하면서도, 잘못된 답변이 실제 업무 변경으로 이어지지 않도록 통제해야 했습니다.",
    decisions: [
      {
        title: "답변과 실행의 경계를 설계",
        body: "상용·로컬 LLM을 API로 연결하고, 화이트리스트에 등록한 도구만 호출하도록 구성했습니다. 업무 권한은 백엔드에서 검증합니다.",
      },
      {
        title: "중요한 변경은 사람이 결정",
        body: "접수 상태 변경과 같은 동작에 HITL 승인 절차를 적용했습니다. 조회와 변경을 구분해 AI가 할 수 있는 일을 명확하게 제한했습니다.",
      },
      {
        title: "운영 플랫폼까지 함께 개선",
        body: "Next.js 백엔드 API 약 50개를 Spring으로 이관하고 MongoDB를 MySQL로 전환했습니다. GitLab·Jenkins·Docker 배포와 모니터링을 함께 구축했습니다.",
      },
    ],
    outcome:
      "운영 업무에 CS AI Agent를 도입했습니다. 엑셀 업로드는 100건 3분 이상에서 500건 수초로 개선했고, 수동 약 1시간이던 배포를 자동 약 10분으로 단축했습니다. AI 응대 자동화율은 별도 측정치로 제시하지 않습니다.",
    takeaway:
      "좋은 AI 서비스는 답변을 생성하는 능력만큼, 무엇을 실행하지 않을지 결정하는 구조가 중요합니다.",
    flow: ["문의", "LLM 판단", "허용된 도구", "권한 검증", "사람 승인"],
  },
  {
    id: "harness",
    number: "02",
    category: "OPEN SOURCE",
    title: "AI 개발에도 품질의 기준을",
    subtitle: "claude_jira_harness · MIT Open Source",
    summary:
      "요구사항 한 줄에서 구현과 검증까지. AI의 작업을 연결하고, 리뷰를 통과하지 못한 변경은 commit 단계에서 차단합니다.",
    role: "설계 · 개발 · 실제 프로덕트 적용",
    tags: ["Agent Workflow", "Jira", "Git Hooks", "Quality Gate"],
    accent: "violet",
    metric: "8 stages",
    metricLabel: "요구사항부터 완료까지",
    challenge:
      "AI로 빠르게 코드를 생성해도 요구사항의 맥락과 검증 기준이 이어지지 않으면 재작업이 늘어납니다. 생성과 검증을 하나의 반복 가능한 개발 절차로 묶어야 했습니다.",
    decisions: [
      {
        title: "요구사항을 실행 가능한 흐름으로",
        body: "create → start → clarify → plan → execute → test → commit → complete의 8단계로 작업을 연결했습니다. 앞 단계의 산출물이 다음 단계의 입력이 됩니다.",
      },
      {
        title: "검증을 권고가 아닌 게이트로",
        body: "전문 관점의 에이전트가 fan-out 리뷰를 수행합니다. PASS를 받지 못한 변경은 Git Hook의 commit 게이트에서 차단하도록 구성했습니다.",
      },
      {
        title: "작업 결과를 지식으로 축적",
        body: "개발 산출물을 위키에 연결하고 정합성을 점검합니다. 중단 후 재개할 때에도 작업 맥락과 근거를 이어갈 수 있도록 설계했습니다.",
      },
    ],
    outcome:
      "업무용 A/S 플랫폼, CS, 홈페이지, App 등 4개 프로덕트에 적용했습니다. 슬래시 명령과 스킬로 구성한 프레임워크를 MIT 라이선스로 공개했습니다.",
    takeaway:
      "AI에게 일을 맡기는 것에서 한 걸음 더. 결과를 받아들일 기준까지 코드로 만듭니다.",
    flow: ["요구사항", "설계", "구현", "Fan-out 리뷰", "Commit gate"],
    github: "https://github.com/bigbulgogiburger/claude_jira_harness",
  },
  {
    id: "field-service",
    number: "03",
    category: "END-TO-END ENGINEERING",
    title: "복잡한 업무를 하나의 시스템으로",
    subtitle: "글로벌 전동공구사 · A/S 관리 플랫폼",
    summary:
      "접수부터 정산까지, 흩어진 업무 규칙을 도메인과 상태로 정리했습니다. AI 개발 워크플로를 활용해 기획·백엔드·화면·검증을 단독으로 연결했습니다.",
    role: "도메인 설계 · Full-stack · QA · DevOps",
    tags: ["Spring Boot", "Vue 3", "MySQL", "RBAC", "Flyway"],
    accent: "cyan",
    metric: "End to end",
    metricLabel: "접수에서 정산까지",
    challenge:
      "와이어프레임 중심의 기획에는 역할, 권한, 상태 전이와 도메인 경계가 충분히 정의되어 있지 않았습니다. 개발에 앞서 서로 다른 업무 용어와 규칙을 일관된 모델로 정리해야 했습니다.",
    decisions: [
      {
        title: "코드와 기획을 함께 확인",
        body: "요구사항과 데이터 구조를 대조해 도메인 경계를 구체화했습니다. 고객사·거래처·역할별 책임을 분리하고 기준 문서에 연결했습니다.",
      },
      {
        title: "권한과 상태를 시스템의 중심에",
        body: "역할 기반 접근 제어와 업무 상태 전이를 설계했습니다. 화면별 기능 구현이 전체 업무 흐름과 어긋나지 않도록 기준을 맞췄습니다.",
      },
      {
        title: "혼자 개발해도 검증은 여러 관점으로",
        body: "직접 만든 harness를 활용해 작업을 분리하고 전문 관점의 리뷰를 적용했습니다. 변경 수용 여부를 품질 게이트로 통제했습니다.",
      },
    ],
    outcome:
      "접수·수리·정산의 업무 흐름을 다루는 A/S 관리 플랫폼을 단독 구축했습니다. 도메인·권한·상태 전이를 일관된 기준으로 연결하고, AI 개발 워크플로와 품질 게이트를 실제 업무 시스템 개발에 적용했습니다.",
    takeaway: "구현 속도는 문제의 경계를 정확하게 정의하는 데서 시작합니다.",
    flow: ["접수", "배정", "수리", "비용 승인", "정산"],
  },
  {
    id: "payments",
    number: "04",
    category: "RELIABLE BACKEND",
    title: "결제는 끝까지 정확해야 하니까",
    subtitle: "1:1 태블릿 과외 · 결제 마이크로서비스",
    summary:
      "독립된 결제 서버부터 Apple 환불 동기화, 장애 관측까지. 돈과 연결된 상태가 일관되게 유지되도록 설계했습니다.",
    role: "Backend · Payment Integration · Observability",
    tags: ["Java", "Spring", "MSA", "Apple IAP", "Prometheus"],
    accent: "amber",
    metric: "Webhook + Retry",
    metricLabel: "결제와 환불 상태의 일관성",
    challenge:
      "신규 결제 기능을 기존 서버와 분리하면서 내부 인증과 외부 결제 연동을 함께 해결해야 했습니다. Apple에서 발생하는 취소·환불 이벤트도 서비스 DB에 반영해야 했습니다.",
    decisions: [
      {
        title: "결제를 독립된 책임으로 분리",
        body: "MSA 결제 서버를 구축하고 Internal·External 통신과 인증 흐름을 분리했습니다. 기존 서비스와 독립적으로 결제 기능을 개발할 수 있게 했습니다.",
      },
      {
        title: "외부 이벤트를 내부 상태와 동기화",
        body: "Apple Webhook·Verify API와 재시도를 연결했습니다. Spring AOP의 self-invocation 문제를 해결해 재시도가 의도대로 동작하도록 보완했습니다.",
      },
      {
        title: "운영 중인 상태를 볼 수 있게",
        body: "Prometheus·Grafana·Pinpoint로 지표와 트레이스를 확인하도록 구성했습니다. 사용자의 문의 이후에 알게 되던 장애를 사전에 탐지하는 체계로 바꿨습니다.",
      },
    ],
    outcome:
      "독립 결제 서버 구축으로 결제 출시 일정을 약 1개월 단축했습니다. Apple 환불 상태 동기화와 관측 도구를 통해 결제 운영의 정합성과 가시성을 높였습니다.",
    takeaway:
      "정상 요청 하나의 성공보다, 실패 이후에도 상태를 복구할 수 있는 구조를 고민합니다.",
    flow: [
      "결제 요청",
      "내부 인증",
      "결제 서비스",
      "Apple 이벤트",
      "검증 · 재시도",
    ],
  },
  {
    id: "membership",
    number: "05",
    category: "EVENT-DRIVEN SYSTEMS",
    title: "서비스를 잇고, 결합은 낮추고",
    subtitle: "입시 정보 플랫폼 · 통합회원과 Q&A",
    summary:
      "AWS SNS 이벤트로 회원 정보를 연결하고, Redis로 별도 가입 없는 Q&A 경험을 만들었습니다.",
    role: "Backend · Event Architecture · Batch",
    tags: ["AWS SNS", "Redis", "Spring Batch", "MySQL"],
    accent: "pink",
    metric: "약 1만 명",
    metricLabel: "통합 대상 회원 무에러 전환",
    challenge:
      "서로 다른 서비스의 회원을 연결해야 했지만 DB를 직접 공유하기는 어려웠습니다. 기존 스키마 변경을 최소화하면서 신규 가입 없이 Q&A를 이용할 수 있어야 했습니다.",
    decisions: [
      {
        title: "DB 공유 대신 이벤트로 연결",
        body: "AWS SNS Pub/Sub를 이용해 회원 변경을 전달했습니다. 서비스 사이의 직접적인 결합을 낮추면서 통합회원 전환을 진행했습니다.",
      },
      {
        title: "Redis로 임시 회원 맥락 유지",
        body: "외부 서비스의 회원 ID와 상담 정보를 매핑해 임시 회원 세션을 구성했습니다. DB 스키마 변경 없이 Q&A와 멘토 매칭을 연결했습니다.",
      },
      {
        title: "흩어진 운영 작업 통합",
        body: "분산된 스케줄러 22개를 Spring Batch 서버 1대로 통합했습니다. Apple 탈퇴 revoke 연동과 토큰 갱신 작업도 처리했습니다.",
      },
    ],
    outcome:
      "전체 회원 약 10만 중 통합 대상 약 1만 명을 무에러 전환했습니다. Q&A는 약 1,000건을 처리했고, DB 스키마 변경 없이 서비스 간 회원 경험을 연결했습니다.",
    takeaway:
      "서비스가 서로 협력하되, 각자의 변경이 다른 서비스의 부담이 되지 않도록 설계합니다.",
    flow: ["회원 이벤트", "AWS SNS", "구독 서비스", "회원 동기화", "Q&A"],
  },
];

export const career = [
  {
    period: "2023.11 — 현재",
    company: "DB Inc.",
    role: "PM · Backend Engineer",
    body: "A/S 플랫폼의 기획·개발·운영을 맡고 있습니다. CS AI Agent 도입, 백엔드 전환, 배포 자동화와 신규 업무 시스템 구축을 수행했습니다.",
  },
  {
    period: "2023.01 — 2023.11",
    company: "교육지대",
    role: "Backend Engineer",
    body: "태블릿 과외 서비스의 통합회원 연동과 모니터링 도입. 실제 서비스가 안정적으로 운영되도록 핵심 기능을 개선했습니다.",
  },
  {
    period: "2021.11 — 2023.01",
    company: "플랫비",
    role: "Backend Engineer",
    body: "MSA 결제 서버와 Apple 인앱 결제 연동을 개발했습니다. 결제·환불의 정합성과 서비스 간 인증을 다뤘습니다.",
  },
  {
    period: "2021.05 — 2021.11",
    company: "링커",
    role: "Backend Engineer",
    body: "통합회원 이벤트, Redis 기반 Q&A, Apple 탈퇴 연동과 Spring Batch를 개발했습니다.",
  },
];

export const capabilities = [
  {
    title: "Backend",
    caption: "신뢰할 수 있는 서비스의 기반",
    skills: [
      "Java 21",
      "Spring Boot",
      "JPA · QueryDSL",
      "Spring Security",
      "MSA · Event-driven",
    ],
  },
  {
    title: "Applied AI",
    caption: "가능성을 실제 업무로",
    skills: [
      "LLM API Integration",
      "Tool Calling · HITL",
      "Agent Workflow",
      "Quality Gates",
    ],
  },
  {
    title: "Operations",
    caption: "배포 이후까지 책임지는 개발",
    skills: [
      "AWS",
      "Docker · Jenkins",
      "Prometheus · Grafana",
      "Redis · MySQL",
      "Spring Batch",
    ],
  },
];

// Only this reviewed, public corpus is supplied to the assistant.
export const publicKnowledge = JSON.stringify({ profile, career, projects });
