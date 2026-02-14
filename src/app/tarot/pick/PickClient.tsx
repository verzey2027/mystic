"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { TAROT_DECK } from "@/lib/tarot/deck";
import { randomOrientation, shuffleCards } from "@/lib/tarot/engine";
import { trackEvent } from "@/lib/analytics/tracking";

const allowedCounts = new Set([1, 2, 3, 4, 10]);

export default function PickClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawCount = Number(searchParams.get("count") ?? "3");
  const count = allowedCounts.has(rawCount) ? rawCount : 3;
  const shuffled = useMemo(() => shuffleCards(TAROT_DECK), []);
  const [selected, setSelected] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const canSelectMore = selected.length < count;

  useEffect(() => {
    trackEvent("reading_start", { vertical: "tarot", step: "pick_view", count });
  }, [count]);

  const onSelect = useCallback(
    (cardId: string) => {
      if (!canSelectMore || selected.some((token) => token.startsWith(`${cardId}.`))) return;
      setSelected((prev) => [...prev, `${cardId}.${randomOrientation()}`]);
    },
    [canSelectMore, selected]
  );

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

  // Use first 9 cards for the 3x3 grid display
  const displayCards = shuffled.slice(0, 9);

  const steps = [
    { num: 1, label: "เลือกสเปรด" },
    { num: 2, label: "เลือกไพ่" },
    { num: 3, label: "ผลลัพธ์" },
  ];

  return (
    <main className="mx-auto w-full max-w-lg px-5 py-4">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between">
        <Link
          href="/tarot"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
          aria-label="Back"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-fg"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <p className="text-sm font-semibold text-fg">MysticFlow</p>
        <Link href="/library/saved" className="flex items-center gap-1 text-xs font-medium text-fg-muted">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </Link>
      </div>

      {/* ── Step indicator ── */}
      <div className="mt-5 flex items-center justify-center gap-0">
        {steps.map((step, i) => {
          const isActive = step.num === 2;
          const isDone = step.num < 2;

          return (
            <div key={step.num} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                    isActive
                      ? "bg-accent text-accent-ink"
                      : isDone
                        ? "bg-accent-soft text-accent border border-border"
                        : "bg-surface text-fg-subtle border border-border"
                  )}
                >
                  {step.num}
                </div>
                <span
                  className={cn(
                    "mt-1 text-[10px] font-medium",
                    isActive ? "text-accent" : "text-fg-subtle"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-3 mb-4 h-[2px] w-12",
                    i === 0 ? "bg-accent" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Title ── */}
      <h1 className="mt-5 text-center text-lg font-bold text-fg">แตะเลือกไพ่ {count} ใบ</h1>

      {/* ── Question (optional) ── */}
      <div className="mt-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="คำถามของคุณ (ไม่บังคับ)"
          className="w-full rounded-xl border border-border bg-bg-elevated px-4 py-2.5 text-sm text-fg outline-none transition focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* ── 3×3 Card Grid ── */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        {displayCards.map((card) => {
          const pickedIndex = selected.findIndex((token) => token.startsWith(`${card.id}.`));
          const isPicked = pickedIndex >= 0;

          return (
            <button
              key={card.id}
              type="button"
              disabled={!canSelectMore && !isPicked}
              onClick={() => onSelect(card.id)}
              className={cn(
                "relative aspect-[2.5/3.5] overflow-hidden rounded-xl border-2 bg-bg-elevated transition-all duration-300",
                isPicked
                  ? "border-accent ring-2 ring-ring scale-[0.97]"
                  : "border-border shadow-sm",
                !canSelectMore && !isPicked ? "opacity-50" : "opacity-100"
              )}
            >
              <Image
                src="https://www.reffortune.com/icon/backcard.png"
                alt="Card back"
                fill
                sizes="120px"
                className="object-cover opacity-15"
              />
              {isPicked && (
                <div className="absolute inset-0 flex items-center justify-center bg-accent-soft">
                  <div className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-ink">
                    {pickedIndex + 1}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Card slots ── */}
      <div className="mt-6 flex items-center justify-center gap-4">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex h-14 w-14 items-center justify-center rounded-full border-2",
                i < selected.length
                  ? "border-accent bg-accent-soft"
                  : "border-border border-dashed bg-transparent"
              )}
            >
              {i < selected.length && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-accent"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="text-xs font-medium text-fg-subtle">ใบที่ {i + 1}</span>
          </div>
        ))}
      </div>

      {/* ── CTA Button ── */}
      <div className="mt-6">
        <Button
          type="button"
          disabled={selected.length !== count}
          onClick={submitReading}
          className="w-full rounded-full"
          size="lg"
        >
          ดูผลคำทำนาย
        </Button>
      </div>
    </main>
  );
}
