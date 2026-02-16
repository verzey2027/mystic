"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Sparkles, Calendar, Ghost, Hash, Star, Heart, CircleDot, Compass, FileText } from "lucide-react";

function trackEvent(event: string, data?: Record<string, unknown>) {
  console.log("[Analytics]", event, data);
}

const exploreItems = [
  {
    title: "ทาโรต์",
    description: "เปิดไพ่ทาโรต์ 1, 3, หรือ 10 ใบ",
    href: "/tarot",
    gradient: "from-violet-100 to-white",
    icon: Sparkles,
  },
  {
    title: "ไพ่รายวัน",
    description: "ไพ่ประจำวันของคุณ",
    href: "/daily-card",
    gradient: "from-rose-50 to-white",
    icon: Calendar,
  },
  {
    title: "เส้นทางจิตวิญญาณ",
    description: "ไพ่ประจำราศี + ไพ่จิตวิญญาณ",
    href: "/spirit-path",
    gradient: "from-teal-50 to-white",
    icon: Ghost,
  },
  {
    title: "เลขศาสตร์",
    description: "วิเคราะห์เบอร์โทรศัพท์",
    href: "/numerology",
    gradient: "from-indigo-50 to-white",
    icon: Hash,
  },
  {
    title: "ดวงชะตา",
    description: "ดูดวงรายวัน รายสัปดาห์ รายเดือน",
    href: "/horoscope",
    gradient: "from-purple-50 to-white",
    icon: Star,
  },
  {
    title: "ความเข้ากัน",
    description: "ดูดวงความรักและความสัมพันธ์",
    href: "/compatibility",
    gradient: "from-pink-50 to-white",
    icon: Heart,
  },
  {
    title: "ปีจีน",
    description: "ดวงตามปีเกิดจีน",
    href: "/chinese-zodiac",
    gradient: "from-red-50 to-white",
    icon: CircleDot,
  },
  {
    title: "เฉพาะทาง",
    description: "การงาน การเงิน หรือความรัก",
    href: "/specialized",
    gradient: "from-amber-50 to-white",
    icon: Compass,
  },
  {
    title: "เลขศาสตร์ชื่อ",
    description: "วิเคราะห์ชื่อภาษาไทย",
    href: "/name-numerology",
    gradient: "from-cyan-50 to-white",
    icon: FileText,
  },
];

const popularSpreads = [
  {
    title: "ไพ่ 3 ใบ",
    description: "อดีต ปัจจุบัน อนาคต",
    href: "/tarot/pick?count=3",
    icon: Sparkles,
  },
  {
    title: "ดวงรายวัน",
    description: "ดูดวงประจำวันของคุณ",
    href: "/horoscope/daily",
    icon: Calendar,
  },
  {
    title: "ความรัก",
    description: "ดูดวงความรักและความสัมพันธ์",
    href: "/compatibility",
    icon: Heart,
  },
  {
    title: "ปีจีน",
    description: "ดวงตามปีเกิดจีนของคุณ",
    href: "/chinese-zodiac",
    icon: CircleDot,
  },
];

function todayDate() {
  const d = new Date();
  const days = [
    "อาทิตย์",
    "จันทร์",
    "อังคาร",
    "พุธ",
    "พฤหัสบดี",
    "ศุกร์",
    "เสาร์",
  ];
  const months = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];
  return `วัน${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "สวัสดีตอนเช้า";
  if (hour < 16) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
}

export default function Home() {
  useEffect(() => {
    trackEvent("landing_view", { step: "home" });
  }, []);

  return (
    <main className="mx-auto w-full max-w-lg">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-600" />
          <span className="font-serif text-xl font-semibold text-violet-600">MysticFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-violet-600 hover:border-violet-300 transition-colors"
            aria-label="ค้นหา"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <Link
            href="/library/saved"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-violet-600 hover:border-violet-300 transition-colors"
            aria-label="Saved"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="px-5 pt-4">
        <div className="rounded-[28px] border border-violet-200 bg-white/80 backdrop-blur-sm p-5 shadow-[0_4px_20px_rgba(124,58,237,0.08)]">
          <p className="text-sm font-medium text-gray-500">{greeting()}</p>
          <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-gray-900">
            ค้นหาคำตอบที่คุณ
            <span className="text-gradient">ตามหา</span>
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            ทาโรต์ • ดวงชะตา • ความรัก • ปีจีน • เลขศาสตร์ — สรุปสั้น อ่านง่าย เหมาะกับมือถือ
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Link href="/tarot" className="block">
              <button className="w-full h-11 rounded-xl bg-violet-600 text-white font-medium text-sm shadow-lg shadow-violet-200 hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-200 transition-all active:scale-[0.98]">
                เริ่มดูไพ่
              </button>
            </Link>
            <Link href="/horoscope" className="block">
              <button className="w-full h-11 rounded-xl bg-white border border-violet-200 text-violet-600 font-medium text-sm hover:bg-violet-50 hover:border-violet-300 transition-all active:scale-[0.98]">
                ดวงชะตา
              </button>
            </Link>
            <Link href="/compatibility" className="block">
              <button className="w-full h-11 rounded-xl bg-white border border-violet-200 text-violet-600 font-medium text-sm hover:bg-violet-50 hover:border-violet-300 transition-all active:scale-[0.98]">
                ความรัก
              </button>
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-[20px] border border-violet-200 bg-violet-50/50 px-4 py-3">
            <div>
              <p className="text-xs font-medium text-gray-500">คำแนะนำวันนี้</p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">{todayDate()}</p>
            </div>
            <Link href="/daily-card" className="shrink-0">
              <button className="h-9 px-4 rounded-lg bg-white border border-violet-200 text-violet-600 text-sm font-medium hover:bg-violet-50 hover:border-violet-300 transition-all">
                เปิดไพ่
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Explore ── */}
      <section className="px-5 pt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-xl font-semibold text-gray-900">สำรวจ</h2>
          <Link href="/library" className="text-sm text-violet-600 hover:text-violet-700">ดูทั้งหมด →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {exploreItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-[20px] border border-gray-200 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(124,58,237,0.12)] hover:border-violet-200"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-violet-600 shadow-sm`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <p className="mt-3 text-sm font-semibold text-gray-900">{item.title}</p>
              <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Popular Spreads ── */}
      <section className="pt-6 pb-4">
        <div className="px-5">
          <h2 className="font-serif text-xl font-semibold text-gray-900 mb-3">สเปรดยอดนิยม</h2>
        </div>
        <div
          className="flex gap-3 overflow-x-auto px-5 pb-2 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {popularSpreads.map((spread) => (
            <Link
              key={spread.title}
              href={spread.href}
              className="flex w-40 flex-shrink-0 flex-col gap-2 rounded-[20px] border border-gray-200 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(124,58,237,0.12)] hover:border-violet-200"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <spread.icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{spread.title}</p>
              <p className="line-clamp-2 text-xs text-gray-500">
                {spread.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
