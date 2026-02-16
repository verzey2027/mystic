import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Clock, Layers, Grid3X3, LayoutGrid } from "lucide-react";

export const metadata: Metadata = {
  title: "ทาโรต์ — เลือกสเปรดที่เหมาะกับคุณ",
  description:
    "เปิดไพ่ทาโรต์ออนไลน์กับ MysticFlow เลือกสเปรด 1, 3, 5 หรือ 10 ใบ รับคำทำนายแม่นยำ เข้าใจง่าย ใช้ได้จริง",
  alternates: { canonical: "/tarot" },
  openGraph: {
    title: "ทาโรต์ — MysticFlow",
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
    icon: Layers,
  },
  {
    count: 3,
    title: "ไพ่ 3 ใบ",
    description: "อดีต ปัจจุบัน อนาคต เห็นภาพรวมชัดเจน",
    eta: "5 นาที",
    icon: Grid3X3,
  },
  {
    count: 4,
    title: "ไพ่ 4 ใบ",
    description: "แผนปฏิบัติการ - สถานการณ์ อุปสรรค คำแนะนำ ผลลัพธ์",
    eta: "8 นาที",
    icon: LayoutGrid,
  },
  {
    count: 5,
    title: "ไพ่ 5 ใบ",
    description: "วิเคราะห์เจาะลึกสำหรับคำถามซับซ้อน",
    eta: "10 นาที",
    icon: LayoutGrid,
  },
  {
    count: 6,
    title: "ไพ่ 6 ใบ",
    description: "ความสัมพันธ์เชิงลึก - คุณ เขา อดีต ปัจจุบัน อนาคต ผลลัพธ์",
    eta: "12 นาที",
    icon: LayoutGrid,
  },
  {
    count: 10,
    title: "ไพ่ 10 ใบ เซลติกครอส",
    description: "ดูภาพรวมชีวิตแบบเจาะลึกที่สุด",
    eta: "15 นาที",
    icon: LayoutGrid,
  },
];

export default function TarotHomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <span className="font-serif text-lg font-semibold text-violet-600">MysticFlow</span>
        </Link>
      </header>

      {/* Title Section */}
      <section className="px-5 pt-4 pb-3">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-900">
          ทาโรต์
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          เลือกสเปรดที่เหมาะกับคำถามของคุณ
        </p>

        {/* Category Chips */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                i === 0
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-violet-50 hover:text-violet-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Spread Cards */}
      <section className="px-5 pb-6">
        <div className="flex flex-col gap-3">
          {spreads.map((spread) => (
            <Link
              key={spread.count}
              href={`/tarot/pick?count=${spread.count}`}
              className="block"
            >
              <div className="p-5 bg-white border border-gray-200 rounded-[24px] transition-all hover:border-violet-300 hover:shadow-[0_8px_32px_rgba(124,58,237,0.12)] hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                    <spread.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">{spread.title}</h3>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {spread.eta}
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{spread.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Sticky CTA */}
        <div className="fixed bottom-20 left-0 right-0 px-5 z-30">
          <div className="max-w-lg mx-auto">
            <Link href="/tarot/pick?count=3" className="block">
              <button className="w-full h-12 rounded-xl bg-violet-300 text-violet-800 font-medium shadow-lg shadow-violet-100 hover:bg-violet-400 hover:shadow-violet-200 transition-all active:scale-[0.98]">
                เริ่มดูไพ่ 3 ใบ
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
