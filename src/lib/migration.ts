// Before/after layers for the platform-operations case. Cells quote the
// published case text; it is a structural sketch, not a full architecture.
export const migration = {
  title: "수리엔 백엔드",
  subtitle: "이관 전후 구조",
  label: "수리엔 백엔드 이관과 배포 자동화의 전후 구조",
  columns: ["이전", "이후"],
  rows: [
    { layer: "화면", before: "React", after: "React 화면 유지" },
    { layer: "API", before: "Next.js API", after: "Spring Boot · JPA" },
    { layer: "데이터", before: "MongoDB", after: "MySQL" },
    { layer: "배포", before: "SVN · 서버별 수작업", after: "GitLab · Jenkins · Docker" },
  ],
  caption: "Next.js API 약 50개를 이관하고 기존 React 화면과 연동",
} as const;
