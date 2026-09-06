import type { Metadata } from "next";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/noto-sans-kr";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3100"),
  ),
  title: {
    default: "편도훈 — AI 서비스를 만드는 백엔드 엔지니어",
    template: "%s | 편도훈",
  },
  description:
    "Java·Spring, AI Agent, MSA, DevOps. 기획부터 개발과 운영까지 연결하는 백엔드 엔지니어 편도훈의 포트폴리오.",
  openGraph: {
    title: "편도훈 · Backend × Applied AI",
    description: "생각을 구조로. AI를 서비스로.",
    locale: "ko_KR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
