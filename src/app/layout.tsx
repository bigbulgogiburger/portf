import type { Metadata } from "next";
import "@fontsource-variable/dm-sans";
import localFont from "next/font/local";
const pretendard = localFont({ src: "../../public/fonts/PretendardVariable.woff2", variable: "--pretendard", display: "swap", weight: "100 900" });
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3100"),
  ),
  title: {
    default: "편도훈 — Java·Spring 백엔드 개발자",
    template: "%s | 편도훈",
  },
  description:
    "Java·Spring, AI Agent, MSA, DevOps. 기획부터 개발과 운영까지 연결하는 백엔드 엔지니어 편도훈의 포트폴리오.",
  openGraph: {
    title: "편도훈 · Backend × Applied AI",
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
    <html lang="ko" className={pretendard.variable}>
      <body>{children}</body>
    </html>
  );
}
