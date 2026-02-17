"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { parseCardTokens } from "@/lib/tarot/engine";
import { trackEvent } from "@/lib/analytics/tracking";
import { evaluatePaywall, recordFreeReading } from "@/lib/monetization/paywall";
import { runReadingPipeline } from "@/lib/reading/pipeline";
import { buildSavedTarotReading, removeReading, upsertReading } from "@/lib/library/storage";
import { HeartSave } from "@/components/ui/HeartSave";
import { Button } from "@/components/ui/Button";
import { ShareButton } from "@/components/ui/ShareButton";
import { TarotShareableCard } from "@/components/share/tarot/TarotShareableCard";
import { cn } from "@/lib/cn";

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
    [cardsToken, count, question]
  );

  const drawnCards = useMemo(() => parseCardTokens(cardsToken), [cardsToken]);

  const [aiReading, setAiReading] = useState<null | {
    summary: string;
    cardStructure: string;
  }>(null);

  const [savedId, setSavedId] = useState<string | null>(null);
  const [savedCreatedAt, setSavedCreatedAt] = useState<string | null>(null);
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
    [question, result]
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

    const fallback = {
      summary: result.summary,
      cardStructure: drawnCards
        .map((drawn, i) => {
          const orient = drawn.orientation === "upright" ? "ตั้งตรง" : "กลับหัว";
          return `${i + 1}) ${drawn.card.nameTh ?? drawn.card.name} (${orient}) — ${
            drawn.orientation === "upright" ? drawn.card.meaningUpright : drawn.card.meaningReversed
          }`;
        })
        .join("\n"),
    };

    // If API is unavailable (e.g. missing key on deploy), don't keep users stuck on loading.
    const fallbackTimer = setTimeout(() => {
      setAiReading((prev) => prev ?? fallback);
    }, 7000);

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
        if (!ai) {
          setAiReading((prev) => prev ?? fallback);
          return;
        }
        const next = {
          summary: normalizeText(ai.summary) || fallback.summary,
          cardStructure: normalizeText(ai.cardStructure) || fallback.cardStructure,
        };
        setAiReading(next);

        if (savedId && result) {
          upsertReading(
            buildSavedTarotReading({
              id: savedId,
              createdAt: savedCreatedAt ?? undefined,
              count,
              cardsToken,
              question,
              aiSummary: next.summary,
              aiCardStructure: next.cardStructure,
              snapshot: {
                input: { count, cardsToken, question },
                session: result,
                ai: { summary: next.summary, cardStructure: next.cardStructure },
              },
            })
          );
        }
      })
      .catch(() => {
        setAiReading((prev) => prev ?? fallback);
      })
      .finally(() => {
        clearTimeout(fallbackTimer);
      });

    return () => {
      controller.abort();
    };
  }, [cardsToken, count, question, result, savedCreatedAt, savedId]);

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
    if (!result) return;

    const id =
      savedId ??
      (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()));

    const createdAt = savedCreatedAt ?? new Date().toISOString();

    setSavedId(id);
    setSavedCreatedAt(createdAt);

    upsertReading(
      buildSavedTarotReading({
        id,
        createdAt,
        count,
        cardsToken,
        question,
        aiSummary: aiReading?.summary,
        aiCardStructure: aiReading?.cardStructure,
        snapshot: {
          input: { count, cardsToken, question },
          session: result,
          ai: aiReading ? { summary: aiReading.summary, cardStructure: aiReading.cardStructure } : undefined,
        },
      })
    );
    setSaveToast("Saved to library");
    setTimeout(() => setSaveToast(null), 1600);
  }

  function toggleSaved() {
    if (savedId) {
      removeReading(savedId);
      setSavedId(null);
      setSavedCreatedAt(null);
      setSaveToast("Removed");
      setTimeout(() => setSaveToast(null), 1200);
      return;
    }
    handleSave();
  }

  if (!result) {
    return (
      <main className="mx-auto w-full max-w-lg px-5 py-8">
        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4">
          <p className="text-sm text-danger">ไม่พบข้อมูลไพ่ที่สมบูรณ์ กรุณากลับไปเปิดไพ่ใหม่อีกครั้ง</p>
        </div>
      </main>
    );
  }

  const cardWidth = count <= 3 ? "w-[100px]" : count <= 5 ? "w-[80px]" : "w-16";

  return (
    <main className="mx-auto w-full max-w-lg px-5 py-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-fg">Tarot result • {count} cards</h1>
        <HeartSave saved={!!savedId} onToggle={toggleSaved} label="Save reading" />
      </div>

      {saveToast && (
        <div className="mt-3 rounded-xl border border-success/25 bg-success/10 p-3 text-sm text-success">
          {saveToast}
        </div>
      )}

      {/* ── Drawn Cards Row ── */}
      {drawnCards.length > 0 && (
        <div className="mt-5 flex justify-center gap-3 overflow-x-auto pb-2">
          {drawnCards.map((drawn, index) => (
            <div
              key={`${drawn.card.id}-${index}`}
              className={cn(
                "flex-shrink-0 overflow-hidden rounded-xl border border-border bg-bg-elevated text-center",
                cardWidth
              )}
            >
              {drawn.card.image ? (
                <Image
                  src={drawn.card.image}
                  alt={drawn.card.name}
                  width={180}
                  height={270}
                  className={cn(
                    "h-auto w-full object-cover",
                    drawn.orientation === "reversed" && "rotate-180"
                  )}
                />
              ) : (
                <div className="flex h-24 items-center justify-center bg-surface">
                  <span className="text-2xl">🔮</span>
                </div>
              )}
              <p className="truncate px-1 py-1 text-[10px] font-medium text-fg-muted">
                {drawn.card.nameTh ?? drawn.card.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Question ── */}
      {question && (
        <div className="mt-4 rounded-2xl border border-border bg-bg-elevated p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">คำถาม</p>
          <p className="mt-1 text-sm text-fg">{question}</p>
        </div>
      )}

      {/* ── Overall Summary ── */}
      <section className="mt-4 rounded-2xl border border-border bg-bg-elevated p-4">
        <h2 className="text-sm font-bold text-fg">ภาพรวม</h2>
        {aiReading ? (
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{aiReading.summary}</p>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-3 w-3 animate-pulse rounded-full bg-accent" />
            <p className="text-sm text-fg-subtle">กำลังสรุปคำทำนาย...</p>
          </div>
        )}
      </section>

      {/* ── Per-card interpretations ── */}
      {aiReading &&
        drawnCards.map((drawn, index) => (
          <section
            key={`${drawn.card.id}-interp-${index}`}
            className="mt-3 rounded-2xl border border-border border-l-4 border-l-accent bg-bg-elevated p-4"
          >
            <h3 className="text-sm font-bold text-fg">
              {drawn.card.nameTh ?? drawn.card.name} — {drawn.orientation === "upright" ? "สถานการณ์" : "สิ่งท้าทาย"}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">
              {drawn.orientation === "upright" ? drawn.card.meaningUpright : drawn.card.meaningReversed}
            </p>
          </section>
        ))}

      {/* ── Card structure (if available) ── */}
      {aiReading?.cardStructure && (
        <section className="mt-3 rounded-2xl border border-border bg-bg-elevated p-4">
          <h2 className="text-sm font-bold text-fg">รายละเอียด</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg-muted">
            {aiReading.cardStructure}
          </p>
        </section>
      )}

      {/* ── Shareable Result Card ── */}
      {drawnCards.length > 0 && aiReading && (
        <section className="mt-6 rounded-2xl border border-accent/30 bg-gradient-to-br from-accent-soft to-purple-50 p-4">
          <h2 className="text-sm font-bold text-fg flex items-center gap-2">
            <span>✨</span> แชร์ผลคำทำนาย
          </h2>
          <p className="mt-1 text-xs text-fg-subtle">บันทึกหรือแชร์ผลไพ่เป็นรูปภาพสวยงาม</p>
          
          <div className="mt-4 flex justify-center">
            <TarotShareableCard
              data={{
                vertical: "tarot",
                cards: drawnCards.map(d => ({
                  name: d.card.name,
                  nameTh: d.card.nameTh,
                  image: d.card.image,
                  orientation: d.orientation,
                  meaning: d.orientation === "upright" 
                    ? d.card.meaningUpright 
                    : d.card.meaningReversed,
                  position: count === 3 
                    ? ["อดีต", "ปัจจุบัน", "อนาคต"][drawnCards.indexOf(d)]
                    : count === 10
                    ? ["สถานการณ์", "อุปสรรค", "รากฐาน", "อดีต", "เป้าหมาย", "อนาคต", "ตัวคุณ", "สิ่งแวดล้อม", "ความหวัง", "ผลลัพธ์"][drawnCards.indexOf(d)]
                    : undefined,
                })),
                reading: aiReading.summary,
                question: question || undefined,
                date: new Date().toLocaleDateString("th-TH", { 
                  day: "numeric", 
                  month: "short", 
                  year: "numeric" 
                }),
                brand: "REFFORTUNE",
                spreadType: count === 1 ? "ไพ่รายวัน" : count === 3 ? "ไพ่ 3 ใบ" : count === 10 ? "Celtic Cross" : `${count} ใบ`,
              }}
              onShare={() => trackEvent("share_card_generated", { 
                vertical: "tarot", 
                card: drawnCards[0]?.card.name,
                count,
              })}
            />
          </div>
        </section>
      )}

      {/* ── Chat / Follow-up ── */}
      <section className="mt-4 rounded-2xl border border-border bg-bg-elevated p-4">
        <h2 className="text-sm font-bold text-fg">ถามเกี่ยวกับไพ่</h2>
        <p className="mt-1 text-xs text-fg-subtle">ถามคำถามเพิ่มเติมเกี่ยวกับผลที่เปิดได้</p>

        <div className="mt-3 max-h-60 space-y-2 overflow-y-auto rounded-xl border border-border bg-surface p-3">
          {chatMessages.length === 0 ? (
            <p className="text-sm text-fg-subtle">ยังไม่มีข้อความ ลองถามคำถามดูสิ</p>
          ) : (
            chatMessages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}`}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm leading-relaxed text-fg",
                  m.role === "user" ? "ml-6 bg-accent-soft" : "mr-6 bg-surface"
                )}
              >
                {m.text}
              </div>
            ))
          )}
          {chatLoading && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-accent" />
              <p className="text-sm text-fg-subtle">กำลังพิมพ์...</p>
            </div>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendFollowUpQuestion();
            }}
            placeholder="พิมพ์คำถามเพิ่มเติม..."
            className="min-h-10 flex-1 rounded-xl border border-border bg-bg-elevated px-3 py-2 text-sm text-fg outline-none transition focus:ring-2 focus:ring-ring"
          />
          <Button
            type="button"
            onClick={sendFollowUpQuestion}
            disabled={chatLoading || !chatInput.trim()}
            size="sm"
            className="h-10 rounded-xl px-4"
          >
            ส่ง
          </Button>
        </div>
      </section>

      {/* ── Bottom actions ── */}
      <div className="mt-6 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <Button className="w-full" size="lg" onClick={toggleSaved}>
            {savedId ? "Saved" : "Save to Library"}
          </Button>
          <ShareButton
            variant="secondary"
            size="lg"
            className="w-full"
            shareData={{
              title: "ผลคำทำนายไพ่ทาโรต์",
              text: aiReading?.summary || "ดูดวงกับ MysticFlow",
              url: typeof window !== "undefined" ? window.location.href : "",
            }}
          />
        </div>
        <Link href="/tarot" className="block">
          <Button className="w-full" size="lg" variant="ghost">
            New Reading
          </Button>
        </Link>
      </div>
    </main>
  );
}
