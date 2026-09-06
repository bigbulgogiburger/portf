"use client";
import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, ArrowUpRight } from "./icons";

type Message = { role: "user" | "assistant"; content: string };
type Source = { id: string; title: string };
const questions = [
  "백엔드 경험을 요약해 주세요",
  "AI를 실제로 어떻게 활용했나요?",
  "가장 인상적인 프로젝트는?",
];
export function Chat({ embedded = false }: { embedded?: boolean }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  useEffect(() => () => controllerRef.current?.abort(), []);
  useEffect(() => {
    if (!embedded && open) {
      dialogRef.current?.showModal();
      inputRef.current?.focus();
    } else if (!embedded) dialogRef.current?.close();
  }, [open, embedded]);
  useEffect(() => {
    historyRef.current?.scrollTo({
      top: historyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy, error]);
  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }
  async function submit(question = input) {
    const text = question.trim();
    if (!text || busy) return;
    const next: Message[] = [...messages, { role: "user", content: text }];
    if (next.length > 15) {
      setError("대화가 길어졌어요. 새 대화를 시작해 주세요.");
      return;
    }
    setInput("");
    setMessages(next);
    setError("");
    setBusy(true);
    setSources([]);
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: controller.signal,
      });
      if (response.status === 429)
        throw new Error("잠시 쉬어갈게요. 1분 후 다시 질문해 주세요.");
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error ||
            "답변을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
        );
      setMessages([...next, { role: "assistant", content: result.answer }]);
      setSources(result.sources || []);
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      setMessages(next.slice(0, -1));
      setInput(text);
      setError(
        e instanceof Error
          ? e.message
          : "연결이 원활하지 않습니다. 잠시 후 다시 시도해 주세요.",
      );
    } finally {
      setBusy(false);
      controllerRef.current = null;
    }
  }
  const panel = (
    <>
      <div className="chat-header">
        <div className="assistant-avatar">
          <Sparkles size={19} />
        </div>
        <div>
          <strong>도훈의 AI</strong>
          <span>PORTFOLIO ASSISTANT</span>
        </div>
        <button
          className="chat-reset"
          disabled={busy || !messages.length}
          onClick={() => {
            setMessages([]);
            setSources([]);
            setError("");
          }}
        >
          새 대화
        </button>
        {!embedded && (
          <button
            className="icon-button"
            aria-label="챗봇 닫기"
            onClick={close}
          >
            <X size={20} />
          </button>
        )}
      </div>
      <div className="chat-history" ref={historyRef}>
        <div className="chat-welcome">
          <span className="eyebrow">HELLO, CURIOUS HUMAN.</span>
          <h3>
            안녕하세요.
            <br />
            도훈님에 대해 궁금한가요?
          </h3>
          <p>
            경력과 프로젝트를 함께 살펴봐요.
            <br />
            공개된 포트폴리오를 바탕으로 답변합니다.
          </p>
        </div>
        {!messages.length && (
          <div className="suggested-questions">
            {questions.map((q) => (
              <button key={q} disabled={busy} onClick={() => submit(q)}>
                {q}
                <ArrowUpRight size={15} />
              </button>
            ))}
          </div>
        )}
        <div role="log" aria-label="대화 내용" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`chat-message ${m.role}`}>
              <span>{m.role === "assistant" ? "도훈의 AI" : "나"}</span>
              <p>{m.content}</p>
            </div>
          ))}
        </div>
        {busy && (
          <div className="chat-thinking" role="status">
            <span />
            <span />
            <span /> 프로젝트를 살펴보고 있어요
          </div>
        )}
        {!!sources.length && (
          <div className="chat-sources">
            <span>관련 프로젝트</span>
            {sources.map((s) => (
              <a key={s.id} href={`/projects/${s.id}`}>
                {s.title}
                <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        )}
        {error && (
          <div className="chat-error" role="alert">
            {error} <a href="mailto:dohoon321@gmail.com">이메일로 연락하기 ↗</a>
          </div>
        )}
      </div>
      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <label
          className="sr-only"
          htmlFor={embedded ? "chat-embedded" : "chat-floating"}
        >
          경력과 프로젝트 질문
        </label>
        <input
          ref={inputRef}
          id={embedded ? "chat-embedded" : "chat-floating"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="도훈님에 대해 물어보세요"
          maxLength={800}
          disabled={busy}
          autoComplete="off"
        />
        <button
          disabled={busy || !input.trim()}
          type="submit"
          aria-label="질문 보내기"
        >
          <Send size={17} />
        </button>
      </form>
      <p className="chat-disclosure">
        AI 답변은 오류가 있을 수 있습니다. <a href="/privacy">이용 안내</a>
        <br />
        질문은 OpenAI로 전송됩니다. 개인정보는 입력하지 마세요.
      </p>
    </>
  );
  if (embedded) return <div className="chat-panel embedded-chat">{panel}</div>;
  return (
    <>
      <button
        ref={triggerRef}
        className="chat-launcher"
        aria-label="도훈의 AI 챗봇 열기"
        onClick={() => setOpen(true)}
      >
        <Sparkles size={19} />
        <span>도훈의 AI에게 물어보기</span>
        <i />
      </button>
      <dialog
        ref={dialogRef}
        className="chat-panel chat-dialog"
        aria-label="도훈의 AI 포트폴리오 어시스턴트"
        onCancel={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {panel}
      </dialog>
    </>
  );
}
