import { NextResponse } from "next/server";
import type { ChineseZodiacAnimal, ChineseElement } from "@/lib/chinese-zodiac/types";
import type { TimePeriod } from "@/lib/horoscope/types";

interface ChineseZodiacAIRequest {
  animal: ChineseZodiacAnimal;
  element: ChineseElement;
  period: TimePeriod;
  baseline: {
    fortune: {
      overall: string;
      career: string;
      wealth: string;
      health: string;
      relationships: string;
    };
    luckyColors: string[];
    luckyNumbers: number[];
    luckyDirections: string[];
    advice: string;
  };
}

interface ChineseZodiacAIResponse {
  summary: string;
  enhancedFortune: {
    overall: string;
    career: string;
    wealth: string;
    health: string;
    relationships: string;
  };
  advice: string;
  culturalInsight: string;
}

function buildChineseZodiacPrompt(request: ChineseZodiacAIRequest): string {
  const periodThai = {
    daily: "รายวัน",
    weekly: "รายสัปดาห์",
    monthly: "รายเดือน",
  }[request.period];

  const animalThai: Record<ChineseZodiacAnimal, string> = {
    rat: "ปีชวด (หนู)",
    ox: "ปีฉลู (วัว)",
    tiger: "ปีขาล (เสือ)",
    rabbit: "ปีเถาะ (กระต่าย)",
    dragon: "ปีมะโรง (มังกร)",
    snake: "ปีมะเส็ง (งู)",
    horse: "ปีมะเมีย (ม้า)",
    goat: "ปีมะแม (แพะ)",
    monkey: "ปีวอก (ลิง)",
    rooster: "ปีระกา (ไก่)",
    dog: "ปีจอ (สุนัข)",
    pig: "ปีกุน (หมู)",
  };

  const elementThai: Record<ChineseElement, string> = {
    wood: "ไม้",
    fire: "ไฟ",
    earth: "ดิน",
    metal: "เหล็ก",
    water: "น้ำ",
  };

  return `คุณเป็นนักโหราศาสตร์จีนที่เชี่ยวชาญในการทำนายดวงชะตาตามปีนักษัตรจีน และสามารถถ่ายทอดความรู้เป็นภาษาไทยได้อย่างเข้าใจง่าย

## บริบททางวัฒนธรรมไทย-จีน

ในการทำนายดวงชะตาตามปีนักษัตรจีนแบบไทย เราผสมผสานความเชื่อทางพุทธศาสนาเรื่องกรรม บุญ และหลักโหราศาสตร์จีนโบราณ การทำนายควรให้คำแนะนำที่เป็นประโยชน์และสร้างสรรค์ โดยเคารพในภูมิปัญญาจีนและวัฒนธรรมไทย

## คำแนะนำ

สร้างคำทำนายดวงชะตาสำหรับ${animalThai[request.animal]} ธาตุ${elementThai[request.element]} ช่วง${periodThai} โดย:

1. ใช้ข้อมูลพื้นฐานที่ให้มาเป็นแนวทาง
2. เพิ่มรายละเอียดที่เป็นส่วนตัวและเฉพาะเจาะจงตามหลักโหราศาสตร์จีน
3. ใช้ภาษาไทยที่เป็นกันเองและเข้าใจง่าย แต่รักษาคำศัพท์จีนที่สำคัญ
4. ให้คำแนะนำที่ปฏิบัติได้จริงตามหลักฮวงจุ้ยและโหราศาสตร์จีน
5. เน้นแง่บวกและโอกาสในการพัฒนา พร้อมคำเตือนที่สร้างสรรค์

## ข้อมูลพื้นฐาน

ปีนักษัตร: ${animalThai[request.animal]}
ธาตุ: ${elementThai[request.element]}
ช่วงเวลา: ${periodThai}

ดวงโดยรวม: ${request.baseline.fortune.overall}
ด้านการงาน: ${request.baseline.fortune.career}
ด้านการเงิน: ${request.baseline.fortune.wealth}
ด้านสุขภาพ: ${request.baseline.fortune.health}
ด้านความสัมพันธ์: ${request.baseline.fortune.relationships}

สีมงคล: ${request.baseline.luckyColors.join(", ")}
เลขมงคล: ${request.baseline.luckyNumbers.join(", ")}
ทิศมงคล: ${request.baseline.luckyDirections.join(", ")}

คำแนะนำพื้นฐาน: ${request.baseline.advice}

## รูปแบบผลลัพธ์ (JSON)

ตอบกลับในรูปแบบ JSON ที่มีโครงสร้างดังนี้:
{
  "summary": "สรุปภาพรวมดวงชะตาในช่วงนี้ตามหลักโหราศาสตร์จีน (120-150 คำ)",
  "enhancedFortune": {
    "overall": "คำทำนายดวงโดยรวมที่เพิ่มรายละเอียด (80-100 คำ)",
    "career": "คำทำนายด้านการงานที่เพิ่มรายละเอียด (80-100 คำ)",
    "wealth": "คำทำนายด้านการเงินที่เพิ่มรายละเอียด (80-100 คำ)",
    "health": "คำทำนายด้านสุขภาพที่เพิ่มรายละเอียด (80-100 คำ)",
    "relationships": "คำทำนายด้านความสัมพันธ์ที่เพิ่มรายละเอียด (80-100 คำ)"
  },
  "advice": "คำแนะนำที่ปฏิบัติได้จริงสำหรับช่วงนี้ตามหลักฮวงจุ้ยและโหราศาสตร์จีน (120-150 คำ)",
  "culturalInsight": "ข้อมูลเชิงลึกทางวัฒนธรรมจีนที่เกี่ยวข้องกับปีนักษัตรและธาตุนี้ (80-100 คำ)"
}`;
}

