import type { ReadingVertical } from "@/lib/reading/types";

export interface PaywallContext {
  vertical: ReadingVertical;
  stage: "pre-result" | "result";
  sessionId?: string;
  hasQuestion?: boolean;
}

export interface PaywallDecision {
  show: boolean;
  reason: string;
  ctaLabel: string;
  ctaHref: string;
  variant: "soft" | "hard";
}

const STORAGE_KEY = "mf.reading.freeCount";

function getFreeCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const parsed = Number(raw ?? "0");
  return Number.isFinite(parsed) ? parsed : 0;
}

export function recordFreeReading(): number {
  if (typeof window === "undefined") return 0;
  const next = getFreeCount() + 1;
  window.localStorage.setItem(STORAGE_KEY, String(next));
  return next;
}

export function evaluatePaywall(context: PaywallContext): PaywallDecision {
  const freeCount = getFreeCount();
  const highIntent = context.hasQuestion === true || context.vertical === "numerology";

  if (freeCount >= 3 && context.stage === "result") {
    return { show: true, reason: "free_limit_reached", ctaLabel: "ปลดล็อก Premium Reading", ctaHref: `/pricing?source=${context.vertical}&reason=limit`, variant: "hard" };
  }

  if (highIntent && context.stage === "result") {
    return { show: true, reason: "high_intent_offer", ctaLabel: "ดูแผนรายเดือนเพื่อผลลัพธ์ละเอียดขึ้น", ctaHref: `/pricing?source=${context.vertical}&reason=intent`, variant: "soft" };
  }

  return { show: false, reason: "eligible_free", ctaLabel: "", ctaHref: "/pricing", variant: "soft" };
}
