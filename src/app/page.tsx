"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/tracking";
import { AppBar } from "@/components/nav/AppBar";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const exploreItems = [
  {
    title: "ทาโรต์",
    description: "เปิดไพ่ทาโรต์ 1, 3, หรือ 10 ใบ",
    href: "/tarot",
    gradient: "from-accent-soft to-bg",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="6" x2="12" y2="6.01" />
        <line x1="12" y1="18" x2="12" y2="18.01" />
      </svg>
    ),
  },
  {
    title: "ไพ่รายวัน",
    description: "ไพ่ประจำวันของคุณ",
    href: "/daily-card",
    gradient: "from-rose-100/70 to-bg",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    title: "เส้นทางจิตวิญญาณ",
    description: "ไพ่ประจำราศี + ไพ่จิตวิญญาณ",
    href: "/spirit-path",
    gradient: "from-teal-100/70 to-bg",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "เลขศาสตร์",
    description: "วิเคราะห์เบอร์โทรศัพท์",
    href: "/numerology",
    gradient: "from-indigo-100/70 to-bg",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    ),
  },
  {
    title: "ดวงชะตา",
    description: "ดูดวงรายวัน รายสัปดาห์ รายเดือน",
    href: "/horoscope",
    gradient: "from-purple-100/70 to-bg",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    title: "ความเข้ากัน",
    description: "ดูดวงความรักและความสัมพันธ์",
    href: "/compatibility",
    gradient: "from-pink-100/70 to-bg",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: "ปีจีน",
    description: "ดวงตามปีเกิดจีน",
    href: "/chinese-zodiac",
    gradient: "from-red-100/70 to-bg",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "เฉพาะทาง",
    description: "การงาน การเงิน หรือความรัก",
    href: "/specialized",
    gradient: "from-amber-100/70 to-bg",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: "เลขศาสตร์ชื่อ",
    description: "วิเคราะห์ชื่อภาษาไทย",
    href: "/name-numerology",
    gradient: "from-cyan-100/70 to-bg",
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
];

const popularSpreads = [
  {
    title: "ไพ่ 3 ใบ",
    description: "อดีต ปัจจุบัน อนาคต",
    href: "/tarot/pick?count=3",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: "ดวงรายวัน",
    description: "ดูดวงประจำวันของคุณ",
    href: "/horoscope/daily",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),
  },
  {
    title: "ความรัก",
    description: "ดูดวงความรักและความสัมพันธ์",
    href: "/compatibility",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-accent"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: "ปีจีน",
    description: "ดวงตามปีเกิดจีนของคุณ",
    href: "/chinese-zodiac",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
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
      <AppBar
        title="MysticFlow"
        right={
          <>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] border border-border bg-[var(--glass-bg)] backdrop-blur-xl"
              aria-label="ค้นหา"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-fg-muted"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <Link
              href="/library/saved"
              className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] border border-border bg-[var(--glass-bg)] backdrop-blur-xl"
              aria-label="Saved"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-fg-muted"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </Link>
          </>
        }
      />

      {/* ── Hero ── */}
      <section className="px-5 pt-4">
        <Card variant="glass" className="p-5">
          <p className="text-sm font-medium text-fg-muted">{greeting()}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">
            ดูคำตอบให้ชัดขึ้น
            <span className="text-accent"> ในไม่กี่นาที</span>
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            ทาโรต์ • ดวงชะตา • ความรัก • ปีจีน • เลขศาสตร์ — สรุปสั้น อ่านง่าย เหมาะกับมือถือ
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Link href="/tarot" className="block">
              <Button className="w-full" size="lg">
                เริ่มดูไพ่
              </Button>
            </Link>
            <Link href="/horoscope" className="block">
              <Button className="w-full" size="lg" variant="secondary">
                ดวงชะตา
              </Button>
            </Link>
            <Link href="/compatibility" className="block">
              <Button className="w-full" size="lg" variant="secondary">
                ความรัก
              </Button>
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-[20px] border border-border bg-surface px-4 py-3">
            <div>
              <p className="text-xs font-medium text-fg-muted">คำแนะนำวันนี้</p>
              <p className="mt-0.5 text-sm font-semibold text-fg">{todayDate()}</p>
            </div>
            <Link href="/daily-card" className="shrink-0">
              <Button size="sm" variant="ghost">
                เปิดไพ่
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* ── Explore ── */}
      <section className="px-5 pt-6">
        <SectionHeader title="สำรวจ" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          {exploreItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-[var(--radius-lg)] border border-border bg-bg p-4 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
            >
              <div
                className={
                  "flex h-11 w-11 items-center justify-center rounded-[20px] border border-border bg-gradient-to-br text-accent shadow-[var(--shadow-soft)] " +
                  item.gradient
                }
              >
                {item.icon}
              </div>
              <p className="mt-3 text-sm font-semibold text-fg">{item.title}</p>
              <p className="mt-0.5 text-xs text-fg-muted line-clamp-2">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Popular Spreads ── */}
      <section className="pt-6 pb-4">
        <div className="px-5">
          <SectionHeader title="สเปรดยอดนิยม" />
        </div>
        <div
          className="mt-3 flex gap-4 overflow-x-auto px-5 pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {popularSpreads.map((spread) => (
            <Link
              key={spread.title}
              href={spread.href}
              className="flex w-44 flex-shrink-0 flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-bg p-4 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[20px] border border-border bg-surface text-accent shadow-[var(--shadow-soft)]">
                {spread.icon}
              </div>
              <p className="text-sm font-semibold text-fg">{spread.title}</p>
              <p className="line-clamp-2 text-xs text-fg-muted">
                {spread.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
