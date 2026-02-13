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

export default function NumerologyPage() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState<string | null>(null);
  const [aiReading, setAiReading] = useState<null | { summary: string; cardStructure: string }>(null);

  useEffect(() => {
    trackEvent("reading_start", { vertical: "numerology", step: "form_view" });
  }, []);

  const session = useMemo(
    () => (submittedPhone ? runReadingPipeline({ kind: "numerology", phone: submittedPhone }) : null),
    [submittedPhone],
  );
  const paywall = useMemo(
    () =>
      session
        ? evaluatePaywall({ vertical: "numerology", stage: "result", sessionId: session.sessionId, hasQuestion: true })
        : null,
    [session],
  );

  useEffect(() => {
    if (!session || !submittedPhone) return;
    recordFreeReading();
    trackEvent("reading_result_viewed", {
      vertical: "numerology",
      sessionId: session.sessionId,
      step: "result_view",
    });

    fetch("/api/ai/numerology", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: submittedPhone }),
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

    if (paywall?.show)
      trackEvent("paywall_shown", {
        vertical: "numerology",
        sessionId: session.sessionId,
        reason: paywall.reason,
        ctaVariant: paywall.variant,
      });
  }, [paywall?.reason, paywall?.show, paywall?.variant, session, submittedPhone]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = runReadingPipeline({ kind: "numerology", phone });
    if (!next) {
      setError("กรุณากรอกเบอร์ไทย 10 หลัก เช่น 0812345678 หรือ +66812345678");
      setSubmittedPhone(null);
      return;
    }
    trackEvent("reading_submitted", { vertical: "numerology", step: "form_submit" });
    setError("");
    setAiReading(null);
    setSubmittedPhone(phone);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-semibold text-white md:text-4xl">วิเคราะห์เบอร์มงคล</h1>
      <p className="mt-2 text-sm text-slate-300">อ่านผลแบบสำนวนเดียวกับ REFFORTUNE</p>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-3 md:flex-row md:items-end">
          <label className="flex flex-1 flex-col gap-2 text-sm text-slate-200">
            เบอร์โทรศัพท์
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              placeholder="08x-xxx-xxxx"
              className="rounded-xl border border-white/15 bg-slate-900/60 px-3 py-2 text-white outline-none ring-amber-200/60 focus:ring"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
          >
            วิเคราะห์เบอร์
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}

        {submittedPhone ? (
          <section className="mt-4 rounded-2xl border border-fuchsia-300/30 bg-fuchsia-400/10 p-5">
            <h2 className="text-base font-semibold text-fuchsia-100">สรุปคำทำนาย</h2>
            {aiReading ? (
              <div className="mt-3 space-y-3 text-sm text-fuchsia-50">
                <div>
                  <p className="font-semibold">สรุป</p>
                  <p className="mt-1 whitespace-pre-line">{aiReading.summary}</p>
                </div>
                <div>
                  <p className="font-semibold">โครงไพ่/โครงพลังตัวเลข</p>
                  <p className="mt-1 whitespace-pre-line">{aiReading.cardStructure}</p>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-fuchsia-100/80">กำลังสรุปคำทำนาย...</p>
            )}
          </section>
        ) : null}

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
      </section>
    </main>
  );
}
