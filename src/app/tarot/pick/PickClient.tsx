"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TAROT_DECK } from "@/lib/tarot/deck";
import { randomOrientation, shuffleCards } from "@/lib/tarot/engine";
import { trackEvent } from "@/lib/analytics/tracking";

const allowedCounts = new Set([1, 3, 10]);

export default function PickClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawCount = Number(searchParams.get("count") ?? "3");
  const count = allowedCounts.has(rawCount) ? rawCount : 3;
  const shuffled = useMemo(() => shuffleCards(TAROT_DECK), []);
  const [selected, setSelected] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const canSelectMore = selected.length < count;
  const splitIndex = Math.ceil(shuffled.length / 2);
  const deckRows = [shuffled.slice(0, splitIndex), shuffled.slice(splitIndex)];

  useEffect(() => {
    trackEvent("reading_start", { vertical: "tarot", step: "pick_view", count });
  }, [count]);

  function onSelect(cardId: string) {
    if (!canSelectMore || selected.some((token) => token.startsWith(`${cardId}.`))) return;
    setSelected((prev) => [...prev, `${cardId}.${randomOrientation()}`]);
  }

  function submitReading() {
    if (selected.length !== count) return;
    trackEvent("reading_submitted", {
      vertical: "tarot",
      step: "pick_submit",
      count,
      hasQuestion: question.trim().length > 0,
    });
    const params = new URLSearchParams({ count: String(count), cards: selected.join(",") });
    if (question.trim()) params.set("question", question.trim());
    router.push(`/tarot/result?${params.toString()}`);
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 md:py-10">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 p-5 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-200/90">Step 2 of 3</p>
            <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">เลือกไพ่ {count} ใบ</h1>
            <p className="mt-2 text-sm text-slate-200">โฟกัสคำถามในใจ แล้วแตะหลังไพ่ทีละใบให้ครบ</p>
          </div>
          <Link
            href="/tarot"
            className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 py-2 text-sm text-slate-200 hover:bg-white/10"
          >
            ← กลับไปเลือกสเปรด
          </Link>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
        <label className="text-sm text-slate-300" htmlFor="question">
          คำถามของคุณ (ไม่บังคับ แต่แนะนำ)
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="เช่น งานที่กำลังทำ จะไปต่อทิศทางไหนดีในเดือนนี้?"
          className="mt-2 min-h-24 w-full rounded-xl border border-white/10 bg-slate-900/60 p-3.5 text-sm text-slate-100 outline-none transition focus:border-amber-300"
        />
      </section>

      <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-300">
            เลือกแล้ว <span className="font-semibold text-white">{selected.length}</span> / {count}
          </p>
          <button
            type="button"
            onClick={() => setSelected([])}
            className="min-h-10 rounded-full px-3 text-xs text-slate-300 underline-offset-2 hover:text-white hover:underline"
          >
            ล้างการเลือก
          </button>
        </div>

        <div className="overflow-x-auto pb-3">
          <div className="min-w-max space-y-3 px-3 py-2">
            {deckRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-end">
                {row.map((card, index) => {
                  const pickedIndex = selected.findIndex((token) => token.startsWith(`${card.id}.`));
                  const isPicked = pickedIndex >= 0;

                  return (
                    <button
                      key={card.id}
                      type="button"
                      disabled={!canSelectMore && !isPicked}
                      onClick={() => onSelect(card.id)}
                      style={{
                        marginLeft: index === 0 ? 0 : -38,
                        zIndex: isPicked ? 200 + pickedIndex : index,
                        transform: isPicked ? "translateY(-10px)" : "translateY(0px)",
                      }}
                      className={`group relative h-[154px] w-[100px] shrink-0 overflow-hidden rounded-xl border shadow-lg transition ${
                        isPicked
                          ? "border-amber-300 ring-2 ring-amber-300/70"
                          : "border-white/20 hover:-translate-y-1 hover:border-white/40"
                      }`}
                    >
                      <Image src="/fortune/icon/backcard.png" alt="Card back" fill sizes="100px" className="object-cover" />
                      <div className="absolute inset-0 bg-black/20" />

                      {isPicked ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-amber-300/20">
                          <div className="rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-slate-900">ใบที่ {pickedIndex + 1}</div>
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-2 text-xs text-slate-400">สำรับไพ่แบ่ง 2 แถวแบบซ้อนเกยกัน เพื่อให้ฟีลเหมือนเลือกจากไพ่จริง</p>
      </section>

      <section className="sticky bottom-0 mt-5 rounded-2xl border border-white/10 bg-slate-950/85 p-3 backdrop-blur md:static md:bg-transparent md:p-0">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-300 md:text-sm">ครบ {count} ใบแล้ว กดเพื่อไปดูผลคำทำนาย</p>
          <button
            type="button"
            disabled={selected.length !== count}
            onClick={submitReading}
            className="inline-flex min-h-11 items-center rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-amber-500/30 disabled:text-slate-300"
          >
            ดูผลคำทำนาย
          </button>
        </div>
      </section>
    </main>
  );
}
