import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HereNow — 今ここでしか読めないSNS",
  description:
    "投稿は「特定の場所・特定の時間」にいる人にだけ届く、位置×時間限定の新しいSNS。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
