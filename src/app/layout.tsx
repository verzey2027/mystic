import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { BottomTabBar } from "@/components/nav/BottomTabBar";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="th" data-theme="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script
          // Handle dynamic theme override from localStorage
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const LS_LANGUAGE = "mf:language";
    const LS_THEME = "mf:theme";

    // Set defaults only if not exists
    if (localStorage.getItem(LS_LANGUAGE) == null) {
      localStorage.setItem(LS_LANGUAGE, JSON.stringify("th"));
    }
    if (localStorage.getItem(LS_THEME) == null) {
      localStorage.setItem(LS_THEME, JSON.stringify("light"));
    }

    const theme = JSON.parse(localStorage.getItem(LS_THEME) || '"light"');
    const el = document.documentElement;
    if (theme === "system") el.removeAttribute("data-theme");
    else el.setAttribute("data-theme", theme);
  } catch (e) {}
})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-bg pb-20 text-fg`}>
        <ThemeProvider>
          {children}
          <BottomTabBar />
        </ThemeProvider>
      </body>
    </html>
  );
}
