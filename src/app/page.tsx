"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/tracking";

const exploreItems = [
  {
    title: "ทาโรต์",
    href: "/tarot",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--purple-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="6" x2="12" y2="6.01" />
        <line x1="12" y1="18" x2="12" y2="18.01" />
      </svg>
    ),
  },
  {
    title: "ไพ่รายวัน",
    href: "/daily-card",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--purple-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    title: "ไพ่จิตวิญญาณ",
    href: "/spirit-card",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--purple-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "เลขศาสตร์",
    href: "/numerology",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--purple-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--purple-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: "ความรัก",
    description: "ดูดวงความรักและความสัมพันธ์",
    href: "/tarot/pick?count=3",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--purple-400)" stroke="var(--purple-500)" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: "การงาน",
    description: "ดูดวงการงานและอาชีพ",
    href: "/tarot/pick?count=3",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--purple-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
];

function todayDate() {
  const d = new Date();
  const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return `วัน${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

export default function Home() {
  useEffect(() => {
    trackEvent("landing_view", { step: "home" });
  }, []);

  return (
    <main className="mx-auto w-full max-w-lg">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-5 pt-6 pb-2">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          MysticFlow
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: "var(--surface-1)" }}
            aria-label="ค้นหา"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <Link
            href="/library/saved"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
            style={{ background: "var(--surface-1)", color: "var(--text-muted)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </Link>
        </div>
      </header>

      {/* ── Today's Guidance ── */}
      <section className="px-5 pt-4">
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--purple-100)" }}
        >
          <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>
            คำแนะนำวันนี้
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {todayDate()}
          </p>
          <Link
            href="/daily-card"
            className="mt-4 flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: "var(--purple-400)" }}
          >
            เปิดไพ่รายวัน
          </Link>
        </div>
      </section>

      {/* ── Explore ── */}
      <section className="px-5 pt-6">
        <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>
          สำรวจ
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {exploreItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex flex-col gap-3 rounded-2xl border p-4 transition hover:shadow-md"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-elevated)",
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: "var(--purple-50)" }}
              >
                {item.icon}
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Popular Spreads ── */}
      <section className="pt-6 pb-4">
        <div className="px-5">
          <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>
            สเปรดยอดนิยม
          </h2>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto px-5 pb-2" style={{ scrollbarWidth: "none" }}>
          {popularSpreads.map((spread) => (
            <Link
              key={spread.title}
              href={spread.href}
              className="flex w-40 flex-shrink-0 flex-col gap-2 rounded-2xl border p-4 transition hover:shadow-md"
              style={{
                borderColor: "var(--border)",
                background: "var(--bg-elevated)",
              }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: "var(--purple-50)" }}
              >
                {spread.icon}
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {spread.title}
              </p>
              <p className="line-clamp-2 text-xs" style={{ color: "var(--text-subtle)" }}>
                {spread.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
