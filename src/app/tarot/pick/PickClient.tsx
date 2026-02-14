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
  
  const [shuffled, setShuffled] = useState<typeof TAROT_DECK>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [isShuffling, setIsShuffling] = useState(true);
  
  const canSelectMore = selected.length < count;

  // Initial shuffle animation
  useEffect(() => {
    setShuffled(shuffleCards(TAROT_DECK));
    const timer = setTimeout(() => setIsShuffling(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    trackEvent("reading_start", { vertical: "tarot", step: "pick_view", count });
  }, [count]);

  const onToggleSelect = useCallback(
    (cardId: string) => {
      const pickedIndex = selected.findIndex((token) => token.startsWith(`${cardId}.`));
      
      if (pickedIndex >= 0) {
        // Deselect
        setSelected((prev) => prev.filter((_, i) => i !== pickedIndex));
      } else {
        // Select
        if (!canSelectMore) return;
        setSelected((prev) => [...prev, `${cardId}.${randomOrientation()}`]);
      }
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

  // Split 78 cards into 5 rows (approx 15-16 cards each)
  const rows = useMemo(() => {
    const r = [];
    const size = 16;
    for (let i = 0; i < shuffled.length; i += size) {
      r.push(shuffled.slice(i, i + size));
    }
    return r;
  }, [shuffled]);

  const steps = [
    { num: 1, label: "เลือกสเปรด" },
    { num: 2, label: "เลือกไพ่" },
    { num: 3, label: "ผลลัพธ์" },
  ];

  return (
    <main className="mx-auto w-full max-w-lg px-5 py-4 overflow-hidden flex flex-col min-h-screen">
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

      {/* ── 5-6 Rows of Overlapping Cards ── */}
      <div className="mt-8 flex flex-col gap-1 select-none">
        {rows.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className="flex -space-x-12 px-8 overflow-x-auto no-scrollbar py-2"
          >
            {row.map((card, idx) => {
              const pickedIndex = selected.findIndex((token) => token.startsWith(`${card.id}.`));
              const isPicked = pickedIndex >= 0;

              return (
                <button
                  key={`${card.id}-${idx}`}
                  type="button"
                  onClick={() => onToggleSelect(card.id)}
                  className={cn(
                    "relative w-16 aspect-[2.5/4] flex-shrink-0 transition-all duration-500 transform",
                    isShuffling ? "translate-x-[200%] opacity-0" : "opacity-100",
                    isPicked ? "z-50 -translate-y-4 scale-125" : "hover:z-10 hover:-translate-y-2 shadow-sm",
                    !canSelectMore && !isPicked ? "opacity-40" : "opacity-100"
                  )}
                  style={{
                    transitionDelay: isShuffling ? `${(idx + rowIndex * 10) * 10}ms` : '0ms',
                  }}
                >
                  <div className={cn(
                    "h-full w-full rounded-lg border overflow-hidden bg-bg-elevated shadow-md",
                    isPicked ? "border-accent ring-2 ring-accent/30" : "border-border"
                  )}>
                    <Image
                      src="https://www.reffortune.com/icon/backcard.png"
                      alt="Card back"
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    {isPicked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-accent/20 backdrop-blur-[1px]">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-black text-accent-ink shadow-md">
                          {pickedIndex + 1}
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Card slots (Indicators) ── */}
      <div className="mt-auto pt-6 flex items-center justify-center gap-3">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} 
            className={cn(
              "h-2.5 rounded-full transition-all duration-500",
              i < selected.length ? "w-8 bg-accent" : "w-2.5 bg-border"
            )} 
          />
        ))}
      </div>

      {/* ── CTA Button ── */}
      <div className="mt-6 mb-4">
        <Button
          type="button"
          disabled={selected.length !== count || isShuffling}
          onClick={submitReading}
          className="w-full rounded-full"
          size="lg"
        >
          {isShuffling ? "กำลังสับไพ่..." : "ดูผลคำทำนาย"}
        </Button>
      </div>
    </main>
  );
}
