"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [drawn, setDrawn] = useState<DrawnCard | null>(null);
  const [alreadyDrawn, setAlreadyDrawn] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = loadTodayCard();
    if (saved) {
      setDrawn(saved);
      setAlreadyDrawn(true);
      setFlipped(true);
      setShowPopup(true);
    } else {
      setDrawn(drawOneCard());
    }
  }, []);

  const handleFlip = useCallback(() => {
    if (flipped || !drawn) return;
    saveTodayCard(drawn);
    setAlreadyDrawn(true);
    setFlipped(true);
    setTimeout(() => setShowPopup(true), 600);
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
    ? `ไพ่รายวันของฉัน: ${drawn.card.nameTh ?? drawn.card.name} (${orientationLabel}) — REFFORTUNE`
    : "";
  const shareUrl = "https://www.reffortune.com/daily-card";

  const handleShare = useCallback(
    (platform: string) => {
      const text = encodeURIComponent(shareText);
      const url = encodeURIComponent(shareUrl);
      switch (platform) {
        case "line":
          window.open(`https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`, "_blank");
          break;
        case "facebook":
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, "_blank");
          break;
        case "twitter":
          window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
          break;
        case "copy":
          navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
          break;
      }
    },
    [shareText, shareUrl],
  );

  if (!drawn) {
    return (
      <main className="mx-auto w-full max-w-lg px-4 py-10">
        <p className="text-center text-sm text-slate-400">กำลังเตรียมไพ่...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10 md:py-14">
      <div className="text-center">
        <p
          className="text-sm font-semibold tracking-[0.15em]"
          style={{ color: "#d4af37", fontStyle: "italic" }}
        >
          REFFORTUNE
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">ไพ่รายวัน</h1>
        <p className="mt-1 text-sm text-slate-400">
          {alreadyDrawn
            ? "คุณเปิดไพ่วันนี้แล้ว กลับมาเปิดใหม่ได้พรุ่งนี้"
            : "แตะที่ไพ่เพื่อเปิดพลังงานประจำวัน"}
        </p>
      </div>

      {/* ── Card with flip animation ── */}
      <div className="mt-8 flex justify-center" style={{ perspective: "1000px" }}>
        <button
          type="button"
          onClick={handleFlip}
          disabled={flipped}
          className="relative cursor-pointer transition-transform duration-700"
          style={{
            width: "220px",
            height: "340px",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          aria-label="เปิดไพ่รายวัน"
        >
          {/* Back face (หลังไพ่) */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl border-2"
            style={{
              backfaceVisibility: "hidden",
              borderColor: "rgba(212,175,55,0.4)",
              boxShadow: !flipped
                ? "0 0 30px rgba(212,175,55,0.3), 0 8px 32px rgba(0,0,0,0.4)"
                : "none",
            }}
          >
            <Image
              src={BACK_IMAGE}
              alt="หลังไพ่"
              fill
              sizes="220px"
              className="object-cover"
            />
            {/* Pulsing glow hint */}
            {!flipped && (
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
                  animation: "daily-pulse 2s ease-in-out infinite",
                }}
              />
            )}
            {!flipped && (
              <div className="absolute inset-x-0 bottom-4 text-center">
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-bold"
                  style={{ background: "rgba(0,0,0,0.6)", color: "#d4af37" }}
                >
                  แตะเพื่อเปิด
                </span>
              </div>
            )}
          </div>

          {/* Front face (หน้าไพ่) */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl border-2"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderColor: "rgba(139,92,246,0.4)",
              boxShadow: "0 0 30px rgba(139,92,246,0.2), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {drawn.card.image ? (
              <Image
                src={drawn.card.image}
                alt={drawn.card.name}
                fill
                sizes="220px"
                className="object-cover"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ background: "linear-gradient(135deg, #1a0e3e, #4c2889)" }}
              >
                <span className="text-4xl">🔮</span>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* ── Popup overlay ── */}
      {showPopup && guidance && (
        <div
          className="fixed inset-0 z-[9998] flex items-end justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowPopup(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-t-3xl"
            style={{
              background: "linear-gradient(180deg, #1a0e3e 0%, #0f0a1e 100%)",
              maxHeight: "85vh",
              animation: "slide-up 0.4s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>

            <div className="overflow-y-auto px-5 pb-8 pt-2" style={{ maxHeight: "calc(85vh - 20px)" }}>
              {/* Card name */}
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "#d4af37" }}>
                  Your card today
                </p>
                <h2 className="mt-2 text-xl font-bold text-white">
                  {drawn.card.nameTh ?? drawn.card.name}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {drawn.card.name} • {orientationLabel}
                </p>
              </div>

              {/* Guidance cards */}
              <div className="mt-5 grid gap-3">
                <article
                  className="rounded-xl p-4"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <h3 className="text-xs font-semibold" style={{ color: "#d4af37" }}>
                    พลังวันนี้
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{guidance.energy}</p>
                </article>
                <article
                  className="rounded-xl p-4"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <h3 className="text-xs font-semibold" style={{ color: "#a78bfa" }}>
                    โฟกัสหลัก
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                    {guidance.focus.join(" • ")}
                  </p>
                </article>
                <div className="grid grid-cols-2 gap-3">
                  <article
                    className="rounded-xl p-4"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <h3 className="text-xs font-semibold text-emerald-400">Action</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{guidance.action}</p>
                  </article>
                  <article
                    className="rounded-xl p-4"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <h3 className="text-xs font-semibold text-rose-400">ควรเลี่ยง</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{guidance.avoid}</p>
                  </article>
                </div>
              </div>

              {/* Share buttons */}
              <div className="mt-6">
                <p className="text-center text-xs font-semibold text-slate-500">แชร์ผลไพ่ของคุณ</p>
                <div className="mt-3 flex items-center justify-center gap-3">
                  {/* LINE */}
                  <button
                    type="button"
                    onClick={() => handleShare("line")}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110"
                    style={{ background: "#06C755" }}
                    aria-label="แชร์ไปยัง LINE"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2C6.48 2 2 5.82 2 10.5c0 3.26 2.36 6.1 5.88 7.46-.08.72-.5 2.7-.57 3.12-.1.54.2.53.42.39.17-.11 2.4-1.63 3.38-2.3.28.03.58.05.89.05 5.52 0 10-3.82 10-8.5S17.52 2 12 2z" />
                    </svg>
                  </button>
                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => handleShare("facebook")}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110"
                    style={{ background: "#1877F2" }}
                    aria-label="แชร์ไปยัง Facebook"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  {/* Twitter/X */}
                  <button
                    type="button"
                    onClick={() => handleShare("twitter")}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110"
                    style={{ background: "#000" }}
                    aria-label="แชร์ไปยัง X"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>
                  {/* Copy */}
                  <button
                    type="button"
                    onClick={() => handleShare("copy")}
                    className="flex h-11 w-11 items-center justify-center rounded-full transition-transform hover:scale-110"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
                    aria-label="คัดลอกลิงก์"
                  >
                    {copied ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Close button */}
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="mt-5 w-full rounded-full py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
