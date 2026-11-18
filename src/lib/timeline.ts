import { career, profile, projects } from "@/data/portfolio";

// Months are counted from the first month of work (profile.since).
const monthOf = (year: number, month: number) => year * 12 + month - 1;
const [sinceYear, sinceMonth] = profile.since.split("-").map(Number);
const origin = monthOf(sinceYear, sinceMonth);

export type Span = { start: number; length: number; loose: boolean };
// Reads "2022.02 – 2023.11", "2023.11 — 현재" or a bare year. A bare year has no
// published months, so it is marked loose and drawn as an outline.
export function span(period: string, now: Date): Span {
  const current = monthOf(now.getFullYear(), now.getMonth() + 1);
  const dates = [...period.matchAll(/(\d{4})(?:\.(\d{2}))?/g)];
  const [first, last] = [dates[0], dates[dates.length - 1]];
  const loose = !first[2];
  const start = monthOf(Number(first[1]), Number(first[2] ?? 1));
  const end = period.includes("현재") ? current : Math.min(current, monthOf(Number(last[1]), Number(last[2] ?? 12)));
  return { start: start - origin, length: end - start + 1, loose };
}

export function timeline(now = new Date()) {
  const months = monthOf(now.getFullYear(), now.getMonth() + 1) - origin + 1;
  const years = [];
  for (let year = sinceYear + 1; year <= now.getFullYear(); year++) years.push({ label: String(year), at: monthOf(year, 1) - origin });
  return {
    months,
    years,
    companies: [...career].reverse().map((c) => ({ name: c.company, role: c.role, ...span(c.period, now) })),
    rows: [...projects]
      .map((p) => ({ id: p.id, number: p.number, title: p.title, period: p.period, ...span(p.period, now) }))
      .sort((a, b) => a.start - b.start || a.number.localeCompare(b.number)),
  };
}
