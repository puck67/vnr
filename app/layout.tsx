import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/Chatbot/ChatWidget";
import AchievementNotification from "@/components/Gamification/AchievementNotification";

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
      <body className="antialiased">
        {children}
        <ChatWidget />
        <AchievementNotification />
      </body>
    </html>
  );
}
