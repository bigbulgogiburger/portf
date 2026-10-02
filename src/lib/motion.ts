import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

const STORAGE_KEY = "portfolio-motion";
const CHANGE_EVENT = "portfolio-motion:change";
const REDUCE = "(prefers-reduced-motion: reduce)";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*<>";

let paused: boolean | null = null;
function isPaused() {
  if (paused === null) {
    try {
      paused = localStorage.getItem(STORAGE_KEY) === "paused";
    } catch {
      paused = false;
    }
  }
  return paused;
}
function isAllowed() {
  return !isPaused() && !matchMedia(REDUCE).matches;
}
// CSS reads html[data-motion="paused"] to settle reveals and view transitions.
function syncRoot() {
  if (isPaused()) document.documentElement.dataset.motion = "paused";
  else delete document.documentElement.dataset.motion;
}
function subscribe(onChange: () => void) {
  syncRoot();
  const media = matchMedia(REDUCE);
  media.addEventListener("change", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}
const onServer = () => false;

// Site-wide pause, remembered per visitor; reduced-motion users never see decorative motion.
export function setMotionPaused(next: boolean) {
  paused = next;
  try {
    if (next) localStorage.setItem(STORAGE_KEY, "paused");
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
  syncRoot();
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
export function useMotion() {
  return {
    paused: useSyncExternalStore(subscribe, isPaused, onServer),
    allowed: useSyncExternalStore(subscribe, isAllowed, onServer),
  };
}
export function useInView(ref: RefObject<Element | null>, threshold: number) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}
// Resolves left to right; spaces and slashes never scramble so the label keeps its shape.
export function scrambleText(text: string, progress: number, random: () => number) {
  if (progress >= 1) return text;
  return [...text]
    .map((ch, i) =>
      ch === " " || ch === "/" || progress >= 0.25 + (0.75 * i) / text.length
        ? ch
        : GLYPHS[Math.floor(random() * GLYPHS.length)],
    )
    .join("");
}
