import Link from "next/link";
import { TAROT_DECK } from "@/lib/tarot/deck";

export default function TarotLibraryPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-fg md:text-4xl">ห้องสมุดไพ่ 78 ใบ</h1>
          <p className="mt-2 text-sm text-fg-muted">ค้นหาความหมายไพ่แต่ละใบแบบรวดเร็ว พร้อมแนวทางเชิงปฏิบัติ</p>
        </div>
        <Link
          href="/library/saved"
          className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-ink transition hover:bg-accent-hover"
        >
          ไปที่คลังของฉัน
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TAROT_DECK.map((card) => (
          <Link
            key={card.id}
            href={`/library/${card.id}`}
            className="rounded-xl border border-border bg-surface p-4 transition hover:border-border-strong hover:bg-surface-2"
          >
            <p className="text-xs uppercase tracking-widest text-fg-subtle">{card.id}</p>
            <h2 className="mt-2 text-base font-semibold text-fg">{card.name}</h2>
            <p className="mt-1 text-xs text-fg-subtle">
              {card.arcana === "major" ? "Major Arcana" : `Minor Arcana • ${card.suit}`}
            </p>
            <p className="mt-2 line-clamp-2 text-sm text-fg-muted">{card.meaningUpright}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
