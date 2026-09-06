import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, profile } from "@/data/portfolio";
import { Nav } from "@/components/nav";
import { ProjectVisual } from "@/components/project-visual";
import { Chat } from "@/components/chat";
import { ArrowRight, ArrowUpRight, Github } from "@/components/icons";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.id === slug);
  return { title: p?.title, description: p?.summary };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.id === slug);
  if (!p) notFound();
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  return (
    <>
      <Nav />
      <main className={`case-page container accent-${p.accent}`}>
        <Link href="/#work" className="text-link back-link">
          ← 모든 프로젝트
        </Link>
        <div className="section-kicker">
          <span>
            {p.number} / {p.category}
          </span>
          <span>CASE STUDY</span>
        </div>
        <h1>{p.title}</h1>
        <p className="case-subtitle">{p.subtitle}</p>
        <p className="case-intro">{p.summary}</p>
        <div className="case-meta">
          <div>
            <span>MY ROLE</span>
            <p>{p.role}</p>
          </div>
          <div>
            <span>TECH STACK</span>
            <div className="tag-list">
              {p.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        <ProjectVisual id={p.id} />
        <p className="visual-caption">
          공개용 개념 시각화 · 실제 고객사 화면이나 운영 로그가 아닙니다.
        </p>
        <section className="case-section">
          <span className="eyebrow">01 / CHALLENGE</span>
          <h2>먼저, 해결해야 할 문제.</h2>
          <p>{p.challenge}</p>
        </section>
        <section className="case-section">
          <span className="eyebrow">02 / DECISIONS</span>
          <h2>이렇게 설계했습니다.</h2>
          <div className="decisions">
            {p.decisions.map((d, i) => (
              <article key={d.title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{d.title}</h3>
                  <p>{d.body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="case-flow" aria-label="핵심 흐름">
            {p.flow.map((s, i) => (
              <div key={s}>
                <span>{s}</span>
                {i < p.flow.length - 1 && <ArrowRight size={17} />}
              </div>
            ))}
          </div>
          <small className="muted">
            이해를 돕기 위해 단순화한 개념 흐름입니다.
          </small>
        </section>
        <section className="case-section">
          <span className="eyebrow">03 / IMPACT</span>
          <h2>{p.metric}</h2>
          <p className="metric-label">{p.metricLabel}</p>
          <p>{p.outcome}</p>
        </section>
        <blockquote>{p.takeaway}</blockquote>
        {p.github && (
          <a
            className="button secondary"
            href={p.github}
            target="_blank"
            rel="noreferrer"
          >
            <Github size={18} /> 소스 코드 살펴보기 <ArrowUpRight size={18} />
          </a>
        )}
        <div className="case-next">
          <span className="eyebrow">NEXT PROJECT</span>
          <Link href={`/projects/${next.id}`}>
            {next.title}
            <ArrowUpRight />
          </Link>
        </div>
        <div className="case-contact">
          <p>이 프로젝트에 대해 더 이야기하고 싶다면.</p>
          <a className="text-link" href={`mailto:${profile.email}`}>
            {profile.email} <ArrowUpRight size={18} />
          </a>
        </div>
      </main>
      <Chat />
    </>
  );
}
