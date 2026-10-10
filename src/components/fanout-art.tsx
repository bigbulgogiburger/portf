"use client";
import { useRef } from "react";
import { usePlayback } from "@/lib/motion";
import { fanout } from "@/lib/fanout";

// Matches the last keyframe in the .fanout-art block of globals.css.
const PLAY_MS = 2000;

// Static publish/subscribe sketch; when motion is allowed the event travels
// from the member change to every subscriber once per view (or on hover).
export function FanoutArt({ controls = false }: { controls?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { allowed, playing, run, replay } = usePlayback(ref, PLAY_MS);
  const { source, topic, subscriber } = fanout;
  return (
    <div
      ref={ref}
      className="project-art fanout-art"
      data-playing={playing || undefined}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" && !playing) replay();
      }}
    >
      <div className="process-heading">
        {fanout.title}
        <span>{fanout.subtitle}</span>
        {controls && allowed && (
          <button type="button" className="replay-button" onClick={replay}>
            흐름 다시 보기
          </button>
        )}
      </div>
      <ol className="fanout" key={run} aria-label={fanout.label}>
        <li className="fanout-node">
          <strong>{source.name}</strong>
          <span>{source.detail}</span>
        </li>
        <li className="fanout-node">
          <strong>{topic.name}</strong>
          <span>{topic.detail}</span>
        </li>
        <li className="fanout-subs">
          {[0, 1].map((n) => (
            <div key={n} className="fanout-node" aria-hidden={n > 0 || undefined}>
              <strong>{subscriber}</strong>
            </div>
          ))}
        </li>
      </ol>
      <p>{fanout.caption}</p>
    </div>
  );
}
