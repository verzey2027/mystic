"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { parseCardTokens } from "@/lib/tarot/engine";
import { trackEvent } from "@/lib/analytics/tracking";
import { evaluatePaywall, recordFreeReading } from "@/lib/monetization/paywall";
import { runReadingPipeline } from "@/lib/reading/pipeline";
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

  function handleSave() {
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
  }

  if (!result) {
    return (
      <main className="mx-auto w-full max-w-lg px-5 py-8">
        <div className="rounded-2xl border p-4" style={{ borderColor: "var(--danger)", background: "rgba(239,68,68,0.06)" }}>
          <p className="text-sm" style={{ color: "var(--danger)" }}>
            ไม่พบข้อมูลไพ่ที่สมบูรณ์ กรุณากลับไปเปิดไพ่ใหม่อีกครั้ง
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-lg px-5 py-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
          ผลไพ่ {count} ใบ
        </h1>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full px-4 py-1.5 text-xs font-semibold transition"
          style={{
            background: savedId ? "var(--purple-100)" : "var(--purple-500)",
            color: savedId ? "var(--purple-600)" : "#fff",
          }}
        >
          {savedId ? "บันทึกแล้ว ✓" : "บันทึก"}
        </button>
      </div>

      {saveToast && (
        <div className="mt-3 rounded-xl border p-3 text-sm" style={{ borderColor: "rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.06)", color: "var(--success)" }}>
          {saveToast}
        </div>
      )}

      {/* ── Drawn Cards Row ── */}
      {drawnCards.length > 0 && (
        <div className="mt-5 flex justify-center gap-3 overflow-x-auto pb-2">
          {drawnCards.map((drawn, index) => (
            <div
              key={`${drawn.card.id}-${index}`}
              className="flex-shrink-0 overflow-hidden rounded-xl border text-center"
              style={{
                width: count <= 3 ? "100px" : count <= 5 ? "80px" : "64px",
                borderColor: "var(--purple-200)",
                background: "var(--bg-elevated)",
              }}
            >
              {drawn.card.image ? (
                <Image
                  src={drawn.card.image}
                  alt={drawn.card.name}
                  width={180}
                  height={270}
                  className={`h-auto w-full object-cover ${drawn.orientation === "reversed" ? "rotate-180" : ""}`}
                />
              ) : (
                <div className="flex h-24 items-center justify-center" style={{ background: "var(--surface-1)" }}>
                  <span className="text-2xl">🔮</span>
                </div>
              )}
              <p className="truncate px-1 py-1 text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
                {drawn.card.nameTh ?? drawn.card.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Question ── */}
      {question && (
        <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--purple-500)" }}>
            คำถาม
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text)" }}>{question}</p>
        </div>
      )}

      {/* ── Overall Summary ── */}
      <section className="mt-4 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
        <h2 className="text-sm font-bold" style={{ color: "var(--text)" }}>ภาพรวม</h2>
        {aiReading ? (
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-muted)" }}>
            {aiReading.summary}
          </p>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-3 w-3 animate-pulse rounded-full" style={{ background: "var(--purple-400)" }} />
            <p className="text-sm" style={{ color: "var(--text-subtle)" }}>กำลังสรุปคำทำนาย...</p>
          </div>
        )}
      </section>

      {/* ── Per-card interpretations ── */}
      {aiReading && drawnCards.map((drawn, index) => (
        <section
          key={`${drawn.card.id}-interp-${index}`}
          className="mt-3 rounded-2xl border-l-4 border p-4"
          style={{
            borderColor: "var(--border)",
            borderLeftColor: "var(--purple-400)",
            background: "var(--bg-elevated)",
          }}
        >
          <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>
            {drawn.card.nameTh ?? drawn.card.name} — {drawn.orientation === "upright" ? "สถานการณ์" : "สิ่งท้าทาย"}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {drawn.orientation === "upright" ? drawn.card.meaningUpright : drawn.card.meaningReversed}
          </p>
        </section>
      ))}

      {/* ── Card structure (if available) ── */}
      {aiReading?.cardStructure && (
        <section className="mt-3 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
          <h2 className="text-sm font-bold" style={{ color: "var(--text)" }}>รายละเอียด</h2>
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-muted)" }}>
            {aiReading.cardStructure}
          </p>
        </section>
      )}

      {/* ── Chat / Follow-up ── */}
      <section className="mt-4 rounded-2xl border p-4" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
        <h2 className="text-sm font-bold" style={{ color: "var(--text)" }}>ถามเกี่ยวกับไพ่</h2>
        <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
          ถามคำถามเพิ่มเติมเกี่ยวกับผลที่เปิดได้
        </p>

        <div className="mt-3 max-h-60 space-y-2 overflow-y-auto rounded-xl border p-3" style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}>
          {chatMessages.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-subtle)" }}>
              ยังไม่มีข้อความ ลองถามคำถามดูสิ
            </p>
          ) : (
            chatMessages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}`}
                className="rounded-xl px-3 py-2 text-sm leading-relaxed"
                style={{
                  marginLeft: m.role === "user" ? "1.5rem" : "0",
                  marginRight: m.role === "assistant" ? "1.5rem" : "0",
                  background: m.role === "user" ? "var(--purple-100)" : "var(--surface-1)",
                  color: "var(--text)",
                }}
              >
                {m.text}
              </div>
            ))
          )}
          {chatLoading && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full" style={{ background: "var(--purple-400)" }} />
              <p className="text-sm" style={{ color: "var(--text-subtle)" }}>กำลังพิมพ์...</p>
            </div>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendFollowUpQuestion(); }}
            placeholder="พิมพ์คำถามเพิ่มเติม..."
            className="min-h-10 flex-1 rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--text)",
              "--tw-ring-color": "var(--ring)",
            } as React.CSSProperties}
          />
          <button
            type="button"
            onClick={sendFollowUpQuestion}
            disabled={chatLoading || !chatInput.trim()}
            className="min-h-10 rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-40"
            style={{ background: "var(--purple-500)" }}
          >
            ส่ง
          </button>
        </div>
      </section>

      {/* ── Bottom actions ── */}
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 rounded-full py-3 text-sm font-semibold text-white transition"
          style={{ background: "var(--purple-500)" }}
        >
          บันทึกผล
        </button>
        <Link
          href="/tarot"
          className="flex flex-1 items-center justify-center rounded-full border py-3 text-sm font-semibold transition"
          style={{ borderColor: "var(--border-strong)", color: "var(--text-muted)" }}
        >
          เปิดไพ่ใหม่
        </Link>
      </div>
    </main>
  );
}
