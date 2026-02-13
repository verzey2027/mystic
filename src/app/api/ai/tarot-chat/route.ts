import { NextResponse } from "next/server";
import { cardMeaning, parseCardTokens } from "@/lib/tarot/engine";

type ChatTurn = { role: "user" | "assistant"; text: string };

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });
    }

    const body = (await req.json()) as {
      cardsToken?: string;
      count?: number;
      baseQuestion?: string;
      followUpQuestion?: string;
      history?: ChatTurn[];
    };

    const followUp = body.followUpQuestion?.trim();
    if (!followUp) {
      return NextResponse.json({ error: "missing_followup_question" }, { status: 400 });
    }

    const cards = parseCardTokens(body.cardsToken ?? "");
    if (!cards.length) {
      return NextResponse.json({ error: "invalid_cards" }, { status: 400 });
    }

    const cardContext = cards
      .map((drawn, i) => {
        const orient = drawn.orientation === "upright" ? "ตั้งตรง" : "กลับหัว";
        return `${i + 1}. ${drawn.card.name} (${orient}) => ${cardMeaning(drawn)}`;
      })
      .join("\n");

    const prior = (body.history ?? [])
      .slice(-6)
      .map((t) => `${t.role === "user" ? "ผู้ใช้" : "ผู้ช่วย"}: ${t.text}`)
      .join("\n");

    const prompt = `บทบาทของคุณ:
คุณคือที่ปรึกษาเชิงจิตใจและหมอดูไพ่ทาโรต์ น้ำเสียงมนุษย์ อบอุ่น ตรงไปตรงมาแบบไม่ทำร้ายใจ

กติกา:
- ตอบภาษาไทยเท่านั้น
- ตอบจากข้อมูลไพ่ที่ให้มาเท่านั้น
- ตอบแบบถาม-ตอบสั้นกระชับ 1-3 ย่อหน้า
- โฟกัสปัญหาที่เป็นไปได้ + แนวทางแก้ที่ทำได้จริง + ให้กำลังใจท้ายข้อความ
- ไม่ฟันธงอนาคต 100%

ข้อมูลอ่านไพ่:
คำถามตั้งต้น: ${body.baseQuestion?.trim() || "(ไม่ได้ระบุ)"}
จำนวนไพ่: ${body.count ?? cards.length}
ไพ่ที่เปิดได้:
${cardContext}

บริบทบทสนทนาก่อนหน้า:
${prior || "(ยังไม่มี)"}

คำถามล่าสุดจากผู้ใช้:
${followUp}

โปรดตอบเป็นข้อความล้วน ไม่ต้องเป็น JSON`;

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generationConfig: {
            temperature: 0.75,
          },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      },
    );

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: "gemini_request_failed", detail: text }, { status: 502 });
    }

    const data = await resp.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!answer) {
      return NextResponse.json({ error: "empty_answer" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, answer });
  } catch (error) {
    return NextResponse.json(
      { error: "unexpected_error", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
