import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

const STORAGE_KEY = "portfolio-motion";
const CHANGE_EVENT = "portfolio-motion:change";
const REDUCE = "(prefers-reduced-motion: reduce)";

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
// True once `threshold` of the element is visible, or, for elements taller
// than the viewport, once they cover that share of the viewport height.
export function useInView(ref: RefObject<Element | null>, threshold: number) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const root = entry.rootBounds?.height ?? window.innerHeight;
        setInView(
          entry.isIntersecting &&
            (entry.intersectionRatio >= threshold || entry.intersectionRect.height >= root * threshold),
        );
      },
      { threshold: Array.from({ length: 11 }, (_, i) => i / 10) },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}
// Plays a CSS-choreographed figure once each time it scrolls into view;
// `replay` restarts it even when little of the figure is on screen.
export function usePlayback(ref: RefObject<Element | null>, ms: number) {
  const { allowed } = useMotion();
  const inView = useInView(ref, 0.6);
  const forced = useRef(false);
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!allowed || (!inView && !forced.current)) return;
    forced.current = false;
    const start = window.setTimeout(() => setPlaying(true), 0);
    const end = window.setTimeout(() => setPlaying(false), ms);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
      setPlaying(false);
    };
  }, [allowed, inView, run, ms]);
  const replay = () => {
    forced.current = true;
    setRun((n) => n + 1);
  };
  return { allowed, playing, run, replay };
}
