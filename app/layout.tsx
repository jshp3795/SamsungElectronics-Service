import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "삼성전자서비스",
  description: "삼성이 안 만들어줘서 내가 만들었다; 우리 증조할머니도 그거보다 더 잘 만들겠다..."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="Pretendard">{children}</body>
    </html>
  );
}