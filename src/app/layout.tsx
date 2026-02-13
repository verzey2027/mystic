import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BottomTabBar } from "@/components/nav/BottomTabBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://tarot.reffortune.com";
const SITE_NAME = "MysticFlow";
const DEFAULT_TITLE = "MysticFlow — Tarot, Daily Card & Spiritual Guidance";
const DEFAULT_DESCRIPTION =
  "ดูดวงกับ MysticFlow บริการดูดวงไพ่ทาโรต์ ไพ่ Oracle ไพ่รายวัน และ Numerology รับคำแนะนำแม่นยำ เข้าใจง่าย ใช้ได้จริง";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "ดูดวง",
    "ดูดวงออนไลน์",
    "ไพ่ทาโรต์",
    "ไพ่ Oracle",
    "ดวงรายวัน",
    "Numerology",
    "ดูดวงไพ่",
    "เปิดไพ่ทาโรต์",
    "ดูดวงความรัก",
    "ดูดวงการเงิน",
    "ดูดวงการงาน",
    "MysticFlow",
  ],
  authors: [{ name: "MysticFlow", url: SITE_URL }],
  creator: "MysticFlow",
  publisher: "MysticFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "th_TH",
    url: SITE_URL,
    images: [
      {
        url: "/tarot.jpg",
        width: 1200,
        height: 630,
        alt: "MysticFlow — Tarot & Spiritual Guidance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/tarot.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  category: "lifestyle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg pb-20 text-fg`}>
        {children}
        <BottomTabBar />
      </body>
    </html>
  );
}
