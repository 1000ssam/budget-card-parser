import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://budget-card-parser.vercel.app'),
  title: "사업관리카드 파서",
  description: "학교 예산 사업관리카드 엑셀 파일을 정규화된 테이블로 변환",
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: "사업관리카드 파서",
    description: "들여쓰기로 병합된 엑셀 파일을 정규화된 테이블로 변환합니다",
    url: "https://budget-card-parser.vercel.app",
    siteName: "사업관리카드 파서",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "사업관리카드 파서",
    description: "들여쓰기로 병합된 엑셀 파일을 정규화된 테이블로 변환합니다",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
