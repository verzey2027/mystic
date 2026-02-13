import type { Metadata } from "next";
import Link from "next/link";
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

const SITE_URL = "https://www.reffortune.com";
const SITE_NAME = "REFFORTUNE — ดูดวงกับเรฟ";
const DEFAULT_TITLE = "ดูดวงกับเรฟ - REFFORTUNE | ไพ่ทาโรต์ โหราศาสตร์ และคำทำนายแม่นยำ";
const DEFAULT_DESCRIPTION =
  "ดูดวงกับเรฟ บริการดูดวงไพ่ทาโรต์ โหราศาสตร์ ไพ่เทพออราเคิล และมหาสัตตเลข รับคำแนะนำตรงจุด แม่นยำ ใช้งานได้จริง วางแผนชีวิตได้อย่างมั่นใจ พร้อมแพ็กเกจดูดวงที่เหมาะกับคุณ";

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
    "โหราศาสตร์",
    "ไพ่ Oracle",
    "ดวงรายวัน",
    "วิเคราะห์เบอร์มงคล",
    "ดูดวงไพ่",
    "หมอดูออนไลน์",
    "ดวงชะตา",
    "เปิดไพ่ทาโรต์",
    "ดูดวงความรัก",
    "ดูดวงการเงิน",
    "ดูดวงการงาน",
    "REFFORTUNE",
    "ดูดวงกับเรฟ",
  ],
  authors: [{ name: "REFFORTUNE", url: SITE_URL }],
  creator: "REFFORTUNE",
  publisher: "REFFORTUNE",
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
    description:
      "รับคำทำนายแม่นๆ จากหมอดูตัวจริง ดูดวงไพ่ ไพ่ทาโรต์ ไพ่ Oracle โหราศาสตร์ และมหาสัตตเลข พร้อมภาพสวย เข้าใจง่าย ใช้ได้จริง",
    locale: "th_TH",
    url: SITE_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "REFFORTUNE — ดูดวงกับเรฟ ไพ่ทาโรต์ โหราศาสตร์",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description:
      "เปิดไพ่ดูดวงกับเรฟ! คำแนะนำแม่นยำ เข้าใจง่าย สไตล์ทันสมัย เชื่อถือได้ พร้อมวางแผนชีวิตในทุกด้าน",
    images: ["/og-image.png"],
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

const bottomTabs = [
  { label: "หน้าแรก", href: "/", icon: "home" },
  { label: "บริการ", href: "/tarot", icon: "services" },
  { label: "นัดหมาย", href: "#", icon: "calendar" },
  { label: "โปรไฟล์", href: "#", icon: "profile" },
];

function BottomTabIcon({ type }: { type: string }) {
  switch (type) {
    case "home":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "services":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      );
    case "calendar":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "profile":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    default:
      return null;
  }
}

function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t backdrop-blur-lg"
      style={{ borderColor: "var(--border)", background: "rgba(16,12,34,0.92)", boxShadow: "0 -2px 20px rgba(0,0,0,0.3)", zIndex: 9999 }}
    >
      <div className="flex items-center justify-around py-2 px-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
        {bottomTabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-[11px] transition-colors"
            style={{ color: tab.icon === "home" ? "var(--purple-400)" : "var(--text-subtle)" }}
          >
            <BottomTabIcon type={tab.icon} />
            <span className="font-medium">{tab.label}</span>
          </Link>
        ))}
      </div>
      {/* Safe area for iPhone notch */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg pb-24 text-fg`}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
