import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "사업관리카드 파서",
  description: "학교 예산 사업관리카드 엑셀 파일을 정규화된 테이블로 변환",
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