function validateResponse(parsed: unknown): parsed is ChineseZodiacAIResponse {
  if (!parsed || typeof parsed !== "object") return false;
  
  const obj = parsed as Record<string, unknown>;
  
  // Check summary
  if (typeof obj.summary !== "string" || obj.summary.length < 100) return false;
  
  // Check enhancedFortune
  if (!obj.enhancedFortune || typeof obj.enhancedFortune !== "object") return false;
  const fortune = obj.enhancedFortune as Record<string, unknown>;
  if (
    typeof fortune.overall !== "string" || fortune.overall.length < 50 ||
    typeof fortune.career !== "string" || fortune.career.length < 50 ||
    typeof fortune.wealth !== "string" || fortune.wealth.length < 50 ||
    typeof fortune.health !== "string" || fortune.health.length < 50 ||
    typeof fortune.relationships !== "string" || fortune.relationships.length < 50
  ) return false;
  
  // Check advice
  if (typeof obj.advice !== "string" || obj.advice.length < 100) return false;
  
  // Check culturalInsight
  if (typeof obj.culturalInsight !== "string" || obj.culturalInsight.length < 50) return false;
  
  return true;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });
    }

    const body = (await req.json()) as ChineseZodiacAIRequest;

    // Validate input
    if (!body.animal || !body.element || !body.period || !body.baseline) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const prompt = buildChineseZodiacPrompt(body);

    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    
    // First attempt
    let resp = await fetch(
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
      // API unavailable - return baseline
      return NextResponse.json({
        ok: true,
        fallback: true,
        reason: "gemini_unavailable",
        ai: {
          summary: body.baseline.advice,
          enhancedFortune: body.baseline.fortune,
          advice: body.baseline.advice,
          culturalInsight: "ข้อมูลเชิงลึกทางวัฒนธรรมไม่สามารถโหลดได้ในขณะนี้",
        },
      });
    }

    let data = await resp.json();
    let raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }

    // Validate response
    if (!validateResponse(parsed)) {
      // Retry once
      resp = await fetch(
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
        // Return baseline on retry failure
        return NextResponse.json({
          ok: true,
          fallback: true,
          reason: "retry_failed",
          ai: {
            summary: body.baseline.advice,
            enhancedFortune: body.baseline.fortune,
            advice: body.baseline.advice,
            culturalInsight: "ข้อมูลเชิงลึกทางวัฒนธรรมไม่สามารถโหลดได้ในขณะนี้",
          },
        });
      }

      data = await resp.json();
      raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }

      if (!validateResponse(parsed)) {
        // Return baseline after retry
        return NextResponse.json({
          ok: true,
          fallback: true,
          reason: "validation_failed",
          ai: {
            summary: body.baseline.advice,
            enhancedFortune: body.baseline.fortune,
            advice: body.baseline.advice,
            culturalInsight: "ข้อมูลเชิงลึกทางวัฒนธรรมไม่สามารถโหลดได้ในขณะนี้",
          },
        });
      }
    }

    // Success - return AI-enhanced interpretation
    return NextResponse.json({
      ok: true,
      ai: parsed as ChineseZodiacAIResponse,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "unexpected_error",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
