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
      <section className="rounded-3xl border border-border bg-gradient-to-br from-rose/15 to-teal/10 p-5 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent/90">Step 3 of 3</p>
            <h1 className="mt-2 text-3xl font-semibold text-fg md:text-4xl">ผลคำทำนาย</h1>
            <p className="mt-2 text-sm text-fg-muted">อ่านภาพรวมก่อน แล้วค่อยถามเจาะลึกในประเด็นที่คุณอยากรู้ต่อ</p>
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
              className="inline-flex"
            >
              <Button variant={savedId ? "secondary" : "primary"}>
                {savedId ? "บันทึกแล้ว" : "บันทึกผลนี้"}
              </Button>
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

      {question ? (
        <Card className="mt-4">
          <CardTitle>คำถาม</CardTitle>
          <CardDesc className="mt-1">{question}</CardDesc>
        </Card>
      ) : null}

      {drawnCards.length > 0 ? (
        <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
          <h2 className="mb-4 text-base font-semibold text-white">ไพ่ที่เปิดได้</h2>

          {count === 10 ? (
            <div className="space-y-3">
              {[drawnCards.slice(0, 5), drawnCards.slice(5, 10)].map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-2 md:gap-3">
                  {row.map((drawn, index) => (
                    <div key={`${rowIndex}-${drawn.card.id}-${index}`} className="rounded-xl border border-white/10 bg-black/20 p-1.5 text-center">
                      {drawn.card.image ? (
                        <Image
                          src={drawn.card.image}
                          alt={drawn.card.name}
                          width={160}
                          height={240}
                          className={`h-auto w-full rounded-lg object-cover ${drawn.orientation === "reversed" ? "rotate-180" : ""}`}
                        />
                      ) : null}
                      <p className="mt-1 truncate text-[10px] text-slate-300">{drawn.card.name}</p>
                      <p className="text-[10px] text-slate-400">{drawn.orientation === "upright" ? "ตั้งตรง" : "กลับหัว"}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-3 ${count === 1 ? "grid-cols-1 max-w-[210px]" : "grid-cols-3"}`}>
              {drawnCards.map((drawn, index) => (
                <div key={`${drawn.card.id}-${index}`} className="rounded-xl border border-white/10 bg-black/20 p-2 text-center">
                  {drawn.card.image ? (
                    <Image
                      src={drawn.card.image}
                      alt={drawn.card.name}
                      width={180}
                      height={270}
                      className={`h-auto w-full rounded-lg object-cover ${drawn.orientation === "reversed" ? "rotate-180" : ""}`}
                    />
                  ) : null}
                  <p className="mt-1 text-xs text-slate-200">{drawn.card.name}</p>
                  <p className="text-[11px] text-slate-400">{drawn.orientation === "upright" ? "ตั้งตรง" : "กลับหัว"}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      <section className="mt-4 rounded-2xl border border-fuchsia-300/30 bg-fuchsia-400/10 p-5">
        <h2 className="text-base font-semibold text-fuchsia-100">สรุปคำทำนาย</h2>
        {aiReading ? (
          <div className="mt-3 space-y-4 text-sm text-fuchsia-50">
            <div>
              <p className="font-semibold">สรุป</p>
              <p className="mt-1 whitespace-pre-line leading-relaxed">{aiReading.summary}</p>
            </div>
            <div>
              <p className="font-semibold">โครงไพ่</p>
              <p className="mt-1 whitespace-pre-line leading-relaxed">{aiReading.cardStructure}</p>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-fuchsia-100/80">กำลังสรุปคำทำนาย...</p>
        )}
      </section>

      <section className="mt-4 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-5">
        <h2 className="text-base font-semibold text-cyan-100">ถามเกี่ยวกับไพ่</h2>
        <p className="mt-1 text-xs text-cyan-50/90">ถามต่อได้ทันที เช่น “ไพ่ใบไหนเป็นจุดเสี่ยงสุด” หรือ “ควรโฟกัสใบไหนก่อน”</p>

        <div className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-xl border border-white/15 bg-black/20 p-3">
          {chatMessages.length === 0 ? (
            <p className="text-sm text-cyan-50/80">ยังไม่มีข้อความ ลองถามคำถามต่อได้เลย</p>
          ) : (
            chatMessages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}`}
                className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${m.role === "user" ? "ml-6 bg-white/20 text-white" : "mr-6 bg-cyan-100/20 text-cyan-50"}`}
              >
                {m.text}
              </div>
            ))
          )}
          {chatLoading ? <p className="text-sm text-cyan-50/80">กำลังพิมพ์คำตอบ...</p> : null}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendFollowUpQuestion();
            }}
            placeholder="พิมพ์คำถามเพิ่มเติม..."
            className="min-h-11 flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/60 outline-none"
          />
          <button
            type="button"
            onClick={sendFollowUpQuestion}
            disabled={chatLoading || !chatInput.trim()}
            className="min-h-11 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-50"
          >
            ส่ง
          </button>
        </div>
      </section>

      {paywall?.show ? (
        <section className="mt-6 rounded-2xl border border-amber-300/40 bg-amber-200/10 p-5">
          <h3 className="text-base font-semibold text-amber-100">ดูดวงออนไลน์กับเรฟ</h3>
          <p className="mt-2 text-sm text-amber-50/90">ติดต่อเพื่อรับคำทำนายส่วนตัวได้ที่ช่องทางนี้</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="https://line.me/R/ti/p/@reffortune" target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-900">LINE @reffortune</a>
            <a href="https://www.instagram.com/reffortune" target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100">IG reffortune</a>
            <a href="https://www.reffortune.com/package.html" target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100">ดูแพ็กเกจ</a>
          </div>
        </section>
      ) : null}
    </main>
  );
}
