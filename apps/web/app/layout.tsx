import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RunFinder",
  description: "現在地から指定距離のランニングコースを動的生成",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full flex flex-col">
        <header className="flex items-center justify-between h-12 px-4 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shrink-0">
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">RunFinder</h1>
        </header>
        <main className="flex-1 overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
