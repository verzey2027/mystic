import { NextResponse } from "next/server";
import type { ZodiacSign, TimePeriod } from "@/lib/horoscope/types";

interface HoroscopeAIRequest {
  zodiacSign: ZodiacSign;
  period: TimePeriod;
  baseline: {
    aspects: {
      love: string;
      career: string;
      finance: string;
      health: string;
    };
    luckyNumbers: number[];
    luckyColors: string[];
    advice: string;
  };
}

interface HoroscopeAIResponse {
  summary: string;
  enhancedAspects: {
    love: string;
    career: string;
    finance: string;
    health: string;
  };
  advice: string;
}

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

function buildHoroscopePrompt(request: HoroscopeAIRequest): string {
  const periodThai = {
    daily: "รายวัน",
    weekly: "รายสัปดาห์",
    monthly: "รายเดือน",
  }[request.period];

  const zodiacThai = {
    aries: "เมษ",
    taurus: "พฤษภ",
    gemini: "เมถุน",
    cancer: "กรกฎ",
    leo: "สิงห์",
    virgo: "กันย์",
    libra: "ตุลย์",
    scorpio: "พิจิก",
    sagittarius: "ธนู",
    capricorn: "มกร",
    aquarius: "กุมภ์",
    pisces: "มีน",
  }[request.zodiacSign];

  return `คุณเป็นนักโหราศาสตร์ไทยที่มีความเชี่ยวชาญในการทำนายดวงชะตา

## บริบททางวัฒนธรรมไทย

ในการทำนายดวงชะตาแบบไทย เราเชื่อในหลักพุทธศาสนาเรื่องกรรม บุญ และการใช้ชีวิตแบบทางสายกลาง การทำนายควรให้คำแนะนำที่เป็นประโยชน์และสร้างสรรค์ ไม่ใช่การทำนายที่คลุมเครือหรือน่ากลัว

## คำแนะนำ

สร้างคำทำนายดวงชะตาสำหรับราศี${zodiacThai} ช่วง${periodThai} โดย:

1. ใช้ข้อมูลพื้นฐานที่ให้มาเป็นแนวทาง
2. เพิ่มรายละเอียดที่เป็นส่วนตัวและเฉพาะเจาะจง
3. ใช้ภาษาไทยที่เป็นกันเองและเข้าใจง่าย
4. ให้คำแนะนำที่ปฏิบัติได้จริง
5. เน้นแง่บวกและโอกาสในการพัฒนา

## ข้อมูลพื้นฐาน

ราศี: ${zodiacThai}
ช่วงเวลา: ${periodThai}

ด้านความรัก: ${request.baseline.aspects.love}
ด้านการงาน: ${request.baseline.aspects.career}
ด้านการเงิน: ${request.baseline.aspects.finance}
ด้านสุขภาพ: ${request.baseline.aspects.health}

เลขนำโชค: ${request.baseline.luckyNumbers.join(", ")}
สีนำโชค: ${request.baseline.luckyColors.join(", ")}

คำแนะนำพื้นฐาน: ${request.baseline.advice}

## รูปแบบผลลัพธ์ (JSON)

ตอบกลับในรูปแบบ JSON ที่มีโครงสร้างดังนี้:
{
  "summary": "สรุปภาพรวมดวงชะตาในช่วงนี้ (100-150 คำ)",
  "enhancedAspects": {
    "love": "คำทำนายด้านความรักที่เพิ่มรายละเอียด (80-100 คำ)",
    "career": "คำทำนายด้านการงานที่เพิ่มรายละเอียด (80-100 คำ)",
    "finance": "คำทำนายด้านการเงินที่เพิ่มรายละเอียด (80-100 คำ)",
    "health": "คำทำนายด้านสุขภาพที่เพิ่มรายละเอียด (80-100 คำ)"
  },
  "advice": "คำแนะนำที่ปฏิบัติได้จริงสำหรับช่วงนี้ (100-120 คำ)"
}`;
}

function validateResponse(parsed: unknown): parsed is HoroscopeAIResponse {
  if (!parsed || typeof parsed !== "object") return false;
  
  const obj = parsed as Record<string, unknown>;
  
  // Check summary
  if (typeof obj.summary !== "string" || obj.summary.length < 100) return false;
  
  // Check enhancedAspects
  if (!obj.enhancedAspects || typeof obj.enhancedAspects !== "object") return false;
  const aspects = obj.enhancedAspects as Record<string, unknown>;
  if (
    typeof aspects.love !== "string" || aspects.love.length < 50 ||
    typeof aspects.career !== "string" || aspects.career.length < 50 ||
    typeof aspects.finance !== "string" || aspects.finance.length < 50 ||
    typeof aspects.health !== "string" || aspects.health.length < 50
  ) return false;
  
  // Check advice
  if (typeof obj.advice !== "string" || obj.advice.length < 100) return false;
  
  return true;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });
    }

    const body = (await req.json()) as HoroscopeAIRequest;

    // Validate input
    if (!body.zodiacSign || !body.period || !body.baseline) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const prompt = buildHoroscopePrompt(body);

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
          enhancedAspects: body.baseline.aspects,
          advice: body.baseline.advice,
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
            enhancedAspects: body.baseline.aspects,
            advice: body.baseline.advice,
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
            enhancedAspects: body.baseline.aspects,
            advice: body.baseline.advice,
          },
        });
      }
    }

    // Success - return AI-enhanced interpretation
    return NextResponse.json({
      ok: true,
      ai: parsed as HoroscopeAIResponse,
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
