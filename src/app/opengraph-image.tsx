import { ImageResponse } from "next/og";

export const alt = "Dohoon Pyun — Backend Engineer & AI Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", background: "#10120f", color: "#f0f1e9", display: "flex", flexDirection: "column", padding: 70, justifyContent: "space-between" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 21, color: "#b6c2a5" }}><span>DOHOON PYUN</span><span>PORTFOLIO / 2026</span></div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 80, fontWeight: 700, letterSpacing: -4, lineHeight: 1.12 }}><span>Engineered to work.</span><span style={{ color: "#d1f58a" }}>Built to make an impact.</span></div>
      <div style={{ display: "flex", borderTop: "1px solid #465535", paddingTop: 30, fontSize: 23, color: "#c5d0b6" }}>BACKEND ENGINEERING × APPLIED AI</div>
    </div>, size,
  );
}
