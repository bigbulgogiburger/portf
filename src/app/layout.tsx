import type { Metadata } from "next";
import "@fontsource-variable/dm-sans";
import localFont from "next/font/local";
// Renamed subset of Pretendard Variable (OFL Reserved Font Name); rebuild with scripts/subset-font.py.
const portfSans = localFont({ src: "../../public/fonts/PortfSansVariable.woff2", variable: "--portf-sans", display: "swap", weight: "100 900" });
import "./globals.css";
import "./v3.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3100"),
  ),
  title: {
    default: "편도훈 — 백엔드 × AI Native 개발자",
    template: "%s | 편도훈",
  },
  description:
    "백엔드 × AI Native 개발자 편도훈의 포트폴리오. Java·Spring으로 업무 시스템을 만들고, AI 개발을 검증 절차로 통제합니다.",
  openGraph: {
    title: "편도훈 · 백엔드 × AI Native 개발자",
    description: "결제·회원·A/S 서비스 설계와 운영, CS AI Agent와 AI Coding 도구 개발.",
    locale: "ko_KR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={portfSans.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
