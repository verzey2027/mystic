import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tarot — เลือกสเปรดที่เหมาะกับคุณ",
  description:
    "เปิดไพ่ทาโรต์ออนไลน์กับ MysticFlow เลือกสเปรด 1, 3 หรือ 5 ใบ รับคำทำนายแม่นยำ เข้าใจง่าย ใช้ได้จริง",
  alternates: { canonical: "/tarot" },
  openGraph: {
    title: "Tarot — MysticFlow",
    description: "เลือกสเปรดไพ่ทาโรต์ที่เหมาะกับคำถามของคุณ",
    url: "/tarot",
  },
};

const categories = ["All", "Love", "Career", "Money"];

const spreads = [
  {
    count: 1,
    title: "1-Card Quick",
    description: "Daily guidance and focus.",
    eta: "2 min",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    count: 3,
    title: "3-Card Insight",
    description: "Past, Present, Future clarity.",
    eta: "5 min",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="8" height="12" rx="1.5" />
        <rect x="8" y="2" width="8" height="12" rx="1.5" />
        <rect x="14" y="4" width="8" height="12" rx="1.5" />
      </svg>
    ),
  },
  {
    count: 5,
    title: "5-Card Cross",
    description: "In-depth analysis for complex questions.",
    eta: "10 min",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="7" height="10" rx="1.5" />
        <rect x="8.5" y="2" width="7" height="10" rx="1.5" />
        <rect x="15" y="6" width="7" height="10" rx="1.5" />
        <rect x="5" y="12" width="7" height="10" rx="1.5" />
        <rect x="12" y="12" width="7" height="10" rx="1.5" />
      </svg>
    ),
  },
  {
    count: 10,
    title: "10-Card Celtic Cross",
    description: "Full life overview and deep insight.",
    eta: "15 min",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="3" x2="15" y2="21" />
      </svg>
    ),
  },
];

export default function TarotHomePage() {
  return (
    <main className="mx-auto w-full max-w-lg px-5 py-6">
      {/* ── Title ── */}
      <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
        Tarot
      </h1>

      {/* ── Category chips ── */}
      <div className="mt-4 flex gap-2">
        {categories.map((cat, i) => (
          <button
            key={cat}
            type="button"
            className="rounded-full px-4 py-1.5 text-sm font-medium transition"
            style={{
              background: i === 0 ? "var(--purple-500)" : "transparent",
              color: i === 0 ? "#fff" : "var(--text-muted)",
              border: i === 0 ? "none" : "1px solid var(--border)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Spread cards ── */}
      <div className="mt-5 flex flex-col gap-4">
        {spreads.map((spread) => (
          <article
            key={spread.count}
            className="rounded-2xl border p-5 transition hover:shadow-md"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-elevated)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl"
                style={{ background: "var(--surface-1)" }}
              >
                {spread.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold" style={{ color: "var(--text)" }}>
                  {spread.title}
                </h3>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-subtle)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {spread.eta}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {spread.description}
            </p>
          </article>
        ))}
      </div>

      {/* ── Sticky CTA ── */}
      <div className="sticky bottom-20 z-30 mt-6">
        <Link
          href="/tarot/pick?count=3"
          className="flex w-full items-center justify-center rounded-full py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ background: "var(--purple-500)" }}
        >
          Start 3-Card Insight
        </Link>
      </div>
    </main>
  );
}
