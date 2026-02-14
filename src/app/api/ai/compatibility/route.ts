import { NextResponse } from "next/server";
import type { ZodiacSign } from "@/lib/horoscope/types";

interface CompatibilityAIRequest {
  person1: {
    birthDate: string; // ISO date string
    zodiacSign: ZodiacSign;
  };
  person2: {
    birthDate: string; // ISO date string
    zodiacSign: ZodiacSign;
  };
  baseline: {
    overallScore: number;
    scores: {
      overall: number;
      communication: number;
      emotional: number;
      longTerm: number;
    };
    strengths: string[];
    challenges: string[];
    advice: string;
    elementCompatibility: string;
  };
}

interface CompatibilityAIResponse {
  summary: string;
  detailedAnalysis: {
    communication: string;
    emotional: string;
    longTerm: string;
  };
  personalizedAdvice: string;
  strengthsInsight: string;
  challengesGuidance: string;
}

function buildCompatibilityPrompt(request: CompatibilityAIRequest): string {
  const zodiacThai: Record<ZodiacSign, string> = {
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
  };

  const person1Thai = zodiacThai[request.person1.zodiacSign];
  const person2Thai = zodiacThai[request.person2.zodiacSign];

  return `คุณเป็นนักโหราศาสตร์ไทยที่เชี่ยวชาญด้านการวิเคราะห์ความเข้ากันได้ในความสัมพันธ์

## บริบททางวัฒนธรรมไทย

ในการวิเคราะห์ความเข้ากันได้แบบไทย เราเชื่อในหลักพุทธศาสนาเรื่องกรรม บุญ และการใช้ชีวิตร่วมกันด้วยความเมตตา การวิเคราะห์ควรให้คำแนะนำที่สร้างสรรค์และช่วยให้ความสัมพันธ์เติบโตได้ ไม่ใช่การทำนายที่คลุมเครือหรือสร้างความกังวล

## คำแนะนำ

วิเคราะห์ความเข้ากันได้ระหว่างราศี${person1Thai} และราศี${person2Thai} โดย:

1. ใช้ข้อมูลพื้นฐานที่ให้มาเป็นแนวทาง
2. เพิ่มรายละเอียดที่เป็นส่วนตัวและเฉพาะเจาะจงสำหรับคู่นี้
3. ใช้ภาษาไทยที่เป็นกันเองและเข้าใจง่าย
4. ให้คำแนะนำที่ปฏิบัติได้จริงสำหรับการสร้างความสัมพันธ์ที่ดี
5. เน้นแง่บวกและโอกาสในการพัฒนาความสัมพันธ์

## ข้อมูลพื้นฐาน

คนที่ 1: ราศี${person1Thai} (เกิดวันที่ ${request.person1.birthDate})
คนที่ 2: ราศี${person2Thai} (เกิดวันที่ ${request.person2.birthDate})

คะแนนความเข้ากันได้โดยรวม: ${request.baseline.overallScore}/100
คะแนนการสื่อสาร: ${request.baseline.scores.communication}/100
คะแนนความเชื่อมโยงทางอารมณ์: ${request.baseline.scores.emotional}/100
คะแนนศักยภาพระยะยาว: ${request.baseline.scores.longTerm}/100

ความเข้ากันของธาตุ: ${request.baseline.elementCompatibility}

จุดแข็งของความสัมพันธ์:
${request.baseline.strengths.map((s, i) => `${i + 1}. ${s}`).join("\n")}

ความท้าทายของความสัมพันธ์:
${request.baseline.challenges.map((c, i) => `${i + 1}. ${c}`).join("\n")}

คำแนะนำพื้นฐาน: ${request.baseline.advice}

## รูปแบบผลลัพธ์ (JSON)

ตอบกลับในรูปแบบ JSON ที่มีโครงสร้างดังนี้:
{
  "summary": "สรุปภาพรวมความเข้ากันได้ของคู่นี้ (120-150 คำ)",
  "detailedAnalysis": {
    "communication": "วิเคราะห์เชิงลึกด้านการสื่อสารระหว่างกัน (80-100 คำ)",
    "emotional": "วิเคราะห์เชิงลึกด้านความเชื่อมโยงทางอารมณ์ (80-100 คำ)",
    "longTerm": "วิเคราะห์เชิงลึกด้านศักยภาพระยะยาว (80-100 คำ)"
  },
  "personalizedAdvice": "คำแนะนำเฉพาะสำหรับคู่นี้ที่ปฏิบัติได้จริง (120-150 คำ)",
  "strengthsInsight": "ข้อมูลเชิงลึกเกี่ยวกับจุดแข็งและวิธีใช้ประโยชน์ (80-100 คำ)",
  "challengesGuidance": "คำแนะนำในการรับมือกับความท้าทายและพัฒนาความสัมพันธ์ (80-100 คำ)"
}`;
}

