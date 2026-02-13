import { NextResponse } from "next/server";
import { analyzeThaiPhone } from "@/lib/numerology/engine";

function toReadable(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((v) => toReadable(v)).join("\n");
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
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
    if (!apiKey) return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });

    const body = (await req.json()) as { phone?: string };
    const result = analyzeThaiPhone(body.phone ?? "");
    if (!result) return NextResponse.json({ error: "invalid_phone" }, { status: 400 });

    const fallbackStructure = `คะแนน ${result.score}/99 (${result.tier}) • เลขรวม ${result.total} • เลขราก ${result.root}`;

    const prompt = `ใช้แนวอ่านแบบ REFFORTUNE (ไทยธรรมชาติ กระชับ ใช้งานได้จริง)
ตอบเป็น JSON เท่านั้น โดยมีคีย์:
- summary
- cardStructure

กติกา: cardStructure ต้องเป็นข้อความล้วน และห้ามแสดง key-value/object ห้ามเป็น object

ข้อมูลที่วิเคราะห์ได้:
- เบอร์: ${result.normalizedPhone}
- คะแนน: ${result.score}/99 (${result.tier})
- เลขรวม: ${result.total}
- เลขราก: ${result.root}
- งาน: ${result.themes.work}
- เงิน: ${result.themes.money}
- ความสัมพันธ์: ${result.themes.relationship}
- คำเตือน: ${result.themes.caution}`;

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: { temperature: 0.7, responseMimeType: "application/json" },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      }),
    });

    if (!resp.ok) return NextResponse.json({ error: "gemini_request_failed" }, { status: 502 });
    const data = await resp.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let parsed;
    try {
      const obj = JSON.parse(raw) as Record<string, unknown>;
      parsed = {
        summary: toReadable(obj.summary) || "สรุปคำทำนายยังไม่สมบูรณ์",
        cardStructure: ensureFortuneStructure(toReadable(obj.cardStructure), toReadable(obj.summary)),
      };
    } catch {
      parsed = { summary: "สรุปคำทำนายยังไม่สมบูรณ์", cardStructure: ensureFortuneStructure(fallbackStructure, "สรุปคำทำนายยังไม่สมบูรณ์") };
    }
    return NextResponse.json({ ok: true, ai: parsed });
  } catch (e) {
    return NextResponse.json({ error: "unexpected_error", detail: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
