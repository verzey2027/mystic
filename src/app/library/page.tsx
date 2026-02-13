import Link from "next/link";
import { TAROT_DECK } from "@/lib/tarot/deck";

export default function TarotLibraryPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      <h1 className="text-3xl font-semibold text-white md:text-4xl">ห้องสมุดไพ่ 78 ใบ</h1>
      <p className="mt-2 text-sm text-slate-300">
        ค้นหาความหมายไพ่แต่ละใบแบบรวดเร็ว พร้อมแนวทางเชิงปฏิบัติ
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TAROT_DECK.map((card) => (
          <Link
            key={card.id}
            href={`/library/${card.id}`}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/25 hover:bg-white/[0.06]"
          >
            <p className="text-xs uppercase tracking-widest text-slate-400">{card.id}</p>
            <h2 className="mt-2 text-base font-semibold text-white">{card.name}</h2>
            <p className="mt-1 text-xs text-slate-400">
              {card.arcana === "major" ? "Major Arcana" : `Minor Arcana • ${card.suit}`}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-slate-300">{card.meaningUpright}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