function validateResponse(parsed: unknown): parsed is CompatibilityAIResponse {
  if (!parsed || typeof parsed !== "object") return false;
  
  const obj = parsed as Record<string, unknown>;
  
  // Check summary
  if (typeof obj.summary !== "string" || obj.summary.length < 100) return false;
  
  // Check detailedAnalysis
  if (!obj.detailedAnalysis || typeof obj.detailedAnalysis !== "object") return false;
  const analysis = obj.detailedAnalysis as Record<string, unknown>;
  if (
    typeof analysis.communication !== "string" || analysis.communication.length < 50 ||
    typeof analysis.emotional !== "string" || analysis.emotional.length < 50 ||
    typeof analysis.longTerm !== "string" || analysis.longTerm.length < 50
  ) return false;
  
  // Check personalizedAdvice
  if (typeof obj.personalizedAdvice !== "string" || obj.personalizedAdvice.length < 100) return false;
  
  // Check strengthsInsight
  if (typeof obj.strengthsInsight !== "string" || obj.strengthsInsight.length < 50) return false;
  
  // Check challengesGuidance
  if (typeof obj.challengesGuidance !== "string" || obj.challengesGuidance.length < 50) return false;
  
  return true;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });
    }

    const body = (await req.json()) as CompatibilityAIRequest;

    // Validate input
    if (!body.person1 || !body.person2 || !body.baseline) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const prompt = buildCompatibilityPrompt(body);

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
          detailedAnalysis: {
            communication: `คะแนนการสื่อสาร: ${body.baseline.scores.communication}/100`,
            emotional: `คะแนนความเชื่อมโยงทางอารมณ์: ${body.baseline.scores.emotional}/100`,
            longTerm: `คะแนนศักยภาพระยะยาว: ${body.baseline.scores.longTerm}/100`,
          },
          personalizedAdvice: body.baseline.advice,
          strengthsInsight: body.baseline.strengths.join(" "),
          challengesGuidance: body.baseline.challenges.join(" "),
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
            detailedAnalysis: {
              communication: `คะแนนการสื่อสาร: ${body.baseline.scores.communication}/100`,
              emotional: `คะแนนความเชื่อมโยงทางอารมณ์: ${body.baseline.scores.emotional}/100`,
              longTerm: `คะแนนศักยภาพระยะยาว: ${body.baseline.scores.longTerm}/100`,
            },
            personalizedAdvice: body.baseline.advice,
            strengthsInsight: body.baseline.strengths.join(" "),
            challengesGuidance: body.baseline.challenges.join(" "),
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
            detailedAnalysis: {
              communication: `คะแนนการสื่อสาร: ${body.baseline.scores.communication}/100`,
              emotional: `คะแนนความเชื่อมโยงทางอารมณ์: ${body.baseline.scores.emotional}/100`,
              longTerm: `คะแนนศักยภาพระยะยาว: ${body.baseline.scores.longTerm}/100`,
            },
            personalizedAdvice: body.baseline.advice,
            strengthsInsight: body.baseline.strengths.join(" "),
            challengesGuidance: body.baseline.challenges.join(" "),
          },
        });
      }
    }

    // Success - return AI-enhanced interpretation
    return NextResponse.json({
      ok: true,
      ai: parsed as CompatibilityAIResponse,
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
