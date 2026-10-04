"use client";
import { useRef, type CSSProperties } from "react";
import { usePlayback } from "@/lib/motion";
import { uploadFlow, uploadSlots } from "@/lib/upload-flow";

// Matches the last keyframe in the .upload-flow block of globals.css.
const PLAY_MS = 3000;

// Both panels share one time axis, so the pooled run visibly ends earlier
// while never running more rows at once than the pool allows.
export function UploadFlow() {
  const ref = useRef<HTMLElement>(null);
  const { allowed, playing, run, replay } = usePlayback(ref, PLAY_MS);
  const units = uploadFlow.rows.length;
  return (
    <figure
      ref={ref}
      className="upload-flow"
      data-playing={playing || undefined}
      aria-label={uploadFlow.label}
    >
      <figcaption>
        <span>처리 구조 전후 · 행·스레드 수는 설명용</span>
        {allowed && (
          <button type="button" className="replay-button" onClick={replay}>
            흐름 다시 보기
          </button>
        )}
      </figcaption>
      <div className="upload-panels" key={run}>
        {(["before", "after"] as const).map((side) => {
          const s = uploadFlow[side];
          const slots = uploadSlots(side);
          return (
            <div key={side} className={`upload-panel is-${side}`}>
              <p className="upload-tag">{s.tag}</p>
              <ol className="upload-rows" style={{ "--units": units } as CSSProperties}>
                {uploadFlow.rows.map((row, i) => (
                  <li key={row}>
                    <span className="upload-row">{row}</span>
                    <span className="upload-track">
                      <span className="upload-bar" style={{ "--start": slots[i] } as CSSProperties}>
                        {side === "after" ? `${s.bar} ${(i % uploadFlow.pool) + 1}` : s.bar}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="upload-status">
                {side === "before" ? "✕ " : "✓ "}
                {s.status}
              </p>
              <p className="upload-note">{s.note}</p>
            </div>
          );
        })}
        <p className="upload-axis">가로축은 시간, 막대는 행별 외부 API 응답 대기</p>
      </div>
    </figure>
  );
}
