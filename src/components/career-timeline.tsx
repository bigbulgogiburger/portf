import Link from "next/link";
import type { CSSProperties } from "react";
import { timeline } from "@/lib/timeline";

const place = (start: number, length: number) => ({ "--start": start, "--length": length }) as CSSProperties;

// One dot per month since the first job; lit dots are the months of each project.
export function CareerTimeline() {
  const t = timeline();
  return (
    <div className="tl" style={{ "--months": t.months } as CSSProperties} data-reveal>
      <div className="tl-row tl-head" aria-hidden="true">
        <span />
        <div className="tl-track">
          <i style={place(0, 1)}>2021.05</i>
          {t.years.map((y) => (
            <i key={y.label} style={place(y.at, 1)}>
              {y.label}
            </i>
          ))}
        </div>
      </div>
      <div className="tl-row tl-companies">
        <span className="tl-label">소속</span>
        <div className="tl-track">
          {t.companies.map((c) => (
            <b key={c.name} style={place(c.start, c.length)}>
              {c.name}
              <small>{c.role}</small>
            </b>
          ))}
        </div>
      </div>
      <ol className="tl-projects">
        {t.rows.map((r, i) => (
          <li key={r.id} className="tl-row" style={{ "--i": i } as CSSProperties}>
            <Link href={`/projects/${r.id}`} className="tl-label">
              <span>{r.number}</span>
              {r.title}
              <small>{r.period}</small>
            </Link>
            <div className="tl-track tl-dots" aria-hidden="true">
              <span className={r.loose ? "tl-span is-loose" : "tl-span"} style={place(r.start, r.length)} />
            </div>
          </li>
        ))}
      </ol>
      <p className="tl-note">
        <i /> 점 하나는 한 달입니다. <i className="is-loose" /> 빈 점은 연도만 표기한 기간입니다.
      </p>
    </div>
  );
}
