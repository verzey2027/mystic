import { NextResponse } from "next/server";

interface NameNumerologyAIRequest {
  firstName: string;
  lastName: string;
  scores: {
    firstName: number;
    lastName: number;
    fullName: number;
    destiny: number;
  };
  baseline: {
    interpretation: {
      personality: string;
      strengths: string[];
      weaknesses: string[];
      lifePath: string;
      career: string;
      relationships: string;
    };
    luckyNumbers: number[];
    advice: string;
  };
}

interface NameNumerologyAIResponse {
  summary: string;
  enhancedInterpretation: {
    personality: string;
    lifePath: string;
    career: string;
    relationships: string;
  };
  personalizedAdvice: string;
  strengthsInsight: string;
  growthGuidance: string;
}

function buildNameNumerologyPrompt(request: NameNumerologyAIRequest): string {
  return `คุณเป็นนักเลขศาสตร์ไทยที่เชี่ยวชาญในการวิเคราะห์ชื่อและทำนายเส้นทางชีวิต

## บริบททางวัฒนธรรมไทย

ในการวิเคราะห์ชื่อด้วยเลขศาสตร์แบบไทย เราเชื่อในหลักพุทธศาสนาเรื่องกรรม บุญ และพลังของชื่อที่มีต่อชีวิต การวิเคราะห์ควรให้คำแนะนำที่สร้างสรรค์และช่วยให้เข้าใจตนเองมากขึ้น ไม่ใช่การทำนายที่คลุมเครือหรือสร้างความกังวล

## คำแนะนำ

วิเคราะห์ชื่อ "${request.firstName} ${request.lastName}" ด้วยเลขศาสตร์ โดย:

1. ใช้ข้อมูลพื้นฐานที่ให้มาเป็นแนวทาง
2. เพิ่มรายละเอียดที่เป็นส่วนตัวและเฉพาะเจาะจงสำหรับชื่อนี้
3. ใช้ภาษาไทยที่เป็นกันเองและเข้าใจง่าย
4. ให้คำแนะนำที่ปฏิบัติได้จริงสำหรับการพัฒนาตนเอง
5. เน้นแง่บวกและโอกาสในการเติบโต พร้อมคำแนะนำสำหรับจุดที่ควรพัฒนา

## ข้อมูลพื้นฐาน

ชื่อ: ${request.firstName}
นามสกุล: ${request.lastName}

เลขชื่อ: ${request.scores.firstName}
เลขนามสกุล: ${request.scores.lastName}
เลขชื่อเต็ม: ${request.scores.fullName}
เลขชะตา: ${request.scores.destiny}

บุคลิกภาพ: ${request.baseline.interpretation.personality}

จุดแข็ง:
${request.baseline.interpretation.strengths.map((s, i) => `${i + 1}. ${s}`).join("\n")}

จุดที่ควรพัฒนา:
${request.baseline.interpretation.weaknesses.map((w, i) => `${i + 1}. ${w}`).join("\n")}

เส้นทางชีวิต: ${request.baseline.interpretation.lifePath}
ด้านการงาน: ${request.baseline.interpretation.career}
ด้านความสัมพันธ์: ${request.baseline.interpretation.relationships}

เลขนำโชค: ${request.baseline.luckyNumbers.join(", ")}

คำแนะนำพื้นฐาน: ${request.baseline.advice}

## รูปแบบผลลัพธ์ (JSON)

ตอบกลับในรูปแบบ JSON ที่มีโครงสร้างดังนี้:
{
  "summary": "สรุปภาพรวมความหมายของชื่อและเส้นทางชีวิต (120-150 คำ)",
  "enhancedInterpretation": {
    "personality": "วิเคราะห์เชิงลึกด้านบุคลิกภาพที่เพิ่มรายละเอียด (80-100 คำ)",
    "lifePath": "วิเคราะห์เชิงลึกด้านเส้นทางชีวิตที่เพิ่มรายละเอียด (80-100 คำ)",
    "career": "วิเคราะห์เชิงลึกด้านการงานที่เพิ่มรายละเอียด (80-100 คำ)",
    "relationships": "วิเคราะห์เชิงลึกด้านความสัมพันธ์ที่เพิ่มรายละเอียด (80-100 คำ)"
  },
  "personalizedAdvice": "คำแนะนำเฉพาะสำหรับชื่อนี้ที่ปฏิบัติได้จริง (120-150 คำ)",
  "strengthsInsight": "ข้อมูลเชิงลึกเกี่ยวกับจุดแข็งและวิธีใช้ประโยชน์ (80-100 คำ)",
  "growthGuidance": "คำแนะนำในการพัฒนาจุดที่ควรปรับปรุงและเติบโตเป็นคนที่ดีขึ้น (80-100 คำ)"
}`;
}

