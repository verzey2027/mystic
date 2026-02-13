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
    <main className="mx-auto w-full max-w-lg px-5 py-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>เลขศาสตร์</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>วิเคราะห์เบอร์มงคล</p>

      <form onSubmit={onSubmit} className="mt-5 rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
        <label className="text-sm font-medium" style={{ color: "var(--purple-500)" }}>
          เบอร์โทรศัพท์
        </label>
        <input
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
          placeholder="08x-xxx-xxxx"
          className="mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface-1)",
            color: "var(--text)",
            "--tw-ring-color": "var(--ring)",
          } as React.CSSProperties}
        />
        <button
          type="submit"
          className="mt-4 w-full rounded-2xl py-3 text-sm font-semibold text-accent-ink transition bg-accent hover:bg-accent-hover"
        >
          วิเคราะห์เบอร์
        </button>

        {error && (
          <p className="mt-3 text-sm" style={{ color: "var(--danger)" }}>{error}</p>
        )}
      </form>

      {submittedPhone && (
        <section className="mt-5 space-y-4">
          <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
            <h2 className="text-sm font-bold" style={{ color: "var(--purple-500)" }}>สรุปคำทำนาย</h2>
            {aiReading ? (
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{aiReading.summary}</p>
            ) : (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-3 w-3 animate-pulse rounded-full" style={{ background: "var(--purple-400)" }} />
                <p className="text-sm" style={{ color: "var(--text-subtle)" }}>กำลังวิเคราะห์...</p>
              </div>
            )}
          </div>

          {aiReading && (
            <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
              <h2 className="text-sm font-bold" style={{ color: "var(--purple-500)" }}>พลังตัวเลข</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{aiReading.cardStructure}</p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
