"use client";
import { setMotionPaused, useMotion } from "@/lib/motion";
import { Pause, Play } from "./icons";

// Site-wide pause for looping and decorative motion (WCAG 2.2.2), always in the header.
export function MotionToggle() {
  const { paused } = useMotion();
  return (
    <button
      type="button"
      className="motion-switch"
      aria-pressed={paused}
      aria-label="화면 움직임 멈춤"
      title={paused ? "움직임 다시 켜기" : "움직임 멈추기"}
      onClick={() => setMotionPaused(!paused)}
    >
      {paused ? <Play size={15} /> : <Pause size={15} />}
    </button>
  );
}
