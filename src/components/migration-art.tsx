"use client";
import { useRef, type CSSProperties } from "react";
import { usePlayback } from "@/lib/motion";
import { migration } from "@/lib/migration";

// Matches the last keyframe in the .migration-art block of globals.css.
const PLAY_MS = 1900;

// Static before/after table; when motion is allowed each layer switches over
// in turn once per view (or on hover) and rests on the same static design.
export function MigrationArt({ controls = false }: { controls?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { allowed, playing, run, replay } = usePlayback(ref, PLAY_MS);
  return (
    <div
      ref={ref}
      className="project-art migration-art"
      data-playing={playing || undefined}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" && !playing) replay();
      }}
    >
      <div className="process-heading">
        {migration.title}
        <span>{migration.subtitle}</span>
        {controls && allowed && (
          <button type="button" className="replay-button" onClick={replay}>
            흐름 다시 보기
          </button>
        )}
      </div>
      <table className="migration-table" key={run}>
        <caption className="sr-only">{migration.label}</caption>
        <thead>
          <tr>
            <td />
            {migration.columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {migration.rows.map((r, i) => (
            <tr key={r.layer} style={{ "--i": i } as CSSProperties}>
              <th scope="row">{r.layer}</th>
              <td>{r.before}</td>
              <td>{r.after}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{migration.caption}</p>
    </div>
  );
}
