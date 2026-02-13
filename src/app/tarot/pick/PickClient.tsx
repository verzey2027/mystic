"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TAROT_DECK } from "@/lib/tarot/deck";
import { randomOrientation, shuffleCards } from "@/lib/tarot/engine";
import { trackEvent } from "@/lib/analytics/tracking";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HelperText, Label } from "@/components/ui/Input";

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
  const chunkSize = Math.ceil(shuffled.length / 3);
  const deckRows = [
    shuffled.slice(0, chunkSize),
    shuffled.slice(chunkSize, chunkSize * 2),
    shuffled.slice(chunkSize * 2),
  ];

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
      <section className="rounded-3xl border border-border bg-gradient-to-br from-rose/15 to-teal/10 p-5 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent/90">Step 2 of 3</p>
            <h1 className="mt-2 text-2xl font-semibold text-fg md:text-3xl">เลือกไพ่ {count} ใบ</h1>
            <p className="mt-2 text-sm text-fg-muted">โฟกัสคำถามในใจ แล้วแตะหลังไพ่ทีละใบให้ครบ</p>
          </div>
          <Link href="/tarot" className="inline-flex">
            <Button variant="ghost">← กลับไปเลือกสเปรด</Button>
          </Link>
        </div>
      </section>

      <Card className="mt-4">
        <Label htmlFor="question">คำถามของคุณ (ไม่บังคับ แต่แนะนำ)</Label>
        <textarea
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="เช่น งานที่กำลังทำ จะไปต่อทิศทางไหนดีในเดือนนี้?"
          className="mt-2 min-h-24 w-full rounded-xl border border-border bg-surface-2 p-3.5 text-sm text-fg outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
        />
        <HelperText className="mt-2">พิมพ์สั้นๆ ให้ชัด แล้วค่อยดูผลภาพรวมก่อน</HelperText>
      </Card>

      <Card className="mt-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-fg-muted">
            เลือกแล้ว <span className="font-semibold text-fg">{selected.length}</span> / {count}
          </p>
          <button
            type="button"
            onClick={() => setSelected([])}
            className="min-h-10 rounded-full px-3 text-xs text-fg-muted underline-offset-2 hover:text-fg hover:underline"
          >
            ล้างการเลือก
          </button>
        </div>

        <div className="overflow-x-auto pb-3">
          <div className="min-w-max space-y-5 px-3 py-3">
            {deckRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-end pl-2">
                {row.map((card, index) => {
                  const pickedIndex = selected.findIndex((token) => token.startsWith(`${card.id}.`));
                  const isPicked = pickedIndex >= 0;

                  // 3-row spread: slight fan per row + mild per-card offset.
                  const overlap = 34;
                  const baseRotate = rowIndex === 0 ? -3 : rowIndex === 1 ? 0 : 3;
                  const rotate = baseRotate + ((index % 7) - 3) * 0.6;

                  return (
                    <button
                      key={card.id}
                      type="button"
                      disabled={!canSelectMore && !isPicked}
                      onClick={() => onSelect(card.id)}
                      style={{
                        marginLeft: index === 0 ? 0 : -overlap,
                        zIndex: isPicked ? 200 + pickedIndex : index,
                        transform: isPicked
                          ? `translateY(-10px) rotate(${baseRotate}deg)`
                          : `rotate(${rotate}deg)`,
                      }}
                      className={`group relative h-[154px] w-[100px] shrink-0 overflow-hidden rounded-xl border shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isPicked
                          ? "border-accent"
                          : "border-border-strong hover:-translate-y-1 hover:border-border-strong"
                      }`}
                    >
                      <Image
                        src="https://www.reffortune.com/icon/backcard.png"
                        alt="Card back"
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-bg/20" />

                      {isPicked ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-accent/15">
                          <div className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-ink">
                            ใบที่ {pickedIndex + 1}
                          </div>
                        </div>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <HelperText className="mt-2">
          สำรับไพ่แบ่ง 2 แถวแบบซ้อนเกยกัน เพื่อให้ฟีลเหมือนเลือกจากไพ่จริง
        </HelperText>
      </Card>

      <section className="sticky bottom-0 mt-5 rounded-2xl border border-border bg-bg/85 p-3 backdrop-blur md:static md:bg-transparent md:p-0">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-fg-muted md:text-sm">ครบ {count} ใบแล้ว กดเพื่อไปดูผลคำทำนาย</p>
          <Button disabled={selected.length !== count} onClick={submitReading}>
            ดูผลคำทำนาย
          </Button>
        </div>
      </section>
    </main>
  );
}
