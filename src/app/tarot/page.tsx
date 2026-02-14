import type { Metadata } from "next";
import Link from "next/link";
import { AppBar } from "@/components/nav/AppBar";
import { Chip } from "@/components/ui/Chip";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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

const categories = ["ทั้งหมด", "ความรัก", "การงาน", "การเงิน"];

const spreads = [
  {
    count: 1,
    title: "ไพ่ 1 ใบ",
    description: "ดูดวงรายวัน โฟกัสพลังงานวันนี้",
    eta: "2 นาที",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-fg-muted" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    count: 3,
    title: "ไพ่ 3 ใบ",
    description: "อดีต ปัจจุบัน อนาคต เห็นภาพรวมชัดเจน",
    eta: "5 นาที",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-fg-muted" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="8" height="12" rx="1.5" />
        <rect x="8" y="2" width="8" height="12" rx="1.5" />
        <rect x="14" y="4" width="8" height="12" rx="1.5" />
      </svg>
    ),
  },
  {
    count: 5,
    title: "ไพ่ 5 ใบ",
    description: "วิเคราะห์เจาะลึกสำหรับคำถามซับซ้อน",
    eta: "10 นาที",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-fg-muted" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    title: "ไพ่ 10 ใบ เซลติกครอส",
    description: "ดูภาพรวมชีวิตแบบเจาะลึกที่สุด",
    eta: "15 นาที",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-fg-muted" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    <main className="mx-auto w-full max-w-lg">
      {/* Big title header (Tarot) */}
      <header className="px-5 pt-7 pb-3">
        <AppBar title={<span className="sr-only">Tarot</span>} className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-fg">Tarot</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Choose a spread to get a clear, practical reading.
        </p>

        {/* ── Category chips ── */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {categories.map((cat, i) => (
            <Chip key={cat} selected={i === 0}>
              {cat}
            </Chip>
          ))}
        </div>
      </header>

      <div className="px-5 pb-6">
        {/* ── Spread cards ── */}
        <div className="mt-1 flex flex-col gap-4">
          {spreads.map((spread) => (
            <Link key={spread.count} href={`/tarot/pick?count=${spread.count}`} className="block">
              <Card className="p-5 bg-bg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-surface">
                    {spread.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-fg">{spread.title}</h3>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-fg-subtle">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {spread.eta}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{spread.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        {/* ── Sticky CTA ── */}
        <div className="sticky bottom-20 z-30 mt-6">
          <Link href="/tarot/pick?count=3" className="block">
            <Button className="w-full" size="lg">
              Start a 3-card reading
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
