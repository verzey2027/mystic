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

const allowedCounts = new Set([1, 2, 3, 4, 5, 6, 10]);

export default function PickClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawCount = Number(searchParams.get("count") ?? "3");
  const count = allowedCounts.has(rawCount) ? rawCount : 3;
  
  const [shuffled, setShuffled] = useState<typeof TAROT_DECK>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [shufflePhase, setShufflePhase] = useState<'stack' | 'mix' | 'fan'>('stack');
  
  const canSelectMore = selected.length < count;

  // Realistic shuffle sequence
  useEffect(() => {
    setShuffled(shuffleCards(TAROT_DECK));
    
    // 1. Start stacked
    const t1 = setTimeout(() => setShufflePhase('mix'), 200);
    // 2. Mix around in center
    const t2 = setTimeout(() => setShufflePhase('fan'), 1000);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
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
        // Select - Always use upright (no reversed cards)
        if (!canSelectMore) return;
        setSelected((prev) => [...prev, `${cardId}.upright`]);
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
      <div className="mt-8 relative h-[420px] w-full select-none overflow-hidden rounded-3xl border border-white/10 bg-black/5 p-4">
        {shufflePhase === 'fan' ? (
          <div className="flex flex-col gap-1 h-full overflow-y-auto no-scrollbar py-2">
            {rows.map((row, rowIndex) => (
              <div 
                key={rowIndex} 
                className="flex -space-x-12 px-8 py-2 animate-[tarot-fade-up_0.6s_ease-out_both]"
                style={{ animationDelay: `${rowIndex * 100}ms` }}
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
                        "relative w-16 aspect-[2.5/4] flex-shrink-0 transition-all duration-300 transform",
                        isPicked ? "z-50 -translate-y-4 scale-125" : "hover:z-10 hover:-translate-y-2 shadow-sm",
                        !canSelectMore && !isPicked ? "opacity-40" : "opacity-100"
                      )}
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
        ) : (
          /* Shuffle Animation View */
          <div className="relative h-full w-full flex items-center justify-center">
            {shuffled.slice(0, 40).map((card, idx) => (
              <div
                key={idx}
                className="absolute w-20 aspect-[2.5/4] rounded-lg border-2 border-white/20 overflow-hidden bg-bg-elevated shadow-2xl transition-all duration-500"
                style={{
                  transform: shufflePhase === 'stack' 
                    ? `translateY(${idx * 0.2}px) rotate(${idx * 0.5}deg)`
                    : `translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 50}px) rotate(${(Math.random() - 0.5) * 30}deg)`,
                  zIndex: idx,
                  opacity: 1 - (idx * 0.02),
                }}
              >
                <Image
                  src="https://www.reffortune.com/icon/backcard.png"
                  alt="Shuffling"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ))}
            <div className="absolute bottom-10 animate-bounce text-xs font-bold text-accent uppercase tracking-widest">
              Shuffling Deck...
            </div>
          </div>
        )}
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
          disabled={selected.length !== count || shufflePhase !== 'fan'}
          onClick={submitReading}
          className="w-full rounded-full"
          size="lg"
        >
          {shufflePhase !== 'fan' ? "กำลังสับไพ่..." : "ดูผลคำทำนาย"}
        </Button>
      </div>
    </main>
  );
}
