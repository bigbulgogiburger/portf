import Script from "next/script";
import Link from "next/link";
import { profile, projects, career, capabilities, resultLabel } from "@/data/portfolio";
export const metadata = {
  title: "공개용 포트폴리오",
  robots: { index: false, follow: false },
};
export default function Print() {
  return (
    <main className="print-document">
      <div className="print-actions">
        <button type="button" id="print-document-button">인쇄 / PDF로 저장</button>
        <Link href="/">웹 포트폴리오로 돌아가기</Link>
      </div>
      <Script id="print-document-action">{`
        document.addEventListener("click", (event) => {
          if (event.target instanceof Element && event.target.closest("#print-document-button")) {
            window.print();
          }
        });
      `}</Script>
      <section className="print-sheet">
        <div className="print-label">PORTFOLIO / PUBLIC EDITION / 2026.09</div>
        <h1>{profile.name}</h1>
        <h2>{profile.headline}</h2>
        <p>{profile.description}</p>
        <div className="print-contact">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <br />
          <a href={profile.github}>{profile.github}</a>
        </div>
        <h3>대표 성과</h3>
        <p>
          API 약 50개 Spring Boot 이관 · 배포 약 1시간 → 약 10분(서버 2대 기준) ·
          통합회원 약 1만 명 전환 완료
        </p>
        <h3>핵심 역량</h3>
        {capabilities.map((c) => (
          <p key={c.title}>
            <b>{c.title}</b> — {c.skills.map((s) => s.name).join(" · ")}
          </p>
        ))}
        <h3>경력</h3>
        {career.map((c) => (
          <div className="print-career" key={c.company}>
            <b>
              {c.company} · {c.role}
            </b>
            <small>{c.period}</small>
            {c.note && <p className="print-note">{c.note}</p>}
            <p>{c.body}</p>
          </div>
        ))}
      </section>
      {projects.map((p) => (
        <section className="print-sheet" key={p.id}>
          <div className="print-label">
            {p.number} / {p.category}
          </div>
          <h1>{p.title}</h1>
          <h2>{p.subtitle}</h2>
          <p>{p.period} · {p.status}</p>
          <p>{p.summary}</p>
          <p className="print-tech">
            {p.role}
            <br />
            {p.tags.join(" · ")}
          </p>
          <h3>문제</h3>
          <p>{p.challenge}</p>
          <h3>설계와 구현</h3>
          {p.decisions.map((d) => (
            <div key={d.title}>
              <h4>{d.title}</h4>
              <p>{d.body}</p>
            </div>
          ))}
          <h3>{resultLabel(p).ko}</h3>
          <p>
            <b>{p.metric}</b> — {p.metricLabel}
          </p>
          <p>{p.outcome}</p>

          {p.github && <p><a href={p.github}>{p.github}</a></p>}
          <div className="print-page-footer">
            편도훈 · <a href={`mailto:${profile.email}`}>{profile.email}</a> <span>{p.number}</span>
          </div>
        </section>
      ))}
    </main>
  );
}
