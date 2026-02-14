"use client";

import { FormEvent, useEffect, useMemo, useState, useCallback } from "react";
import { HeartSave } from "@/components/ui/HeartSave";
import { useLibrary } from "@/lib/library/useLibrary";
import { buildSavedSpiritCardReading } from "@/lib/library/storage";
import { trackEvent } from "@/lib/analytics/tracking";
import { evaluatePaywall, recordFreeReading } from "@/lib/monetization/paywall";
import { runReadingPipeline } from "@/lib/reading/pipeline";
import { spiritCardFromDob } from "@/lib/tarot/spirit";

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
  const lib = useLibrary();
  const [savedId, setSavedId] = useState<string | null>(null);

  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submittedDob, setSubmittedDob] = useState<string | null>(null);
  const [aiReading, setAiReading] = useState<null | { summary: string; cardStructure: string }>(null);

  useEffect(() => {
    trackEvent("reading_start", { vertical: "spirit-card", step: "form_view" });
  }, []);

  useEffect(() => {
    if (!submittedDob) {
      setSavedId(null);
      return;
    }

    const existing = lib.items.find(
      (item) => "kind" in item && item.kind === "spirit_card" && (item as any).dob === submittedDob
    );
    setSavedId(existing?.id ?? null);
  }, [lib.items, submittedDob]);

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

  const spirit = useMemo(() => {
    if (!submittedDob) return null;
    return spiritCardFromDob(submittedDob);
  }, [submittedDob]);

  const toggleSaved = useCallback(() => {
    if (!submittedDob || !spirit) return;

    if (savedId) {
      lib.remove(savedId);
      setSavedId(null);
      return;
    }

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());

    const title = `Spirit Card — ${spirit.card.nameTh ?? spirit.card.name}`;

    lib.upsert(
      buildSavedSpiritCardReading({
        id,
        dob: submittedDob,
        cardId: spirit.card.id,
        orientation: spirit.orientation,
        lifePathNumber: spirit.lifePathNumber,
        title,
        aiSummary: aiReading?.summary,
        aiCardStructure: aiReading?.cardStructure,
        tags: [spirit.card.name, ...(spirit.card.keywordsUpright ?? []), ...(spirit.card.keywordsReversed ?? [])],
        snapshot: session
          ? {
              input: { dob: submittedDob },
              card: {
                cardId: spirit.card.id,
                orientation: spirit.orientation,
                lifePathNumber: spirit.lifePathNumber,
              },
              session,
              output: aiReading ? { message: aiReading.summary, practice: aiReading.cardStructure } : undefined,
            }
          : undefined,
      })
    );

    setSavedId(id);
  }, [aiReading?.cardStructure, aiReading?.summary, lib, savedId, session, spirit, submittedDob]);

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
    const fallback = {
      summary: session.summary,
      cardStructure: session.blocks.map((b) => `${b.title}: ${b.body}`).join("\n\n"),
    };

    const fallbackTimer = setTimeout(() => {
      setAiReading((prev) => prev ?? fallback);
    }, 7000);

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
        if (!ai) {
          setAiReading((prev) => prev ?? fallback);
          return;
        }
        setAiReading({
          summary: normalizeText(ai.summary) || fallback.summary,
          cardStructure: normalizeText(ai.cardStructure) || fallback.cardStructure,
        });
      })
      .catch(() => {
        setAiReading((prev) => prev ?? fallback);
      })
      .finally(() => {
        clearTimeout(fallbackTimer);
      });

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
        <label className="text-sm font-medium" style={{ color: "var(--purple-500)" }}>วันเกิด</label>
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
          className="mt-4 w-full rounded-2xl py-3 text-sm font-semibold text-accent-ink transition disabled:opacity-50 bg-accent hover:bg-accent-hover"
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

          <div
            className="flex items-center justify-between rounded-2xl border p-4"
            style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                บันทึกไว้ในคลัง
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                แตะหัวใจเพื่อบันทึก/ยกเลิกบันทึก
              </p>
            </div>
            <HeartSave saved={!!savedId} onToggle={toggleSaved} label="Save spirit card" />
          </div>
        </section>
      )}
    </main>
  );
}
