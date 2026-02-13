"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { TAROT_DECK } from "@/lib/tarot/deck";
import { cardMeaning } from "@/lib/tarot/engine";
import { DrawnCard } from "@/lib/tarot/types";

function drawOneCard(): DrawnCard {
  const card = TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)] ?? TAROT_DECK[0];
  return {
    card,
    orientation: Math.random() > 0.3 ? "upright" : "reversed",
  };
}

export default function DailyCardPage() {
  const [drawn, setDrawn] = useState<DrawnCard>(() => drawOneCard());

  const orientationLabel = drawn.orientation === "upright" ? "ตั้งตรง" : "กลับหัว";

  const guidance = useMemo(() => {
    const focus =
      drawn.orientation === "upright"
        ? drawn.card.keywordsUpright.slice(0, 3)
        : drawn.card.keywordsReversed.slice(0, 3);

    return {
      energy: cardMeaning(drawn),
      focus,
      action:
        drawn.orientation === "upright"
          ? "เลือก 1 งานสำคัญและลงมือภายในวันนี้ทันที"
          : "ชะลอการตัดสินใจที่เสี่ยง แล้วตรวจข้อมูลอีก 1 รอบ",
      avoid:
        drawn.orientation === "upright"
          ? "อย่าทำหลายเรื่องพร้อมกันจนเสียโฟกัส"
          : "อย่าปล่อยอารมณ์ชั่ววูบมากำหนดการกระทำ",
    };
  }, [drawn]);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold text-white md:text-4xl">Daily Card</h1>
      <p className="mt-3 text-slate-300">สุ่มไพ่ 1 ใบสำหรับพลังงานประจำวัน พร้อมคำแนะนำสั้น กระชับ ใช้ได้จริง</p>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-200/90">Your card today</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {drawn.card.nameTh ?? drawn.card.name}
        </h2>
        <p className="mt-1 text-sm text-slate-300">{drawn.card.name} • {orientationLabel}</p>

        {drawn.card.image ? (
          <Image
            src={drawn.card.image}
            alt={drawn.card.name}
            width={360}
            height={540}
            className="mt-4 w-full max-w-xs rounded-2xl border border-white/10 object-cover"
          />
        ) : null}

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <article className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
            <h3 className="text-sm font-semibold text-white">พลังวันนี้</h3>
            <p className="mt-2 text-sm text-slate-300">{guidance.energy}</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
            <h3 className="text-sm font-semibold text-white">โฟกัสหลัก</h3>
            <p className="mt-2 text-sm text-slate-300">{guidance.focus.join(" • ")}</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
            <h3 className="text-sm font-semibold text-white">Action แนะนำ</h3>
            <p className="mt-2 text-sm text-slate-300">{guidance.action}</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
            <h3 className="text-sm font-semibold text-white">สิ่งที่ควรเลี่ยง</h3>
            <p className="mt-2 text-sm text-slate-300">{guidance.avoid}</p>
          </article>
        </div>

        <button
          type="button"
          onClick={() => setDrawn(drawOneCard())}
          className="mt-6 rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
        >
          สุ่มใหม่
        </button>
      </section>
    </main>
  );
}
