import { analyzeThaiPhone } from "@/lib/numerology/engine";
import { cardMeaning, parseCardTokens, summarizeReading } from "@/lib/tarot/engine";
import { spiritCardFromDob } from "@/lib/tarot/spirit";
import { createBlock, pickTopKeywords } from "./interpretation";
import type { ReadingInput, ReadingSession } from "./types";

function makeSessionId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function runReadingPipeline(input: ReadingInput): ReadingSession | null {
  if (input.kind === "tarot") {
    const cards = parseCardTokens(input.cardsToken);
    if (cards.length === 0 || (input.count > 0 && cards.length !== input.count)) return null;
    const reading = summarizeReading({ cards, count: input.count, question: input.question });

    return {
      sessionId: makeSessionId("tarot"),
      vertical: "tarot",
      headline: "Tarot Reading Result",
      summary: reading.summary,
      tags: ["tarot", `spread-${input.count}`],
      blocks: [
        createBlock({ id: "tarot-summary", type: "summary", title: "ภาพรวมคำทำนาย", body: reading.summary, emphasis: "positive" }),
        ...reading.sections.map((section) =>
          createBlock({ id: `tarot-${section.position}`, type: "insight", title: section.title, body: `${section.description}\n${section.focus}` }),
        ),
        createBlock({ id: "tarot-action", type: "action", title: "Action ต่อจากนี้", body: "เขียน 1 การตัดสินใจภายใน 24 ชั่วโมง • กำหนดตัวชี้วัดที่วัดได้ • เช็กอินอีกครั้งใน 7 วัน" }),
      ],
    };
  }

  if (input.kind === "spirit-card") {
    const result = spiritCardFromDob(input.dob);
    if (!result) return null;
    const keywords = result.orientation === "upright" ? result.card.keywordsUpright : result.card.keywordsReversed;

    return {
      sessionId: makeSessionId("spirit"),
      vertical: "spirit-card",
      headline: "Spirit Card Insight",
      summary: `${result.card.nameTh ?? result.card.name} (${result.orientation === "upright" ? "ตั้งตรง" : "กลับหัว"})`,
      tags: ["spirit-card", `life-path-${result.lifePathNumber}`],
      blocks: [
        createBlock({ id: "spirit-summary", type: "summary", title: "การ์ดประจำจิตวิญญาณ", body: `${result.card.nameTh ?? result.card.name} • เลขเส้นทางชีวิต ${result.lifePathNumber}`, emphasis: "positive" }),
        createBlock({ id: "spirit-insight", type: "insight", title: "ความหมายหลัก", body: cardMeaning(result) }),
        createBlock({ id: "spirit-focus", type: "focus", title: "โฟกัสพลัง", body: pickTopKeywords(keywords) }),
      ],
    };
  }

  const result = analyzeThaiPhone(input.phone);
  if (!result) return null;

  return {
    sessionId: makeSessionId("numerology"),
    vertical: "numerology",
    headline: "Numerology Insight",
    summary: `คะแนน ${result.score}/99 (${result.tier}) จากเบอร์ ${result.normalizedPhone}`,
    tags: ["numerology", `tier-${result.tier}`],
    blocks: [
      createBlock({ id: "num-summary", type: "summary", title: "สรุปคะแนนพลังเบอร์", body: `คะแนน ${result.score}/99 (${result.tier}) • เลขรวม ${result.total} • เลขราก ${result.root}`, emphasis: result.score >= 80 ? "positive" : result.score >= 65 ? "neutral" : "caution" }),
      createBlock({ id: "num-work", type: "insight", title: "การงาน", body: result.themes.work }),
      createBlock({ id: "num-money", type: "insight", title: "การเงิน", body: result.themes.money }),
      createBlock({ id: "num-relationship", type: "insight", title: "ความสัมพันธ์", body: result.themes.relationship }),
      createBlock({ id: "num-warning", type: "warning", title: "คำแนะนำ", body: result.themes.caution, emphasis: "caution" }),
    ],
  };
}
