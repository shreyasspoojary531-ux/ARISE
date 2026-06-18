import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARISE // Become The Strongest Version Of Yourself",
  description: "ARISE transforms self-improvement into a journey of quests, habits, learning, fitness, and meaningful progression. Turn your life into an RPG. Every action counts. Every day matters.",
  keywords: ["ARISE", "RPG self-improvement", "habit tracker", "gym progression", "skill tree", "gamified productivity", "open source developer tool"],
  openGraph: {
    title: "ARISE // Become The Strongest Version Of Yourself",
    description: "ARISE transforms self-improvement into a journey of quests, habits, learning, fitness, and meaningful progression.",
    url: "https://arise.dev",
    siteName: "ARISE RPG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARISE // Become The Strongest Version Of Yourself",
    description: "ARISE transforms self-improvement into a journey of quests, habits, learning, fitness, and meaningful progression.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white">{children}</body>
    </html>
  );
}
