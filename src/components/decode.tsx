"use client";
import { useEffect, useRef, useState } from "react";
import { scrambleText, useInView, useMotion } from "@/lib/motion";

// Latin mono kicker that decodes once when it first scrolls into view.
// Screen readers get the plain text; the scrambling copy is hidden from them.
export function Decode({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  const { allowed } = useMotion();
  const inView = useInView(ref, 0.6);
  const [shown, setShown] = useState(text);
  useEffect(() => {
    if (!allowed || !inView || done.current) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = (now - start) / 700;
      setShown(scrambleText(text, progress, Math.random));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else done.current = true;
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      setShown(text);
    };
  }, [allowed, inView, text]);
  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
