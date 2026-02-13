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

const bottomTabs = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Tarot", href: "/tarot", icon: "tarot" },
  { label: "Library", href: "/library", icon: "library" },
  { label: "Profile", href: "#", icon: "profile" },
];

function BottomTabIcon({ type }: { type: string }) {
  switch (type) {
    case "home":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "tarot":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="6" x2="12" y2="6.01" />
          <line x1="12" y1="18" x2="12" y2="18.01" />
        </svg>
      );
    case "library":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "profile":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        borderTop: "1px solid var(--border)",
        background: "#FFFFFF",
        zIndex: 9999,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around py-1.5">
        {bottomTabs.map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-[11px] transition-colors"
            style={{ color: tab.icon === "home" ? "var(--purple-500)" : "var(--text-subtle)" }}
          >
            <BottomTabIcon type={tab.icon} />
            <span className="font-medium">{tab.label}</span>
          </Link>
        ))}
      </div>
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg pb-20 text-fg`}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
