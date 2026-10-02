"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, useMotion } from "@/lib/motion";

// Example exchange that streams word by word the first time it is seen.
// The full answer is always in the DOM; streaming only changes visibility.
export function AnswerPreview({ question, answer }: { question: string; answer: string }) {
  const words = answer.split(" ");
  const total = words.length;
  const ref = useRef<HTMLElement>(null);
  const played = useRef(false);
  const { allowed } = useMotion();
  const inView = useInView(ref, 0.5);
  const [shown, setShown] = useState(total);
  const [thinking, setThinking] = useState(false);
  useEffect(() => {
    if (!allowed || !inView || played.current) return;
    let timer = 0;
    const stream = (count: number) => {
      setShown(count);
      if (count === total) played.current = true;
      else timer = window.setTimeout(() => stream(count + 1), 45 + Math.random() * 30);
    };
    timer = window.setTimeout(() => {
      setShown(0);
      setThinking(true);
      timer = window.setTimeout(() => {
        setThinking(false);
        stream(1);
      }, 650);
    }, 0);
    return () => {
      clearTimeout(timer);
      setThinking(false);
      setShown(total);
    };
  }, [allowed, inView, total]);
  return (
    <figure ref={ref} className="answer-preview">
      <figcaption>답변 예시 · 프로젝트 본문 인용</figcaption>
      <div className="chat-message user">
        <span>질문</span>
        <p>{question}</p>
      </div>
      <div className="chat-message assistant">
        <span>도훈의 AI</span>
        <p className={shown < total ? "is-streaming" : undefined}>
          {words.map((word, i) => (
            <span key={i} className={i < shown ? "on" : undefined}>
              {i ? ` ${word}` : word}
            </span>
          ))}
        </p>
        {thinking && (
          <div className="chat-thinking" aria-hidden="true">
            <span />
            <span />
            <span /> 프로젝트를 살펴보고 있어요
          </div>
        )}
      </div>
    </figure>
  );
}