function validateResponse(parsed: unknown): parsed is NameNumerologyAIResponse {
  if (!parsed || typeof parsed !== "object") return false;
  
  const obj = parsed as Record<string, unknown>;
  
  // Check summary
  if (typeof obj.summary !== "string" || obj.summary.length < 100) return false;
  
  // Check enhancedInterpretation
  if (!obj.enhancedInterpretation || typeof obj.enhancedInterpretation !== "object") return false;
  const interpretation = obj.enhancedInterpretation as Record<string, unknown>;
  if (
    typeof interpretation.personality !== "string" || interpretation.personality.length < 50 ||
    typeof interpretation.lifePath !== "string" || interpretation.lifePath.length < 50 ||
    typeof interpretation.career !== "string" || interpretation.career.length < 50 ||
    typeof interpretation.relationships !== "string" || interpretation.relationships.length < 50
  ) return false;
  
  // Check personalizedAdvice
  if (typeof obj.personalizedAdvice !== "string" || obj.personalizedAdvice.length < 100) return false;
  
  // Check strengthsInsight
  if (typeof obj.strengthsInsight !== "string" || obj.strengthsInsight.length < 50) return false;
  
  // Check growthGuidance
  if (typeof obj.growthGuidance !== "string" || obj.growthGuidance.length < 50) return false;
  
  return true;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "missing_gemini_api_key" }, { status: 400 });
    }

    const body = (await req.json()) as NameNumerologyAIRequest;

    // Validate input
    if (!body.firstName || !body.lastName || !body.scores || !body.baseline) {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const prompt = buildNameNumerologyPrompt(body);

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
          enhancedInterpretation: {
            personality: body.baseline.interpretation.personality,
            lifePath: body.baseline.interpretation.lifePath,
            career: body.baseline.interpretation.career,
            relationships: body.baseline.interpretation.relationships,
          },
          personalizedAdvice: body.baseline.advice,
          strengthsInsight: body.baseline.interpretation.strengths.join(" "),
          growthGuidance: body.baseline.interpretation.weaknesses.join(" "),
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
            enhancedInterpretation: {
              personality: body.baseline.interpretation.personality,
              lifePath: body.baseline.interpretation.lifePath,
              career: body.baseline.interpretation.career,
              relationships: body.baseline.interpretation.relationships,
            },
            personalizedAdvice: body.baseline.advice,
            strengthsInsight: body.baseline.interpretation.strengths.join(" "),
            growthGuidance: body.baseline.interpretation.weaknesses.join(" "),
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
            enhancedInterpretation: {
              personality: body.baseline.interpretation.personality,
              lifePath: body.baseline.interpretation.lifePath,
              career: body.baseline.interpretation.career,
              relationships: body.baseline.interpretation.relationships,
            },
            personalizedAdvice: body.baseline.advice,
            strengthsInsight: body.baseline.interpretation.strengths.join(" "),
            growthGuidance: body.baseline.interpretation.weaknesses.join(" "),
          },
        });
      }
    }

    // Success - return AI-enhanced interpretation
    return NextResponse.json({
      ok: true,
      ai: parsed as NameNumerologyAIResponse,
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
