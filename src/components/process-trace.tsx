"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "./icons";
import { useInView, useMotion } from "@/lib/motion";
import { traces, type TraceId } from "@/lib/trace";

// Plays the diagram once each time it scrolls into view (or on hover) and
// otherwise rests on the static design, which is also what the server renders.
export function ProcessTrace({ id }: { id: TraceId }) {
  const trace = traces[id];
  const rest = trace.frames.length - 1;
  const ref = useRef<HTMLDivElement>(null);
  const playing = useRef(false);
  const { allowed } = useMotion();
  const inView = useInView(ref, 0.5);
  const [frame, setFrame] = useState(rest);
  const [replay, setReplay] = useState(0);
  useEffect(() => {
    if (!allowed || !inView) return;
    let index = 0;
    let timer = 0;
    const next = () => {
      setFrame(index);
      if (index === rest) {
        playing.current = false;
        return;
      }
      timer = window.setTimeout(next, trace.frames[index++].hold);
    };
    playing.current = true;
    timer = window.setTimeout(next, 0);
    return () => {
      clearTimeout(timer);
      playing.current = false;
      setFrame(rest);
    };
  }, [allowed, inView, replay, rest, trace]);
  const current = trace.frames[frame];
  const tone = current.nodes[2] === "pass" ? "is-pass" : /^[✕…]/.test(current.log) ? "is-alert" : "";
  return (
    <div
      ref={ref}
      className={`project-art process-art ${id === "harness" ? "harness-art" : "agent-art"}`}
      aria-label={trace.label}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" && !playing.current) setReplay((n) => n + 1);
      }}
    >
      <div className="process-heading">
        {trace.title}
        <span>{trace.subtitle}</span>
      </div>
      <div className="process-steps" data-playing={frame !== rest || undefined}>
        {trace.steps.map((step, i) => (
          <div key={step}>
            <strong className={`is-${current.nodes[i]}`}>{step}</strong>
            {i < 2 && (
              <span className={`trace-wire is-${current.wires[i]}`} aria-hidden="true">
                <ArrowRight size={18} />
                <i />
              </span>
            )}
          </div>
        ))}
      </div>
      <p className={`trace-log ${tone}`} aria-hidden="true">
        {current.log}
      </p>
      <p>{trace.caption}</p>
    </div>
  );
}
