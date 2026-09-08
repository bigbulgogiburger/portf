"use client";
import { projects } from "@/data/portfolio";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "./icons";
export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="편도훈 홈">
        d<span>h</span>
        <i />
      </Link>
      <nav
        aria-label="주 메뉴"
        className={open ? "nav-links open" : "nav-links"}
      >
        <Link onClick={() => setOpen(false)} href="/#work">
          프로젝트 <span>{String(projects.length).padStart(2, "0")}</span>
        </Link>
        <Link onClick={() => setOpen(false)} href="/#about">
          소개
        </Link>
        <Link onClick={() => setOpen(false)} href="/#experience">
          경력
        </Link>
        <Link
          onClick={() => setOpen(false)}
          href="/#contact"
          className="nav-contact"
        >
          연락처 <ArrowUpRight size={15} />
        </Link>
      </nav>
      <button
        className="menu-toggle"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
