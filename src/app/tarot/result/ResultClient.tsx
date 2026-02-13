"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { parseCardTokens } from "@/lib/tarot/engine";
import { trackEvent } from "@/lib/analytics/tracking";
import { evaluatePaywall, recordFreeReading } from "@/lib/monetization/paywall";
import { runReadingPipeline } from "@/lib/reading/pipeline";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card, CardDesc, CardTitle } from "@/components/ui/Card";
import { buildSavedTarotReading, upsertReading } from "@/lib/library/storage";

function normalizeText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((v) => normalizeText(v)).join("\n");
  if (value && typeof value === "object") {
    try {
      const obj = value as Record<string, unknown>;
      const numericKeys = Object.keys(obj).every((k) => /^\d+$/.test(k));
      if (numericKeys) {
        return Object.keys(obj)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => normalizeText(obj[k]))
          .join("\n");
      }
      return JSON.stringify(obj, null, 2);
    } catch {
      return "";
    }
  }
  return "";
}

export default function ResultClient() {
  const searchParams = useSearchParams();
  const count = Number(searchParams.get("count") ?? "0");
  const cardsToken = searchParams.get("cards") ?? "";
  const question = searchParams.get("question") ?? "";

  const result = useMemo(
    () => runReadingPipeline({ kind: "tarot", count, cardsToken, question }),
    [cardsToken, count, question],
  );

  const drawnCards = useMemo(() => parseCardTokens(cardsToken), [cardsToken]);

  const [aiReading, setAiReading] = useState<null | {
    summary: string;
    cardStructure: string;
  }>(null);

  const [savedId, setSavedId] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);

  const paywall = useMemo(
    () =>
      result
        ? evaluatePaywall({
            vertical: "tarot",
            stage: "result",
            sessionId: result.sessionId,
            hasQuestion: question.trim().length > 0,
          })
        : null,
    [question, result],
  );

  useEffect(() => {
    if (!result) return;
    recordFreeReading();
    trackEvent("reading_result_viewed", {
      vertical: "tarot",
      sessionId: result.sessionId,
      count,
      hasQuestion: question.trim().length > 0,
    });

    if (paywall?.show) {
      trackEvent("paywall_shown", {
        vertical: "tarot",
        sessionId: result.sessionId,
        reason: paywall.reason,
        ctaVariant: paywall.variant,
      });
    }
  }, [count, paywall, question, result]);

  useEffect(() => {
    if (!result) return;

    const controller = new AbortController();

    fetch("/api/ai/tarot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardsToken, count, question }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return data?.ai ?? null;
      })
      .then((ai) => {
        if (!ai) return;
        const next = {
          summary: normalizeText(ai.summary),
          cardStructure: normalizeText(ai.cardStructure),
        };
        setAiReading(next);

        // If user already saved, upsert AI fields to the same saved item.
        if (savedId) {
          upsertReading(
            buildSavedTarotReading({
              id: savedId,
              count,
              cardsToken,
              question,
              aiSummary: next.summary,
              aiCardStructure: next.cardStructure,
            })
          );
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [cardsToken, count, question, result, savedId]);

  async function sendFollowUpQuestion() {
    const q = chatInput.trim();
    if (!q || chatLoading) return;

    const nextMessages = [...chatMessages, { role: "user" as const, text: q }];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/ai/tarot-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardsToken,
          count,
          baseQuestion: question,
          followUpQuestion: q,
          history: chatMessages,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.answer) {
        setChatMessages((prev) => [...prev, { role: "assistant", text: data.answer }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", text: "ขอโทษน้า ตอนนี้ตอบต่อไม่ได้ชั่วคราว ลองถามใหม่อีกครั้งได้เลย" },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: "มีปัญหาการเชื่อมต่อชั่วคราว ลองส่งคำถามอีกครั้งนะ" },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  if (!result) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-8 md:py-12">
        <Alert tone="danger" className="mt-6">
          ไม่พบข้อมูลไพ่ที่สมบูรณ์ กรุณากลับไปเปิดไพ่ใหม่อีกครั้ง
        </Alert>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:py-12">
      {/* ── Header ── */}
      <section
        className="relative overflow-hidden rounded-3xl border p-5 md:p-7"
        style={{
          borderColor: "var(--purple-700)",
          background: "linear-gradient(135deg, var(--purple-deep) 0%, var(--purple-900) 50%, var(--purple-800) 100%)",
          backgroundSize: "200% 200%",
          animation: "tarot-drift 14s ease-in-out infinite",
        }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--purple-600)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full opacity-15 blur-3xl"
          style={{ background: "var(--purple-500)" }}
        />

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--purple-400)" }}
            >
              Step 3 of 3
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">ผลคำทำนาย</h1>
            <p className="mt-2 text-sm" style={{ color: "var(--purple-200)" }}>
              อ่านภาพรวมก่อน แล้วค่อยถามเจาะลึกในประเด็นที่คุณอยากรู้ต่อ
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                const id = savedId ?? (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()));
                setSavedId(id);
                upsertReading(
                  buildSavedTarotReading({
                    id,
                    count,
                    cardsToken,
                    question,
                    aiSummary: aiReading?.summary,
                    aiCardStructure: aiReading?.cardStructure,
                  })
                );
                setSaveToast("บันทึกเรียบร้อย");
                setTimeout(() => setSaveToast(null), 1800);
              }}
              className="inline-flex min-h-10 items-center justify-center rounded-full px-5 py-2 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.03]"
              style={{
                background: savedId ? "var(--purple-800)" : "var(--purple-500)",
                boxShadow: savedId ? "none" : "0 0 16px var(--purple-glow)",
                borderWidth: savedId ? "1px" : "0",
                borderColor: "var(--purple-600)",
              }}
            >
              {savedId ? "บันทึกแล้ว ✓" : "บันทึกผลนี้"}
            </button>
            <Link href="/library/saved" className="inline-flex">
              <Button variant="ghost">ไปที่คลังของฉัน</Button>
            </Link>
            <Link href="/tarot" className="inline-flex">
              <Button variant="ghost">เปิดไพ่ใหม่</Button>
            </Link>
            <Link href="/" className="inline-flex">
              <Button variant="ghost">กลับหน้าแรก</Button>
            </Link>
          </div>
        </div>
      </section>

      {saveToast ? (
        <div className="mt-4">
          <Alert tone="success">{saveToast}</Alert>
        </div>
      ) : null}

      {/* ── Question ── */}
      {question ? (
        <div
          className="mt-4 rounded-2xl border p-4"
          style={{
            borderColor: "var(--purple-800)",
            background: "linear-gradient(160deg, rgba(139,92,246,0.06), rgba(13,10,26,0.9))",
            animation: "tarot-fade-up 0.5s ease-out both",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--purple-400)" }}>
            คำถาม
          </p>
          <p className="mt-1 text-sm text-white">{question}</p>
        </div>
      ) : null}

      {/* ── Drawn Cards ── */}
      {drawnCards.length > 0 ? (
        <section
          className="mt-4 rounded-2xl border p-4 md:p-5"
          style={{
            borderColor: "var(--purple-800)",
            background: "linear-gradient(160deg, rgba(139,92,246,0.05), rgba(13,10,26,0.95))",
          }}
        >
          <h2 className="mb-4 text-base font-semibold text-white">ไพ่ที่เปิดได้</h2>

          {count === 10 ? (
            <div className="space-y-3">
              {[drawnCards.slice(0, 5), drawnCards.slice(5, 10)].map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-2 md:gap-3">
                  {row.map((drawn, index) => {
                    const globalIdx = rowIndex * 5 + index;
                    return (
                      <div
                        key={`${rowIndex}-${drawn.card.id}-${index}`}
                        className="overflow-hidden rounded-xl border p-1.5 text-center"
                        style={{
                          borderColor: "var(--purple-700)",
                          background: "rgba(13,10,26,0.6)",
                          animation: `tarot-card-reveal 0.6s ease-out ${globalIdx * 0.08}s both`,
                        }}
                      >
                        {drawn.card.image ? (
                          <Image
                            src={drawn.card.image}
                            alt={drawn.card.name}
                            width={160}
                            height={240}
                            className={`h-auto w-full rounded-lg object-cover ${drawn.orientation === "reversed" ? "rotate-180" : ""}`}
                          />
                        ) : null}
                        <p className="mt-1 truncate text-[10px]" style={{ color: "var(--purple-200)" }}>{drawn.card.name}</p>
                        <p className="text-[10px]" style={{ color: "var(--purple-400)" }}>
                          {drawn.orientation === "upright" ? "ตั้งตรง" : "กลับหัว"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-3 ${count === 1 ? "grid-cols-1 max-w-[210px]" : count === 2 ? "grid-cols-2 max-w-[420px]" : count === 4 ? "grid-cols-4" : "grid-cols-3"}`}>
              {drawnCards.map((drawn, index) => (
                <div
                  key={`${drawn.card.id}-${index}`}
                  className="overflow-hidden rounded-xl border p-2 text-center"
                  style={{
                    borderColor: "var(--purple-700)",
                    background: "rgba(13,10,26,0.6)",
                    animation: `tarot-card-reveal 0.6s ease-out ${index * 0.12}s both`,
                  }}
                >
                  {drawn.card.image ? (
                    <Image
                      src={drawn.card.image}
                      alt={drawn.card.name}
                      width={180}
                      height={270}
                      className={`h-auto w-full rounded-lg object-cover ${drawn.orientation === "reversed" ? "rotate-180" : ""}`}
                    />
                  ) : null}
                  <p className="mt-1 text-xs" style={{ color: "var(--purple-200)" }}>{drawn.card.name}</p>
                  <p className="text-[11px]" style={{ color: "var(--purple-400)" }}>
                    {drawn.orientation === "upright" ? "ตั้งตรง" : "กลับหัว"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {/* ── AI Summary ── */}
      <section
        className="mt-4 rounded-2xl border p-5"
        style={{
          borderColor: "var(--purple-700)",
          background: "linear-gradient(160deg, rgba(139,92,246,0.1), rgba(13,10,26,0.92))",
          animation: "tarot-fade-up 0.6s ease-out 0.3s both",
        }}
      >
        <h2 className="text-base font-semibold" style={{ color: "var(--purple-300)" }}>
          สรุปคำทำนาย
        </h2>
        {aiReading ? (
          <div className="mt-3 space-y-4 text-sm">
            <div style={{ animation: "tarot-fade-up 0.5s ease-out 0.5s both" }}>
              <p className="font-semibold" style={{ color: "var(--purple-400)" }}>สรุป</p>
              <p className="mt-1 whitespace-pre-line leading-relaxed" style={{ color: "var(--purple-100)" }}>
                {aiReading.summary}
              </p>
            </div>
            <div style={{ animation: "tarot-fade-up 0.5s ease-out 0.7s both" }}>
              <p className="font-semibold" style={{ color: "var(--purple-400)" }}>โครงไพ่</p>
              <p className="mt-1 whitespace-pre-line leading-relaxed" style={{ color: "var(--purple-100)" }}>
                {aiReading.cardStructure}
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full"
              style={{
                background: "var(--purple-500)",
                animation: "tarot-glow-pulse 1.5s ease-in-out infinite",
              }}
            />
            <p className="text-sm" style={{ color: "var(--purple-300)" }}>กำลังสรุปคำทำนาย...</p>
          </div>
        )}
      </section>

      {/* ── Chat / Follow-up ── */}
      <section
        className="mt-4 rounded-2xl border p-5"
        style={{
          borderColor: "var(--purple-800)",
          background: "linear-gradient(160deg, rgba(139,92,246,0.06), rgba(13,10,26,0.95))",
          animation: "tarot-fade-up 0.6s ease-out 0.5s both",
        }}
      >
        <h2 className="text-base font-semibold" style={{ color: "var(--purple-300)" }}>
          ถามเกี่ยวกับไพ่
        </h2>
        <p className="mt-1 text-xs" style={{ color: "var(--purple-200)" }}>
          ถามต่อได้ทันที เช่น &quot;ไพ่ใบไหนเป็นจุดเสี่ยงสุด&quot; หรือ &quot;ควรโฟกัสใบไหนก่อน&quot;
        </p>

        <div
          className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-xl border p-3"
          style={{
            borderColor: "var(--purple-800)",
            background: "rgba(13,10,26,0.6)",
          }}
        >
          {chatMessages.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--purple-300)" }}>
              ยังไม่มีข้อความ ลองถามคำถามต่อได้เลย
            </p>
          ) : (
            chatMessages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}`}
                className="rounded-xl px-3 py-2 text-sm leading-relaxed"
                style={{
                  marginLeft: m.role === "user" ? "1.5rem" : "0",
                  marginRight: m.role === "assistant" ? "1.5rem" : "0",
                  background: m.role === "user" ? "rgba(139,92,246,0.2)" : "rgba(139,92,246,0.08)",
                  color: m.role === "user" ? "#fff" : "var(--purple-100)",
                  animation: `tarot-fade-up 0.3s ease-out both`,
                }}
              >
                {m.text}
              </div>
            ))
          )}
          {chatLoading ? (
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  background: "var(--purple-500)",
                  animation: "tarot-glow-pulse 1.2s ease-in-out infinite",
                }}
              />
              <p className="text-sm" style={{ color: "var(--purple-300)" }}>กำลังพิมพ์คำตอบ...</p>
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendFollowUpQuestion();
            }}
            placeholder="พิมพ์คำถามเพิ่มเติม..."
            className="min-h-11 flex-1 rounded-xl border px-3 py-2 text-sm text-white outline-none transition-all duration-200 focus:ring-2"
            style={{
              borderColor: "var(--purple-700)",
              background: "rgba(139,92,246,0.08)",
              "--tw-ring-color": "var(--purple-glow)",
            } as React.CSSProperties}
          />
          <button
            type="button"
            onClick={sendFollowUpQuestion}
            disabled={chatLoading || !chatInput.trim()}
            className="min-h-11 rounded-xl px-5 py-2 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.03] disabled:opacity-40"
            style={{
              background: "var(--purple-600)",
              boxShadow: "0 0 12px var(--purple-glow)",
            }}
          >
            ส่ง
          </button>
        </div>
      </section>

      {/* ── Paywall CTA ── */}
      {paywall?.show ? (
        <section
          className="mt-6 rounded-2xl border p-5"
          style={{
            borderColor: "var(--purple-600)",
            background: "linear-gradient(160deg, rgba(139,92,246,0.12), rgba(13,10,26,0.9))",
            animation: "tarot-fade-up 0.6s ease-out 0.7s both",
          }}
        >
          <h3 className="text-base font-semibold" style={{ color: "var(--purple-300)" }}>
            ดูดวงออนไลน์กับเรฟ
          </h3>
          <p className="mt-2 text-sm" style={{ color: "var(--purple-200)" }}>
            ติดต่อเพื่อรับคำทำนายส่วนตัวได้ที่ช่องทางนี้
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="https://line.me/R/ti/p/@reffortune"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center rounded-full px-5 py-2 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.03]"
              style={{ background: "var(--purple-500)", boxShadow: "0 0 16px var(--purple-glow)" }}
            >
              LINE @reffortune
            </a>
            <a
              href="https://www.instagram.com/reffortune"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center rounded-full border px-5 py-2 text-sm font-semibold transition hover:bg-white/5"
              style={{ borderColor: "var(--purple-600)", color: "var(--purple-200)" }}
            >
              IG reffortune
            </a>
            <a
              href="https://www.reffortune.com/package.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-10 items-center rounded-full border px-5 py-2 text-sm font-semibold transition hover:bg-white/5"
              style={{ borderColor: "var(--purple-600)", color: "var(--purple-200)" }}
            >
              ดูแพ็กเกจ
            </a>
          </div>
        </section>
      ) : null}
    </main>
  );
}
