"use client";
import { Fragment, useRef, type CSSProperties } from "react";
import { ArrowRight } from "./icons";
import { usePlayback } from "@/lib/motion";
import { retryPath } from "@/lib/retry-path";

// Matches the last keyframe in the .retry-path block of globals.css.
const PLAY_MS = 4400;

// Static before/after diagram; when motion is allowed a request marker walks
// each path once per view so the proxy bypass is visible, not just described.
export function RetryPath() {
  const ref = useRef<HTMLElement>(null);
  const { allowed, playing, run, replay } = usePlayback(ref, PLAY_MS);
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
          <button type="button" className="replay-button" onClick={replay}>
            흐름 다시 보기
          </button>
        )}
      </figcaption>
      <div className="retry-panels" key={run}>
        {(["before", "after"] as const).map((side) => {
          const s = retryPath[side];
          const lane = (
            <div className="retry-lane" style={{ "--n": s.nodes.length } as CSSProperties}>
              {s.nodes.map((node, i) => (
                <Fragment key={node}>
                  {i > 0 && <ArrowRight size={16} aria-hidden="true" />}
                  <span className={node === "AOP Proxy" ? "retry-node is-proxy" : "retry-node"}>
                    {node.split(" · ")[0]}
                    {node.includes(" · ") && <small> {node.split(" · ")[1]}</small>}
                  </span>
                </Fragment>
              ))}
              <span className="retry-run" aria-hidden="true">
                <i />
              </span>
            </div>
          );
          return (
            <div key={side} className={`retry-panel is-${side}`}>
              <p className="retry-tag">{s.tag}</p>
              {side === "before" ? (
                <div className="retry-track">
                  <span className="retry-node is-proxy">
                    AOP Proxy<small>거치지 않음</small>
                  </span>
                  <div className="retry-bean">
                    <span className="retry-bean-label">{retryPath.before.bean}</span>
                    {lane}
                    <p className="retry-link">{s.link}</p>
                  </div>
                </div>
              ) : (
                <div className="retry-track">
                  <div className="retry-flow">
                    {lane}
                    <p className="retry-link">{s.link}</p>
                  </div>
                </div>
              )}
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
