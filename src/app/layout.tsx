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

export const metadata: Metadata = {
  title: "ดูดวงกับเรฟ - REFFORTUNE | ไพ่ทาโรต์ โหราศาสตร์ และคำทำนายแม่นยำ",
  description:
    "ดูดวงกับเรฟ บริการดูดวงไพ่ทาโรต์ โหราศาสตร์ ไพ่เทพออราเคิล และมหาสัตตเลข รับคำแนะนำตรงจุด แม่นยำ ใช้งานได้จริง วางแผนชีวิตได้อย่างมั่นใจ พร้อมแพ็กเกจดูดวงที่เหมาะกับคุณ",
  keywords: [
    "ดูดวง",
    "ดูดวงออนไลน์",
    "ไพ่ทาโรต์",
    "โหราศาสตร์",
    "ไพ่ Oracle",
    "ดวงรายวัน",
    "วิเคราะห์เบอร์มงคล",
    "REFFORTUNE",
  ],
  openGraph: {
    type: "website",
    title: "ดูดวงกับเรฟ - REFFORTUNE | ไพ่ทาโรต์ โหราศาสตร์ และคำทำนายแม่นยำ",
    description:
      "รับคำทำนายแม่นๆ จากหมอดูตัวจริง ดูดวงไพ่ ไพ่ทาโรต์ ไพ่ Oracle โหราศาสตร์ และมหาสัตตเลข พร้อมภาพสวย เข้าใจง่าย ใช้ได้จริง",
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "ดูดวงกับเรฟ - REFFORTUNE | ไพ่ทาโรต์ โหราศาสตร์ และคำทำนายแม่นยำ",
    description:
      "เปิดไพ่ดูดวงกับเรฟ! คำแนะนำแม่นยำ เข้าใจง่าย สไตล์ทันสมัย เชื่อถือได้ พร้อมวางแผนชีวิตในทุกด้าน",
  },
};

function FloatingMenu() {
  return (
    <div className="fixed bottom-5 right-4 z-50">
      <details className="group relative">
        <summary className="flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-full bg-amber-300 text-slate-900 shadow-lg">
          ☰
        </summary>
        <div className="absolute bottom-14 right-0 w-56 space-y-2 rounded-2xl border border-white/15 bg-slate-900/95 p-3 text-sm shadow-2xl backdrop-blur">
          <Link href="/" className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-white/10">หน้าแรก</Link>
          <Link href="/tarot" className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-white/10">ไพ่ทาโรต์</Link>
          <Link href="/spirit-card" className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-white/10">ไพ่จิตวิญญาณ</Link>
          <Link href="/numerology" className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-white/10">วิเคราะห์เบอร์มงคล</Link>
          <Link href="/library" className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-white/10">ห้องสมุดไพ่</Link>
          <Link href="/pricing" className="block rounded-lg px-3 py-2 text-slate-100 hover:bg-white/10">แพ็กเกจ</Link>
          <a href="https://line.me/R/ti/p/@reffortune" target="_blank" rel="noreferrer" className="block rounded-lg bg-amber-300 px-3 py-2 text-center font-semibold text-slate-900">แอดไลน์ @reffortune</a>
        </div>
      </details>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 pb-20 text-slate-100`}
      >
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/85 backdrop-blur">
          <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-semibold tracking-wide text-amber-200">
              REFFORTUNE ✦
            </Link>
            <div className="hidden items-center gap-4 text-sm text-slate-300 md:flex">
              <Link href="/tarot" className="hover:text-white">Tarot</Link>
              <Link href="/spirit-card" className="hover:text-white">Spirit</Link>
              <Link href="/numerology" className="hover:text-white">Numerology</Link>
              <Link href="/library" className="hover:text-white">Library</Link>
              <Link href="/pricing" className="hover:text-white">Pricing</Link>
            </div>
          </nav>
          <div className="border-t border-white/10 bg-amber-300/15 px-4 py-2 text-center text-xs text-amber-100 md:text-sm">
            <span className="font-semibold">ดูดวงออนไลน์กับเรฟ</span> •
            <a href="https://line.me/R/ti/p/@reffortune" target="_blank" rel="noreferrer" className="ml-2 font-semibold underline underline-offset-2">
              แอดไลน์ @reffortune
            </a>
          </div>
        </header>
        {children}
        <FloatingMenu />
      </body>
    </html>
  );
}
