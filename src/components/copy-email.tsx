"use client";
import { useEffect, useRef, useState } from "react";
import { copyEmail } from "@/lib/copy-email";

// Copy button next to a mailto link; the link keeps working for people with a mail app.
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    const result = await copyEmail(email, {
      writeText: navigator.clipboard?.writeText.bind(navigator.clipboard),
      openMailto: (href) => {
        window.location.href = href;
      },
    });
    if (result !== "copied") return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }
  return (
    <>
      <button type="button" className="copy-email" aria-label="이메일 주소 복사" onClick={copy}>
        {copied ? "복사됨" : "복사"}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "이메일 주소를 복사했습니다" : ""}
      </span>
    </>
  );
}
