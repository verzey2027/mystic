"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics/tracking";
import { evaluatePaywall, recordFreeReading } from "@/lib/monetization/paywall";
import { runReadingPipeline } from "@/lib/reading/pipeline";

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

export default function SpiritCardPage() {
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [submittedDob, setSubmittedDob] = useState<string | null>(null);
  const [aiReading, setAiReading] = useState<null | { summary: string; cardStructure: string }>(null);

  useEffect(() => {
    trackEvent("reading_start", { vertical: "spirit-card", step: "form_view" });
  }, []);

  const session = useMemo(() => {
    if (!submittedDob) return null;
    return runReadingPipeline({ kind: "spirit-card", dob: submittedDob });
  }, [submittedDob]);

  const paywall = useMemo(() => {
    if (!session) return null;
    return evaluatePaywall({
      vertical: "spirit-card",
      stage: "result",
      sessionId: session.sessionId,
    });
  }, [session]);

  useEffect(() => {
    if (!session || !submittedDob) return;

    recordFreeReading();
    trackEvent("reading_result_viewed", {
      vertical: "spirit-card",
      sessionId: session.sessionId,
      step: "result_view",
    });

    fetch("/api/ai/spirit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dob: submittedDob }),
    })
      .then(async (res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.ai) return;
        setAiReading({
          summary: normalizeText(data.ai.summary),
          cardStructure: normalizeText(data.ai.cardStructure),
        });
      })
      .catch(() => {});

    if (paywall?.show) {
      trackEvent("paywall_shown", {
        vertical: "spirit-card",
        sessionId: session.sessionId,
        reason: paywall.reason,
        ctaVariant: paywall.variant,
      });
    }
  }, [paywall?.reason, paywall?.show, paywall?.variant, session, submittedDob]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next = runReadingPipeline({ kind: "spirit-card", dob });
    if (!next) {
      setError("กรุณาใส่วันเกิดในรูปแบบที่ถูกต้อง");
      setSubmittedDob(null);
      return;
    }

    trackEvent("reading_submitted", { vertical: "spirit-card", step: "form_submit" });
    setError("");
    setAiReading(null);
    setSubmittedDob(dob);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold text-white md:text-4xl">ไพ่จิตวิญญาณ</h1>
      <p className="mt-3 text-slate-300">อ่านผลแบบสำนวนเดียวกับ REFFORTUNE</p>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-3 md:flex-row md:items-end">
          <label className="flex flex-1 flex-col gap-2 text-sm text-slate-200">
            วันเกิด
            <input
              type="date"
              value={dob}
              onChange={(event) => setDob(event.target.value)}
              required
              className="rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-white outline-none ring-amber-200/60 focus:ring"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
          >
            คำนวณไพ่จิตวิญญาณ
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}

        {submittedDob && (
          <article className="mt-6 rounded-2xl border border-fuchsia-300/30 bg-fuchsia-400/10 p-5">
            <h2 className="text-base font-semibold text-fuchsia-100">สรุปคำทำนาย</h2>
            {aiReading ? (
              <div className="mt-3 space-y-3 text-sm text-fuchsia-50">
                <div>
                  <p className="font-semibold">สรุป</p>
                  <p className="mt-1 whitespace-pre-line">{aiReading.summary}</p>
                </div>
                <div>
                  <p className="font-semibold">โครงไพ่</p>
                  <p className="mt-1 whitespace-pre-line">{aiReading.cardStructure}</p>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-fuchsia-100/80">กำลังสรุปคำทำนาย...</p>
            )}
          </article>
        )}

        {session && paywall?.show && (
          <section className="mt-6 rounded-2xl border border-amber-300/40 bg-amber-200/10 p-5">
            <h3 className="text-base font-semibold text-amber-100">ดูดวงออนไลน์กับเรฟ</h3>
            <p className="mt-2 text-sm text-amber-50/90">ติดต่อเพื่อรับคำทำนายส่วนตัวได้ที่ช่องทางนี้</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="https://line.me/R/ti/p/@reffortune" target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-900">LINE @reffortune</a>
              <a href="https://www.instagram.com/reffortune" target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100">IG reffortune</a>
              <a href="https://www.reffortune.com/package.html" target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100">ดูแพ็กเกจ</a>
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
