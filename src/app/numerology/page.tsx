"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { ShareButton } from "@/components/ui/ShareButton";
import { Card, CardDesc, CardTitle } from "@/components/ui/Card";
// HeartSave removed temporarily (save builder not yet implemented for numerology)
import { analyzeThaiPhone } from "@/lib/numerology/engine";
import { runReadingPipeline } from "@/lib/reading/pipeline";
import { removeReading } from "@/lib/library/storage";

function normalizeText(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((v) => normalizeText(v)).join("\n");
  if (value && typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return "";
    }
  }
  return "";
}

export default function NumerologyPage() {
  const [phone, setPhone] = useState("");
  const [submittedPhone, setSubmittedPhone] = useState<string | null>(null);
  const [error, setError] = useState("");

  const baseline = useMemo(() => {
    if (!submittedPhone) return null;
    return analyzeThaiPhone(submittedPhone);
  }, [submittedPhone]);

  const session = useMemo(() => {
    if (!baseline) return null;
    return runReadingPipeline({ kind: "numerology", phone: baseline.normalizedPhone });
  }, [baseline]);

  const [aiReading, setAiReading] = useState<null | { summary: string; cardStructure: string }>(null);

  // Save
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    if (!submittedPhone) {
      setAiReading(null);
      setSavedId(null);
      return;
    }

    const controller = new AbortController();

    const fallback = session
      ? {
          summary: session.summary,
          cardStructure: session.blocks.map((b) => `${b.title}: ${b.body}`).join("\n\n"),
        }
      : null;

    const fallbackTimer = setTimeout(() => {
      if (fallback) setAiReading((prev) => prev ?? fallback);
    }, 7000);

    fetch("/api/ai/numerology", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: submittedPhone }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const data = await res.json();
        return data?.ai ?? null;
      })
      .then((ai) => {
        if (!ai) {
          if (fallback) setAiReading((prev) => prev ?? fallback);
          return;
        }
        setAiReading({
          summary: normalizeText(ai.summary) || (fallback?.summary ?? ""),
          cardStructure: normalizeText(ai.cardStructure) || (fallback?.cardStructure ?? ""),
        });
      })
      .catch(() => {
        if (fallback) setAiReading((prev) => prev ?? fallback);
      })
      .finally(() => {
        clearTimeout(fallbackTimer);
      });

    return () => {
      controller.abort();
    };
  }, [session, submittedPhone]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    const raw = phone.trim();
    if (!raw) return;

    const r = analyzeThaiPhone(raw);
    if (!r) {
      setError("กรุณาใส่เบอร์โทรศัพท์ให้ถูกต้อง");
      setSubmittedPhone(null);
      return;
    }

    setError("");
    setSubmittedPhone(raw);
  }

  function toggleSaved() {
    if (!baseline || !session) return;

    if (savedId) {
      removeReading(savedId);
      setSavedId(null);
      return;
    }

    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
    setSavedId(id);

    // TODO: add buildSavedNumerologyReading to storage; for now, disable saving to avoid broken build
    // upsertReading(...)
    
  }

  return (
    <main className="mx-auto w-full max-w-lg px-5 pb-10 pt-8">
      <header className="space-y-2">
        <AppBar title="เลขศาสตร์" className="px-0 pt-0 pb-0" />
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-fg">วิเคราะห์เบอร์โทรศัพท์</h1>
          {/* Save coming soon */}
        </div>
        <p className="text-sm text-fg-muted">กรอกเบอร์ แล้วดูคะแนน/แนวโน้มงาน-เงิน-ความสัมพันธ์</p>
      </header>

      <Card className="mt-6 p-5">
        <CardTitle>คำนวณ</CardTitle>
        <CardDesc className="mt-1">ใส่เบอร์โทรศัพท์ (ระบบจะจัดรูปแบบให้เอง)</CardDesc>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-fg-muted">เบอร์โทรศัพท์</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              placeholder="เช่น 0812345678"
              className="w-full rounded-xl border border-border bg-bg-elevated px-3 py-3 text-sm text-fg outline-none transition focus:ring-2 focus:ring-ring"
              required
            />
            {error ? <p className="text-sm text-danger">{error}</p> : null}
          </div>

          <Button type="submit" size="lg" className="w-full">
            วิเคราะห์
          </Button>
        </form>
      </Card>

      {baseline && session && (
        <section className="mt-6 space-y-3">
          <Card className="p-5">
            <CardTitle>สรุปคะแนน</CardTitle>
            <p className="mt-2 text-sm text-fg-muted">
              คะแนน {baseline.score}/99 ({baseline.tier}) • เลขรวม {baseline.total} • เลขราก {baseline.root}
            </p>
          </Card>

          <Card className="p-5">
            <CardTitle>คำทำนาย</CardTitle>
            {!aiReading ? (
              <p className="mt-2 text-sm text-fg-subtle">กำลังสรุปคำทำนาย...</p>
            ) : (
              <>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{aiReading.summary}</p>
                <div className="mt-4 rounded-2xl border border-border bg-bg-elevated p-4">
                  <p className="text-xs font-medium text-fg-muted">รายละเอียด</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-fg-muted">{aiReading.cardStructure}</p>
                </div>
                
                <div className="mt-6 flex flex-col gap-3">
                  <ShareButton 
                    variant="primary"
                    className="w-full"
                    size="lg"
                    shareData={{
                      title: "ผลวิเคราะห์เบอร์โทรศัพท์",
                      text: aiReading.summary,
                      url: typeof window !== "undefined" ? window.location.href : "",
                    }}
                  />
                  <Button variant="secondary" className="w-full" onClick={() => { setSubmittedPhone(null); setPhone(""); }}>
                    วิเคราะห์เบอร์อื่น
                  </Button>
                </div>
              </>
            )}
          </Card>
        </section>
      )}
    </main>
  );
}
