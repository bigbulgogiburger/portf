"use client";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { usePlayback } from "@/lib/motion";
import { batchDots, batchFigure, draftFigure, settlementFigure, toolsFigure } from "@/lib/decision-figures";

// Longest animation in each figure's block of v3.css.
const PLAY_MS = { batch: 2600, settlement: 2600, draft: 3400, tools: 2600 };

function Frame({ kind, label, title, children }: { kind: keyof typeof PLAY_MS; label: string; title: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { allowed, playing, run, replay } = usePlayback(ref, PLAY_MS[kind]);
  return (
    <figure ref={ref} className={`dfig dfig-${kind}`} data-playing={playing || undefined} aria-label={label}>
      <figcaption>
        <span>{title}</span>
        {allowed && (
          <button type="button" className="replay-button" onClick={replay}>
            흐름 다시 보기
          </button>
        )}
      </figcaption>
      <div className="dfig-body" key={run}>
        {children}
      </div>
    </figure>
  );
}

function Batch() {
  const f = batchFigure;
  return (
    <Frame kind="batch" label={f.label} title="통합 전후 · 개념도">
      <div className="dfig-tags">
        <p>
          {f.before} <b>{f.count}개</b>
        </p>
        <p>{f.unit}</p>
        <p>
          {f.after} <b>1대</b>
        </p>
      </div>
      <svg viewBox="0 0 640 220" aria-hidden="true">
        <rect className="dfig-box" x="430" y="56" width="176" height="124" rx="10" />
        <path className="dfig-wire" d="M300 110H416" />
        <path className="dfig-wire" d="M408 104l8 6-8 6" />
        {batchDots().map(({ from, to }, i) => (
          <g key={i}>
            <circle className="dfig-origin" cx={from[0]} cy={from[1]} r="4" />
            <circle
              className="dfig-dot"
              cx={to[0]}
              cy={to[1]}
              r="4.2"
              style={{ "--dx": `${from[0] - to[0]}px`, "--dy": `${from[1] - to[1]}px`, "--i": i } as CSSProperties}
            />
          </g>
        ))}
      </svg>
      <p className="dfig-note">✓ {f.note}</p>
    </Frame>
  );
}

function Settlement() {
  const f = settlementFigure;
  return (
    <Frame kind="settlement" label={f.label} title="데이터 분리 · 개념도">
      <div className="dfig-cols">
        <div className="dfig-card is-source">
          <p className="dfig-name">{f.source.name}</p>
          {f.source.rows.map((row) => (
            <p key={row} className="dfig-row">
              <span>{row}</span>
              <i />
            </p>
          ))}
          <p className="dfig-status">{f.source.status}</p>
        </div>
        <p className="dfig-link">{f.link}</p>
        <div className="dfig-card is-snapshot">
          <p className="dfig-name">{f.snapshot.name}</p>
          {f.snapshot.rows.map((row) => (
            <p key={row} className="dfig-row">
              <span>{row}</span>
              <i />
            </p>
          ))}
          <p className="dfig-status">✓ {f.snapshot.status}</p>
        </div>
      </div>
    </Frame>
  );
}

function Draft() {
  const f = draftFigure;
  const dots = f.minutes * 12;
  return (
    <Frame kind="draft" label={f.label} title="초안 유효 시간 · 개념도">
      <div className="dfig-cols">
        <div className="dfig-timer">
          <svg viewBox="0 0 160 160" aria-hidden="true">
            {Array.from({ length: dots }, (_, i) => {
              const a = (i / dots) * Math.PI * 2 - Math.PI / 2;
              const minute = i % 12 === 0;
              return (
                <circle
                  key={i}
                  cx={80 + Math.cos(a) * 62}
                  cy={80 + Math.sin(a) * 62}
                  r={minute ? 3.6 : 2.3}
                  style={{ "--i": i } as CSSProperties}
                />
              );
            })}
          </svg>
          <p>
            <b>{f.minutes}분</b>
            {f.draft}
          </p>
        </div>
        <ul className="dfig-outcomes">
          {f.outcomes.map((o) => (
            <li key={o.when} className={`is-${o.tone}`}>
              <span>{o.when}</span>
              <b>{o.then}</b>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

function Tools() {
  const f = toolsFigure;
  return (
    <Frame kind="tools" label={f.label} title="도구 권한 · 개념도">
      <div className="dfig-cols">
        <div className="dfig-card is-agent">
          <p className="dfig-name">{f.agent.name}</p>
          <p className="dfig-row">
            <span>{f.agent.kind}</span>
            <span className="dfig-count" aria-hidden="true">
              {Array.from({ length: f.agent.count }, (_, i) => (
                <i key={i} style={{ "--i": i } as CSSProperties} />
              ))}
            </span>
            <b>{f.agent.count}종</b>
          </p>
          <p className="dfig-row is-missing">
            <span>{f.agent.missing}</span>
            <span className="dfig-count" aria-hidden="true">
              <i />
            </span>
            <b>없음</b>
          </p>
          <p className="dfig-status">{f.agent.status}</p>
        </div>
        <p className="dfig-link">{f.link}</p>
        <div className="dfig-card is-snapshot">
          <p className="dfig-name">{f.issue.name}</p>
          {f.issue.rows.map(([who, what]) => (
            <p key={who} className="dfig-row">
              <span>{who}</span>
              <b>{what}</b>
            </p>
          ))}
          <p className="dfig-status">✓ {f.issue.status}</p>
        </div>
      </div>
    </Frame>
  );
}

const figures: Record<string, () => ReactNode> = {
  [toolsFigure.decision]: Tools,
  [batchFigure.decision]: Batch,
  [settlementFigure.decision]: Settlement,
  [draftFigure.decision]: Draft,
};
// Figure for a decision title, when one has been drawn.
export function DecisionFigure({ title }: { title: string }) {
  const Figure = figures[title];
  return Figure ? <Figure /> : null;
}
