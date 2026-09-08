import { profile, projects, career, capabilities } from "@/data/portfolio";
export const metadata = {
  title: "공개용 포트폴리오",
  robots: { index: false, follow: false },
};
export default function Print() {
  return (
    <main className="print-document">
      <section className="print-sheet">
        <div className="print-label">PORTFOLIO / PUBLIC EDITION / 2026.09</div>
        <h1>{profile.name}</h1>
        <h2>{profile.headline}</h2>
        <p>{profile.description}</p>
        <div className="print-contact">
          {profile.email}
          <br />
          {profile.github}
        </div>
        <h3>핵심 역량</h3>
        {capabilities.map((c) => (
          <p key={c.title}>
            <b>{c.title}</b> — {c.skills.join(" · ")}
          </p>
        ))}
        <h3>경력</h3>
        {career.map((c) => (
          <div className="print-career" key={c.company}>
            <b>
              {c.company} · {c.role}
            </b>
            <small>{c.period}</small>
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
          <h3>성과</h3>
          <p>{p.outcome}</p>

          {p.github && <p>{p.github}</p>}
          <div className="print-page-footer">
            편도훈 · {profile.email} <span>{p.number}</span>
          </div>
        </section>
      ))}
    </main>
  );
}
