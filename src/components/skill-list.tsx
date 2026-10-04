"use client";
import { useState } from "react";
import type { Skill } from "@/data/portfolio";

// Shows the first few skills per group (those with a named project come first).
const VISIBLE = 5;
export function SkillList({ skills }: { skills: Skill[] }) {
  const [open, setOpen] = useState(false);
  const hidden = skills.length - VISIBLE;
  return (
    <>
      <ul className={open ? "skill-list open" : "skill-list"}>
        {skills.map((s, i) => (
          <li key={s.name} className={i >= VISIBLE ? "skill-extra" : undefined}>
            {s.name}
            {s.where && <small>{s.where}</small>}
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <button
          type="button"
          className="skill-more"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "접기" : `기술 ${hidden}개 더 보기`}
        </button>
      )}
    </>
  );
}
