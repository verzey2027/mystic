"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TAROT_DECK } from "@/lib/tarot/deck";
import { randomOrientation, shuffleCards } from "@/lib/tarot/engine";
import { trackEvent } from "@/lib/analytics/tracking";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HelperText, Label } from "@/components/ui/Input";

const allowedCounts = new Set([1, 3, 10]);

type ShufflePhase = "stacked" | "shuffling" | "spread";

export default function PickClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawCount = Number(searchParams.get("count") ?? "3");
  const count = allowedCounts.has(rawCount) ? rawCount : 3;
  const shuffled = useMemo(() => shuffleCards(TAROT_DECK), []);
  const [selected, setSelected] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [phase, setPhase] = useState<ShufflePhase>("stacked");
  const canSelectMore = selected.length < count;
  const total = shuffled.length;

  useEffect(() => {
    trackEvent("reading_start", { vertical: "tarot", step: "pick_view", count });
    const t1 = setTimeout(() => setPhase("shuffling"), 400);
    const t2 = setTimeout(() => setPhase("spread"), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [count]);

  const onSelect = useCallback(
    (cardId: string) => {
      if (phase !== "spread") return;
      if (!canSelectMore || selected.some((token) => token.startsWith(`${cardId}.`))) return;
      setSelected((prev) => [...prev, `${cardId}.${randomOrientation()}`]);
    },
    [canSelectMore, phase, selected],
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

  // Split deck into 2 rows
  const half = Math.ceil(total / 2);
  const deckRows = [shuffled.slice(0, half), shuffled.slice(half)];

  const showShuffleOverlay = phase !== "spread";

  // Card overlap: negative margin = card width * 2/3 (show 1/3)
  const CARD_W = 72;
  const CARD_H = 110;
  const OVERLAP = -Math.round(CARD_W * (2 / 3));

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 md:py-10">
      {/* ── Header ── */}
      <section
        className="relative overflow-hidden rounded-3xl border p-5 md:p-7"
        style={{
          borderColor: "rgba(244,200,106,0.15)",
          background: "linear-gradient(135deg, #0c0a18 0%, var(--purple-900) 50%, #1a0e2e 100%)",
          backgroundSize: "200% 200%",
          animation: "tarot-drift 14s ease-in-out infinite",
        }}
      >
        {/* Warm glow orb */}
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
          style={{ background: "#f4c86a" }}
        />
        <div
          className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--purple-500)" }}
        />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "#f4c86a" }}
            >
              Step 2 of 3
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">เลือกไพ่ {count} ใบ</h1>
            <p className="mt-2 text-sm" style={{ color: "var(--purple-200)" }}>
              {phase === "spread"
                ? "โฟกัสคำถามในใจ แล้วใช้นิ้วเลื่อนสำรับ แตะไพ่ที่สัญชาตญาณบอก"
                : "✦ กำลังสับไพ่..."}
            </p>
          </div>
          <Link href="/tarot" className="inline-flex">
            <Button variant="ghost">← กลับ</Button>
          </Link>
        </div>
      </section>

      {/* ── Question ── */}
      <Card
        className="mt-4"
        style={{
          borderColor: "rgba(45,226,230,0.15)",
          background: "linear-gradient(160deg, rgba(45,226,230,0.04), rgba(17,14,34,0.92))",
        }}
      >
        <Label htmlFor="question" style={{ color: "#2de2e6" }}>คำถามของคุณ (ไม่บังคับ แต่แนะนำ)</Label>
        <textarea
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="เช่น งานที่กำลังทำ จะไปต่อทิศทางไหนดีในเดือนนี้?"
          className="mt-2 min-h-20 w-full rounded-xl border p-3.5 text-sm text-fg outline-none transition focus-visible:ring-2"
          style={{
            borderColor: "rgba(45,226,230,0.15)",
            background: "rgba(45,226,230,0.03)",
          }}
        />
        <HelperText className="mt-2">พิมพ์สั้นๆ ให้ชัด แล้วค่อยดูผลภาพรวมก่อน</HelperText>
      </Card>

      {/* ── Deck Area ── */}
      <section
        className="relative mt-4 overflow-hidden rounded-2xl border"
        style={{
          borderColor: "rgba(244,200,106,0.1)",
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(139,92,246,0.08), transparent), linear-gradient(180deg, #080612 0%, #0c0a1a 100%)",
        }}
      >
        {/* Ambient mystical glow orbs */}
        <div
          className="pointer-events-none absolute left-1/4 top-1/3 h-40 w-40 rounded-full opacity-15 blur-3xl"
          style={{ background: "#f4c86a" }}
        />
        <div
          className="pointer-events-none absolute right-1/4 bottom-1/4 h-32 w-32 rounded-full opacity-10 blur-3xl"
          style={{ background: "#2de2e6" }}
        />

        <div className="relative z-10 p-4 md:p-5">
          {/* Counter */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-white/70">
              เลือกแล้ว{" "}
              <span className="font-bold" style={{ color: "#f4c86a" }}>{selected.length}</span>{" "}
              <span className="text-white/40">/ {count}</span>
            </p>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="rounded-full px-3 py-1 text-xs transition hover:bg-white/5"
              style={{ color: "var(--purple-300)" }}
            >
              ล้างการเลือก
            </button>
          </div>

          {/* Shuffle overlay */}
          {showShuffleOverlay && (
            <div
              className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl"
              style={{ background: "rgba(8,6,18,0.95)" }}
            >
              {/* Animated shuffle cards */}
              <div className="relative h-36 w-28">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 overflow-hidden rounded-lg border"
                    style={{
                      borderColor: "rgba(244,200,106,0.2)",
                      transform: phase === "shuffling"
                        ? `rotate(${(i - 3) * 15}deg) translateX(${(i - 3) * 10}px) translateY(${Math.sin(i) * 6}px)`
                        : `rotate(${(i - 3) * 0.3}deg)`,
                      transition: `transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 40}ms`,
                      zIndex: i,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.6), 0 0 8px rgba(244,200,106,0.08)",
                    }}
                  >
                    <Image
                      src="https://www.reffortune.com/icon/backcard.png"
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm font-medium" style={{ color: "#f4c86a" }}>
                ✦ สับไพ่ให้พลังงานเข้าที่ ✦
              </p>
              <p className="mt-1 text-xs text-white/30">หายใจลึกๆ โฟกัสคำถามในใจ</p>
            </div>
          )}

          {/* 2 rows — overlapping cards, swipeable */}
          <div className="space-y-4">
            {deckRows.map((row, rowIndex) => (
              <div key={rowIndex}>
                <div
                  className="overflow-x-auto pb-2"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  <div className="flex pl-2 pr-16" style={{ paddingRight: `${CARD_W - Math.abs(OVERLAP) + 16}px` }}>
                    {row.map((card, index) => {
                      const pickedIndex = selected.findIndex((token) => token.startsWith(`${card.id}.`));
                      const isPicked = pickedIndex >= 0;
                      const globalIndex = rowIndex * half + index;

                      return (
                        <button
                          key={card.id}
                          type="button"
                          disabled={phase !== "spread" || (!canSelectMore && !isPicked)}
                          onClick={() => onSelect(card.id)}
                          className="group relative shrink-0 overflow-hidden rounded-lg border focus-visible:outline-none focus-visible:ring-2"
                          style={{
                            width: `${CARD_W}px`,
                            height: `${CARD_H}px`,
                            marginLeft: index === 0 ? 0 : `${OVERLAP}px`,
                            transform: isPicked ? "translateY(-14px) scale(1.1)" : "scale(1)",
                            transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease",
                            zIndex: isPicked ? 200 + pickedIndex : index,
                            boxShadow: isPicked
                              ? "0 0 20px rgba(244,200,106,0.4), 0 8px 24px rgba(0,0,0,0.6)"
                              : "0 2px 8px rgba(0,0,0,0.5)",
                            borderColor: isPicked ? "#f4c86a" : "rgba(255,255,255,0.08)",
                            animation: isPicked ? "tarot-glow-pulse 2.5s ease-in-out infinite" : "none",
                            opacity: phase === "spread" ? 1 : 0,
                            transitionDelay: phase === "spread" ? `${globalIndex * 8}ms` : "0ms",
                          }}
                        >
                          <Image
                            src="https://www.reffortune.com/icon/backcard.png"
                            alt="Card back"
                            fill
                            sizes={`${CARD_W}px`}
                            className="object-cover"
                          />
                          {/* Dark overlay */}
                          <div
                            className="absolute inset-0 transition-opacity duration-300"
                            style={{
                              background: isPicked
                                ? "linear-gradient(to top, rgba(244,200,106,0.15), transparent 60%)"
                                : "linear-gradient(to top, rgba(8,6,18,0.4), transparent 60%)",
                            }}
                          />

                          {/* Hover/touch shimmer */}
                          {!isPicked && (
                            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100">
                              <div
                                className="absolute -top-1/2 left-0 h-[200%] w-8 opacity-30"
                                style={{
                                  background: "linear-gradient(90deg, transparent, rgba(244,200,106,0.5), transparent)",
                                  animation: "tarot-shimmer 2s ease-in-out infinite",
                                }}
                              />
                            </div>
                          )}

                          {/* Selected badge */}
                          {isPicked && (
                            <div
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ background: "rgba(244,200,106,0.1)" }}
                            >
                              <div
                                className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                                style={{
                                  background: "linear-gradient(135deg, #f4c86a, #f9d65c)",
                                  color: "#0b1220",
                                  boxShadow: "0 0 12px rgba(244,200,106,0.4)",
                                }}
                              >
                                ใบที่ {pickedIndex + 1}
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-3 text-center text-xs text-white/30">
            ← ใช้นิ้วเลื่อนสำรับ แล้วแตะไพ่ที่รู้สึก →
          </p>
        </div>
      </section>

      {/* ── Sticky CTA ── */}
      <section
        className="sticky bottom-0 z-30 mt-5 rounded-2xl border p-3 backdrop-blur md:static md:p-0"
        style={{
          borderColor: "rgba(244,200,106,0.12)",
          background: "rgba(8,6,18,0.9)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs md:text-sm text-white/60">
            {selected.length === count
              ? "✦ ครบแล้ว! กดเพื่อดูผลคำทำนาย"
              : `เลือกอีก ${count - selected.length} ใบ`}
          </p>
          <button
            type="button"
            disabled={selected.length !== count}
            onClick={submitReading}
            className="min-h-11 rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 hover:scale-[1.03] disabled:opacity-40 disabled:hover:scale-100"
            style={{
              background: selected.length === count
                ? "linear-gradient(135deg, #f4c86a, #f9d65c)"
                : "rgba(255,255,255,0.06)",
              color: selected.length === count ? "#0b1220" : "var(--purple-300)",
              boxShadow: selected.length === count ? "0 0 20px rgba(244,200,106,0.3)" : "none",
            }}
          >
            ดูผลคำทำนาย →
          </button>
        </div>
      </section>
    </main>
  );
}
