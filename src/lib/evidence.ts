import { projects } from "@/data/portfolio";

export const evidenceRows = [
  { name: "JPA", query: "JPA" },
  { name: "Spring", query: "Spring" },
  { name: "MySQL", query: "MySQL" },
  { name: "Redis", query: "Redis" },
  { name: "AWS SNS", query: "AWS SNS" },
  { name: "LLM API", query: "LLM API" },
  { name: "Git", query: "Git" },
];

// Short case names for narrow columns; each is a name the skills list already uses.
export const shortNames: Record<string, string> = {
  "field-service": "A/S 플랫폼",
  "platform-operations": "수리엔 이관",
  payments: "스카이탭 결제",
  membership: "링커 통합회원",
  "service-agent": "CS AI Agent",
  harness: "jira-harness",
};

export function tagDestination(
  project: (typeof projects)[number],
  tag: string,
) {
  const words = tag.split(/\s*·\s*|\s+\/\s+/);
  const decision = project.decisions.findIndex((d) =>
    words.some((word) =>
      (d.title + " " + d.body).toLowerCase().includes(word.toLowerCase()),
    ),
  );
  return `/projects/${project.id}${decision < 0 ? "" : "#decision-" + (decision + 1)}`;
}

export const searchEntries = projects.flatMap((p) => [
  {
    title: p.title,
    group: "사례",
    project: p.title,
    href: `/projects/${p.id}`,
  },
  ...p.decisions.map((d, i) => ({
    title: d.title,
    group: "결정",
    project: p.title,
    href: `/projects/${p.id}#decision-${i + 1}`,
  })),
  ...p.tags.map((tag) => ({
    title: tag,
    group: "기술",
    project: p.title,
    href: tagDestination(p, tag),
  })),
]);

// Published application names are more specific than project titles (for example 수리엔 배포 자동화).
const applications: Record<string, string> = {
  "A/S": "field-service",
  수리엔: "platform-operations",
  이관: "platform-operations",
  스카이탭: "payments",
  링커: "membership",
  CS: "service-agent",
  "jira-harness": "harness",
};
export function skillSources(where: string, tag: string) {
  return where.split(" · ").flatMap((label) => {
    const id = applications[label.split(" ")[0]];
    const p = projects.find((project) => project.id === id);
    return p ? [{ label, href: tagDestination(p, tag) }] : [];
  });
}
