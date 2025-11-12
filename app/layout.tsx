import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/Chatbot/ChatWidget";
import AchievementNotification from "@/components/Gamification/AchievementNotification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bản Đồ Lịch Sử Việt Nam 1858-1930",
  description: "Khám phá lịch sử đấu tranh chống thực dân Pháp qua bản đồ tương tác",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <ChatWidget />
        <AchievementNotification />
      </body>
    </html>
  );
}
