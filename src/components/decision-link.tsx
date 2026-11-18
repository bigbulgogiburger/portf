"use client";
import { useRef, useState } from "react";
import { Link2 } from "lucide-react";

export function DecisionLink({ id }: { id: string }) {
  const [status, setStatus] = useState("");
  const fallback = useRef<HTMLInputElement>(null);
  async function copy() {
    const url = new URL(window.location.href);
    url.hash = id;
    try {
      await navigator.clipboard.writeText(url.href);
      setStatus("주소 복사됨");
    } catch {
      setStatus("주소를 선택해 복사하세요.");
      if (fallback.current) {
        fallback.current.hidden = false;
        fallback.current.value = url.href;
        fallback.current.select();
      }
    }
  }
  return (
    <div className="decision-copy">
      <button onClick={copy} aria-label="결정 주소 복사">
        <Link2 size={15} /> 주소 복사
      </button>
      <small role="status">{status}</small>
      <input ref={fallback} readOnly hidden aria-label="결정 주소" />
    </div>
  );
}
