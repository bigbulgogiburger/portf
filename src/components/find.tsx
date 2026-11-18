"use client";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, ArrowUpRight } from "lucide-react";

type Entry = { title: string; group: string; project: string; href: string };
export function Find({ entries }: { entries: Entry[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const listId = useId();
  const options = useRef<HTMLUListElement>(null);
  function open() {
    if (document.querySelector("dialog[open]")) return;
    setQuery("");
    setSelected(0);
    dialog.current?.showModal();
    input.current?.focus();
  }
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else open();
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  const term = query.trim().toLowerCase();
  const results = entries.filter((e) =>
    term
      ? (e.title + " " + e.project).toLowerCase().includes(term)
      : e.group === "사례",
  );
  return (
    <>
      <button
        className="find-trigger tool"
        onClick={open}
        title="빠른 찾기"
        aria-keyshortcuts="Meta+K Control+K"
      >
        <Search size={17} />
        <span>빠른 찾기</span> <kbd>⌘ K</kbd>
      </button>
      <dialog
        className="finder"
        ref={dialog}
        aria-label="사례·결정·기술 빠른 찾기"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="finder-inner">
          <header>
            <Search />
            <input
              ref={input}
              value={query}
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={
                results.length ? listId + "-" + selected : undefined
              }
              onChange={(e) => {
                setQuery(e.target.value);
                setSelected(0);
                options.current?.scrollTo(0, 0);
              }}
              onKeyDown={(e) => {
                if (
                  e.nativeEvent.isComposing ||
                  e.nativeEvent.keyCode === 229 ||
                  !results.length
                )
                  return;
                if (e.key === "Enter") {
                  e.preventDefault();
                  options.current
                    ?.querySelector<HTMLAnchorElement>('[aria-selected="true"]')
                    ?.click();
                } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                  e.preventDefault();
                  const next =
                    (selected +
                      (e.key === "ArrowDown" ? 1 : -1) +
                      results.length) %
                    results.length;
                  setSelected(next);
                  options.current?.children[next]?.scrollIntoView({
                    block: "nearest",
                  });
                }
              }}
              placeholder="사례, 결정, 기술 찾기"
              aria-label="찾을 내용"
            />
            <button
              className="tool"
              aria-label="찾기 닫기"
              onClick={() => dialog.current?.close()}
            >
              <X />
            </button>
          </header>
          <ul ref={options} id={listId} role="listbox" aria-label="찾기 결과">
            {results.map((r, i) => (
              <li role="presentation" key={r.group + r.project + r.title}>
                <Link
                  href={r.href}
                  id={listId + "-" + i}
                  role="option"
                  tabIndex={-1}
                  aria-selected={selected === i}
                  onPointerMove={() => setSelected(i)}
                  prefetch={false}
                  onClick={() => dialog.current?.close()}
                >
                  <small>{r.group}</small>
                  <span>
                    <strong>{r.title}</strong>
                    {r.group !== "사례" && <em>{r.project}</em>}
                  </span>
                  <ArrowUpRight size={16} />
                </Link>
              </li>
            ))}
          </ul>
          {!results.length && (
            <p role="status">
              일치하는 사례가 없습니다. 기술명이나 프로젝트 이름으로 찾아보세요.
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
