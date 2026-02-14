"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HeartSave } from "@/components/ui/HeartSave";
import { useLibrary } from "@/lib/library/useLibrary";
import { buildSavedDailyCardReading } from "@/lib/library/storage";
import { TAROT_DECK } from "@/lib/tarot/deck";
import { cardMeaning } from "@/lib/tarot/engine";
import { DrawnCard } from "@/lib/tarot/types";

const STORAGE_KEY = "reffortune_daily_card";
const BACK_IMAGE = "https://www.reffortune.com/icon/backcard.png";

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function drawOneCard(): DrawnCard {
  const card = TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)] ?? TAROT_DECK[0];
  return {
    card,
    orientation: Math.random() > 0.3 ? "upright" : "reversed",
  };
}

function loadTodayCard(): DrawnCard | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.date !== getTodayKey()) return null;
    const card = TAROT_DECK.find((c) => c.id === parsed.cardId);
    if (!card) return null;
    return { card, orientation: parsed.orientation };
  } catch {
    return null;
  }
}

function saveTodayCard(drawn: DrawnCard) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      date: getTodayKey(),
      cardId: drawn.card.id,
      orientation: drawn.orientation,
    }),
  );
}

export default function DailyCardPage() {
  const lib = useLibrary();
  const [savedId, setSavedId] = useState<string | null>(null);

  const [drawn, setDrawn] = useState<DrawnCard | null>(null);
  const [alreadyDrawn, setAlreadyDrawn] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = loadTodayCard();
    if (saved) {
      setDrawn(saved);
      setAlreadyDrawn(true);
      setFlipped(true);
      setShowDetails(true);
    } else {
      setDrawn(drawOneCard());
    }
  }, []);

  useEffect(() => {
    const dayKey = getTodayKey();
    const existing = lib.items.find(
      (item) =>
        "kind" in item &&
        item.kind === "daily_card" &&
        (item as any).dayKey === dayKey
    );
    setSavedId(existing?.id ?? null);
  }, [lib.items]);

  const handleFlip = useCallback(() => {
    if (flipped || !drawn) return;
    saveTodayCard(drawn);
    setAlreadyDrawn(true);
    setFlipped(true);
    setTimeout(() => setShowDetails(true), 600);
  }, [flipped, drawn]);

  const orientationLabel = drawn?.orientation === "upright" ? "ตั้งตรง" : "กลับหัว";

  const guidance = useMemo(() => {
    if (!drawn) return null;
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

  const shareText = drawn
    ? `ไพ่รายวัน: ${drawn.card.nameTh ?? drawn.card.name} (${orientationLabel}) — MysticFlow`
    : "";
  const shareUrl = "https://www.reffortune.com/daily-card";

  const handleShare = useCallback(
    async (platform: string) => {
      const text = encodeURIComponent(shareText);
      const url = encodeURIComponent(shareUrl);

      if (platform === "native" && typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({ title: "ไพ่รายวัน — MysticFlow", text: shareText, url: shareUrl });
        } catch {}
        return;
      }

      switch (platform) {
        case "line":
          window.open(`https://line.me/R/msg/text/?${text}%0A${url}`, "_blank");
          break;
        case "facebook":
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, "_blank");
          break;
        case "twitter":
          window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
          break;
        case "copy":
          try {
            await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {}
          break;
      }
    },
    [shareText, shareUrl],
  );

  const toggleSaved = useCallback(() => {
    if (!drawn) return;

    if (savedId) {
      lib.remove(savedId);
      setSavedId(null);
      return;
    }

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());

    const dayKey = getTodayKey();
    const title = `Daily Card — ${drawn.card.nameTh ?? drawn.card.name}`;

    lib.upsert(
      buildSavedDailyCardReading({
        id,
        dayKey,
        cardId: drawn.card.id,
        orientation: drawn.orientation,
        title,
        summary: guidance?.energy,
        tags: [drawn.card.name, ...(drawn.card.keywordsUpright ?? []), ...(drawn.card.keywordsReversed ?? [])],
        snapshot: guidance
          ? {
              dayKey,
              cardId: drawn.card.id,
              orientation: drawn.orientation,
              output: {
                message: guidance.energy,
                focus: guidance.focus,
                advice: { action: guidance.action, avoid: guidance.avoid },
              },
            }
          : undefined,
      })
    );

    setSavedId(id);
  }, [drawn, guidance?.energy, lib, savedId]);

  if (!drawn) {
    return (
      <main className="mx-auto w-full max-w-lg px-5 py-10">
        <p className="text-center text-sm" style={{ color: "var(--text-subtle)" }}>กำลังเตรียมไพ่...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-lg px-5 py-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            ไพ่รายวัน
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-subtle)" }}>
            {alreadyDrawn
              ? "คุณเปิดไพ่วันนี้แล้ว กลับมาเปิดใหม่ได้พรุ่งนี้"
              : "แตะที่ไพ่เพื่อเปิดพลังงานประจำวัน"}
          </p>
        </div>

        <div className="pt-1">
          <HeartSave saved={!!savedId} onToggle={toggleSaved} label="Save daily card" />
        </div>
      </div>

      {/* ── Card with flip animation ── */}
      <div className="mt-6 flex justify-center" style={{ perspective: "1000px" }}>
        <button
          type="button"
          onClick={handleFlip}
          disabled={flipped}
          className="relative cursor-pointer transition-transform duration-700"
          style={{
            width: "200px",
            height: "310px",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          aria-label="เปิดไพ่รายวัน"
        >
          {/* Back face */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl border-2"
            style={{
              backfaceVisibility: "hidden",
              borderColor: "var(--purple-200)",
              boxShadow: !flipped ? "0 4px 24px rgba(139,92,246,0.15)" : "none",
            }}
          >
            <Image src={BACK_IMAGE} alt="หลังไพ่" fill sizes="200px" className="object-cover" />
            {!flipped && (
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
                  animation: "daily-pulse 2s ease-in-out infinite",
                }}
              />
            )}
            {!flipped && (
              <div className="absolute inset-x-0 bottom-4 text-center">
                <span
                  className="rounded-xl px-3 py-1 text-[11px] font-bold text-white"
                  style={{ background: "var(--purple-500)" }}
                >
                  แตะเพื่อเปิด
                </span>
              </div>
            )}
          </div>

          {/* Front face */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl border-2"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderColor: "var(--purple-300)",
              boxShadow: "0 4px 24px rgba(139,92,246,0.15)",
            }}
          >
            {drawn.card.image ? (
              <Image src={drawn.card.image} alt={drawn.card.name} fill sizes="200px" className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center" style={{ background: "var(--purple-100)" }}>
                <span className="text-4xl">🔮</span>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* ── Card details (shown after flip) ── */}
      {showDetails && guidance && (
        <div className="mt-6 space-y-4" style={{ animation: "tarot-fade-up 0.5s ease-out both" }}>
          {/* Card name + orientation */}
          <div className="text-center">
            <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
              {drawn.card.nameTh ?? drawn.card.name}
            </h2>
            <p className="mt-0.5 text-sm" style={{ color: "var(--text-muted)" }}>
              {drawn.card.name} • {orientationLabel}
            </p>
            {/* Theme/Energy pills */}
            <div className="mt-2 flex flex-wrap justify-center gap-1.5">
              {guidance.focus.map((kw) => (
                <span
                  key={kw}
                  className="rounded-xl px-3 py-1 text-xs font-medium"
                  style={{ background: "var(--purple-100)", color: "var(--purple-600)" }}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Guidance card */}
          <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
            <h3 className="text-sm font-medium" style={{ color: "var(--purple-500)" }}>
              คำแนะนำ
            </h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {guidance.energy}
            </p>
          </div>

          {/* Affirmation / Action */}
          <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
            <h3 className="text-sm font-medium" style={{ color: "var(--success)" }}>
              สิ่งที่ควรทำ
            </h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {guidance.action}
            </p>
          </div>

          {/* Avoid */}
          <div className="rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
            <h3 className="text-sm font-medium" style={{ color: "var(--rose)" }}>
              สิ่งที่ควรเลี่ยง
            </h3>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {guidance.avoid}
            </p>
          </div>

          {/* Share buttons */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button type="button" onClick={() => handleShare("line")} className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:scale-110" style={{ background: "#06C755" }} aria-label="Share LINE">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 5.82 2 10.5c0 3.26 2.36 6.1 5.88 7.46-.08.72-.5 2.7-.57 3.12-.1.54.2.53.42.39.17-.11 2.4-1.63 3.38-2.3.28.03.58.05.89.05 5.52 0 10-3.82 10-8.5S17.52 2 12 2z" /></svg>
            </button>
            <button type="button" onClick={() => handleShare("facebook")} className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:scale-110" style={{ background: "#1877F2" }} aria-label="Share Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </button>
            <button type="button" onClick={() => handleShare("twitter")} className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:scale-110" style={{ background: "#000" }} aria-label="Share X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </button>
            <button type="button" onClick={() => handleShare("copy")} className="flex h-10 w-10 items-center justify-center rounded-xl border transition hover:scale-110" style={{ borderColor: "var(--border-strong)", background: "var(--bg-elevated)" }} aria-label="Copy link">
              {copied ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              )}
            </button>
          </div>

          {/* Bottom actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-2xl py-3 text-sm font-semibold text-accent-ink transition bg-accent hover:bg-accent-hover"
            >
              บันทึก
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY);
                setFlipped(false);
                setShowDetails(false);
                setAlreadyDrawn(false);
                setDrawn(drawOneCard());
              }}
              className="flex-1 rounded-2xl border border-border-strong py-3 text-sm font-semibold text-fg-muted transition hover:bg-surface"
            >
              เปิดใหม่
            </button>
          </div>
        </div>
      )}
    </main>
  );

  function handleSave() {
    if (drawn) saveTodayCard(drawn);
  }
}
