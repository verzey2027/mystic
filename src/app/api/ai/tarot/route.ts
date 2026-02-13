import { NextResponse } from "next/server";
import { cardMeaning, parseCardTokens } from "@/lib/tarot/engine";
import { buildTarotPrompt } from "@/lib/ai/prompts";

type GeminiTarotResponse = {
  summary: string;
  cardStructure: string;
};

function toReadable(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((v) => toReadable(v)).join("\n");
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (obj.card || obj.direction || obj.mainMeaning || obj.position) {
      return [
        obj.position ? `ตำแหน่ง: ${toReadable(obj.position)}` : "",
        obj.card ? `ไพ่: ${toReadable(obj.card)}` : "",
        obj.direction ? `ทิศทาง: ${toReadable(obj.direction)}` : "",
        obj.mainMeaning ? `ใจความ: ${toReadable(obj.mainMeaning)}` : "",
      ]
        .filter(Boolean)
        .join(" • ");
    }
    return Object.entries(obj)
      .map(([k, v]) => `${k}: ${toReadable(v)}`)
      .join("\n");
  }
  return "";
}


function ensureFortuneStructure(input: string, summary: string): string {
  const text = input.replace(/\s+/g, " ").trim();
  if (!text) {
    return [
      `ภาพรวมสถานการณ์: ${summary}`,
      "จุดที่ควรระวัง: อย่ารีบตัดสินใจจากอารมณ์หรือข้อมูลที่ยังไม่ครบ",
      "แนวทางที่ควรทำ: โฟกัส 1 ประเด็นหลัก วางขั้นตอน แล้วลงมือทีละส่วน",
    ].join("\n");
  }

  const hasLabels = text.includes("ภาพรวมสถานการณ์") || text.includes("จุดที่ควรระวัง") || text.includes("แนวทางที่ควรทำ");
  if (hasLabels) return text;

  return [
    `ภาพรวมสถานการณ์: ${summary || text}`,
    `จุดที่ควรระวัง: ${text}`,
    "แนวทางที่ควรทำ: ตั้งกรอบเวลาให้ชัด เช็กความเสี่ยง และตัดสินใจจากข้อเท็จจริง",
  ].join("\n");
}
export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });
    }

    const body = (await req.json()) as {
      cardsToken?: string;
      count?: number;
      question?: string;
    };

    const cards = parseCardTokens(body.cardsToken ?? "");
    if (!cards.length) {
      return NextResponse.json({ error: "invalid_cards" }, { status: 400 });
    }

    // Determine spread type based on card count
    const countMap: Record<number, 1 | 2 | 3 | 4 | 10> = { 1: 1, 2: 2, 3: 3, 4: 4, 10: 10 };
    const spreadType = countMap[body.count ?? cards.length] ?? 3;

    // Build prompt using new prompt builder
    const prompt = buildTarotPrompt({
      cards,
      count: body.count ?? cards.length,
      question: body.question,
      spreadType,
    });

    const fallbackStructure = cards
      .map((drawn, i) => {
        const orient = drawn.orientation === "upright" ? "ตั้งตรง" : "กลับหัว";
        return `${i + 1}) ${drawn.card.name} (${orient}) — ${cardMeaning(drawn)}`;
      })
      .join("\n");

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      },
    );

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({
        ok: true,
        fallback: true,
        reason: "gemini_unavailable",
        detail: text,
        ai: {
          summary: "ช่วงนี้ระบบอ่านเชิงลึกหนาแน่น จึงสรุปจากโครงไพ่พื้นฐานให้ก่อน",
          cardStructure: ensureFortuneStructure(fallbackStructure, "ช่วงนี้ระบบอ่านเชิงลึกหนาแน่น จึงสรุปจากโครงไพ่พื้นฐานให้ก่อน"),
        },
      });
    }

    const data = await resp.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let parsed: GeminiTarotResponse;
    try {
      const obj = JSON.parse(raw) as Record<string, unknown>;
      parsed = {
        summary: toReadable(obj.summary) || "สรุปคำทำนายยังไม่สมบูรณ์ในรอบนี้",
        cardStructure: ensureFortuneStructure(toReadable(obj.cardStructure), toReadable(obj.summary)),
      };
    } catch {
      parsed = {
        summary: "สรุปคำทำนายยังไม่สมบูรณ์ในรอบนี้",
        cardStructure: ensureFortuneStructure(fallbackStructure, "สรุปคำทำนายยังไม่สมบูรณ์"),
      };
    }

    return NextResponse.json({ ok: true, ai: parsed });
  } catch (error) {
    return NextResponse.json(
      { error: "unexpected_error", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
