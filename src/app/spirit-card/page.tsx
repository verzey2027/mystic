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
  const [loading, setLoading] = useState(false);
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
    });

    if (paywall?.show) {
      trackEvent("paywall_shown", {
        vertical: "spirit-card",
        reason: paywall.reason,
        ctaVariant: paywall.variant,
      });
    }

    const controller = new AbortController();
    fetch("/api/ai/spirit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dob: submittedDob }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return data?.ai ?? null;
      })
      .then((ai) => {
        if (!ai) return;
        setAiReading({
          summary: normalizeText(ai.summary),
          cardStructure: normalizeText(ai.cardStructure),
        });
      })
      .catch(() => {});

    return () => controller.abort();
  }, [session, submittedDob, paywall]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!dob.trim()) return;

    const next = runReadingPipeline({ kind: "spirit-card", dob });
    if (!next) {
      setError("กรุณาใส่วันเกิดในรูปแบบที่ถูกต้อง");
      return;
    }

    trackEvent("reading_submitted", { vertical: "spirit-card", step: "form_submit" });
    setError("");
    setAiReading(null);
    setLoading(true);
    setSubmittedDob(dob);
    setLoading(false);
  }

  return (
    <main className="mx-auto w-full max-w-lg px-5 py-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>ไพ่จิตวิญญาณ</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>รับข้อความจากจักรวาล ผ่านวันเกิดของคุณ</p>

      <form onSubmit={handleSubmit} className="mt-5 rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
        <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--purple-500)" }}>วันเกิด</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
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
          disabled={loading}
          className="mt-4 w-full rounded-full py-3 text-sm font-semibold text-white transition disabled:opacity-50"
          style={{ background: "var(--purple-500)" }}
        >
          {loading ? "กำลังอ่าน..." : "เปิดไพ่จิตวิญญาณ"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-xl border p-4 text-sm" style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {aiReading && (
        <section className="mt-5 space-y-4">
          <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
            <h2 className="text-sm font-bold" style={{ color: "var(--purple-500)" }}>สารจากจักรวาล</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{aiReading.summary}</p>
          </div>
          <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
            <h2 className="text-sm font-bold" style={{ color: "var(--purple-500)" }}>แนวทางปฏิบัติ</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{aiReading.cardStructure}</p>
          </div>

          <button
            type="button"
            className="w-full rounded-full py-3 text-sm font-semibold text-white transition"
            style={{ background: "var(--purple-500)" }}
          >
            บันทึกผล
          </button>
        </section>
      )}
    </main>
  );
}
