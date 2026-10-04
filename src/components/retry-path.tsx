"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useMotion } from "@/lib/motion";
import { retryPath } from "@/lib/retry-path";

// Matches the last keyframe in the .retry-path block of globals.css.
const PLAY_MS = 4400;

// Static before/after diagram; when motion is allowed a request marker walks
// each path once per view so the proxy bypass is visible, not just described.
export function RetryPath() {
  const ref = useRef<HTMLElement>(null);
  const { allowed } = useMotion();
  const inView = useInView(ref, 0.6);
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!allowed || !inView) return;
    const start = window.setTimeout(() => setPlaying(true), 0);
    const end = window.setTimeout(() => setPlaying(false), PLAY_MS);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
      setPlaying(false);
    };
  }, [allowed, inView, run]);
  return (
    <figure
      ref={ref}
      className="retry-path"
      data-playing={playing || undefined}
      aria-label={retryPath.label}
    >
      <figcaption>
        <span>호출 구조 전후 · 이해를 돕기 위한 개념도</span>
        {allowed && (
          <button type="button" className="replay-button" onClick={() => setRun((n) => n + 1)}>
            흐름 다시 보기
          </button>
        )}
      </figcaption>
      <div className="retry-panels" key={run}>
        {(["before", "after"] as const).map((side) => {
          const s = retryPath[side];
          return (
            <div key={side} className={`retry-panel is-${side}`}>
              <p className="retry-tag">{s.tag}</p>
              <div className="retry-track">
                {s.nodes.map((node, i) => (
                  <span key={node} className={i === 1 ? "retry-node is-proxy" : "retry-node"}>
                    {node}
                    {side === "before" && i === 1 && <small>거치지 않음</small>}
                  </span>
                ))}
                <span className="retry-link">
                  <span>{s.link}</span>
                </span>
                <span className="retry-run" aria-hidden="true">
                  <i />
                </span>
              </div>
              <p className="retry-status">
                {side === "before" ? "✕ " : "✓ "}
                {s.status}
              </p>
              <p className="retry-note">{s.note}</p>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
