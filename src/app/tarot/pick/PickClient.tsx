"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
    [canSelectMore, selected],
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
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: "var(--surface-1)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>MysticFlow</p>
        <Link
          href="/library/saved"
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </Link>
      </div>

      {/* ── Step indicator ── */}
      <div className="mt-5 flex items-center justify-center gap-0">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: step.num === 2 ? "var(--purple-500)" : step.num < 2 ? "var(--purple-100)" : "var(--surface-1)",
                  color: step.num === 2 ? "#fff" : step.num < 2 ? "var(--purple-500)" : "var(--text-subtle)",
                  border: step.num > 2 ? "1px solid var(--border)" : "none",
                }}
              >
                {step.num}
              </div>
              <span className="mt-1 text-[10px] font-medium" style={{ color: step.num === 2 ? "var(--purple-500)" : "var(--text-subtle)" }}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="mx-3 h-[2px] w-12"
                style={{ background: i === 0 ? "var(--purple-400)" : "var(--border)", marginBottom: "16px" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Title ── */}
      <h1 className="mt-5 text-center text-lg font-bold" style={{ color: "var(--text)" }}>
        แตะเลือกไพ่ {count} ใบ
      </h1>

      {/* ── Question (optional) ── */}
      <div className="mt-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="คำถามของคุณ (ไม่บังคับ)"
          className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition focus:ring-2"
          style={{
            borderColor: "var(--border)",
            background: "var(--bg-elevated)",
            color: "var(--text)",
            "--tw-ring-color": "var(--ring)",
          } as React.CSSProperties}
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
              className="relative overflow-hidden rounded-xl border-2 transition-all duration-300"
              style={{
                aspectRatio: "2.5 / 3.5",
                borderColor: isPicked ? "var(--purple-500)" : "var(--border)",
                background: "var(--bg-elevated)",
                boxShadow: isPicked ? "0 0 12px rgba(139, 92, 246, 0.25)" : "0 1px 4px rgba(0,0,0,0.06)",
                transform: isPicked ? "scale(0.95)" : "scale(1)",
                opacity: !canSelectMore && !isPicked ? 0.5 : 1,
              }}
            >
              <Image
                src="https://www.reffortune.com/icon/backcard.png"
                alt="Card back"
                fill
                sizes="120px"
                className="object-cover"
                style={{ opacity: 0.15 }}
              />
              {isPicked && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(139,92,246,0.08)" }}>
                  <div
                    className="rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{ background: "var(--purple-500)" }}
                  >
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
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                border: i < selected.length ? "2px solid var(--purple-500)" : "2px dashed var(--border-strong)",
                background: i < selected.length ? "var(--purple-50)" : "transparent",
              }}
            >
              {i < selected.length && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--purple-500)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="text-xs font-medium" style={{ color: "var(--text-subtle)" }}>
              ใบที่ {i + 1}
            </span>
          </div>
        ))}
      </div>

      {/* ── CTA Button ── */}
      <div className="mt-6">
        <button
          type="button"
          disabled={selected.length !== count}
          onClick={submitReading}
          className="w-full rounded-full py-3.5 text-sm font-semibold transition-all disabled:opacity-40"
          style={{
            background: selected.length === count ? "var(--purple-500)" : "var(--border)",
            color: selected.length === count ? "#fff" : "var(--text-subtle)",
          }}
        >
          ดูผลคำทำนาย
        </button>
      </div>
    </main>
  );
}
