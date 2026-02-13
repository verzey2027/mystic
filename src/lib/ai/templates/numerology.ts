/**
 * Numerology Prompt Template Builder
 * 
 * This module provides specialized prompt building for numerology readings with:
 * - Score-based framing logic (high vs low scores)
 * - Root number significance explanation
 * - Theme analysis instructions (work, money, relationships, caution)
 * - Thai cultural number beliefs integration
 * - Constructive guidance for all score ranges
 */

import type { NumerologyPromptParams } from '@/lib/ai/types';
import { PromptBuilder } from './base';
import { getContextForDivinationType } from '../cultural/thai-context';
import { NUMEROLOGY_EXAMPLES_BY_SCORE } from '../examples/numerology-examples';

/**
 * Build a complete numerology reading prompt with score-specific instructions
 * 
 * @param params - Numerology reading parameters (phone, score, tier, total, root, themes)
 * @returns Complete prompt string ready for Gemini API
 */
export function buildNumerologyPrompt(params: NumerologyPromptParams): string {
  const { normalizedPhone, score, tier, total, root, themes } = params;

  // Build role definition
  const role = buildNumerologyRole();

  // Get Thai cultural context for numerology
  const culturalContext = getContextForDivinationType('numerology');

  // Select appropriate few-shot examples based on score
  const examples = selectExamplesForScore(score);

  // Build score-specific instructions
  const instructions = buildNumerologyInstructions(params);

  // Format user data (phone number and analysis)
  const userData = formatNumerologyUserData(params);

  // Compose the complete prompt
  return new PromptBuilder()
    .withRole(role)
    .withCulturalContext(culturalContext)
    .withFewShotExamples(examples)
    .withInstructions(instructions)
    .withUserData(userData)
    .build();
}

/**
 * Build the role definition for numerology reading AI
 */
function buildNumerologyRole(): string {
  return `คุณคือผู้เชี่ยวชาญด้านเลขศาสตร์ไทยที่ทำงานกับโปรเจกต์ REFFORTUNE

บทบาทของคุณในการวิเคราะห์เบอร์โทรศัพท์:
- วิเคราะห์ความหมายของตัวเลขตามความเชื่อไทยและเลขศาสตร์สากล
- อธิบายความสำคัญของเลขราก (root number) และเลขรวม (total)
- ให้คำแนะนำที่สมดุลและสร้างสรรค์ ไม่ว่าคะแนนจะสูงหรือต่ำ
- วิเคราะห์แต่ละธีม (งาน เงิน ความสัมพันธ์ คำเตือน) ด้วยตัวอย่างเฉพาะเจาะจง
- ใช้ภาษาไทยที่เข้าใจง่าย อบอุ่น และให้กำลังใจ`;
}

/**
 * Select appropriate few-shot examples based on score
 */
function selectExamplesForScore(score: number): typeof NUMEROLOGY_EXAMPLES_BY_SCORE.high {
  // High score: 80+
  if (score >= 80) {
    return NUMEROLOGY_EXAMPLES_BY_SCORE.high;
  }
  // Low score: < 40
  else if (score < 40) {
    return NUMEROLOGY_EXAMPLES_BY_SCORE.low;
  }
  // Medium score: use high score examples as they're more balanced
  else {
    return NUMEROLOGY_EXAMPLES_BY_SCORE.high;
  }
}

/**
 * Build score-specific instructions for numerology reading
 */
function buildNumerologyInstructions(params: NumerologyPromptParams): string {
  const { score } = params;

  // Base instructions for all numerology readings
  const baseInstructions = `## คำแนะนำการวิเคราะห์เบอร์โทรศัพท์

### โครงสร้างการตอบ
ตอบเป็น JSON เท่านั้น โดยมีคีย์ 2 ตัว:
- summary: (ย่อหน้าเดียว) สรุปภาพรวมของเบอร์ อธิบายคะแนน เลขราก และพลังงานหลัก
- cardStructure: (จัดเป็น 3 ส่วน) ต้องมีหัวข้อชัดเจน:
  * ภาพรวมสถานการณ์: อธิบายความหมายของเลขราก เลขรวม และลำดับตัวเลข วิเคราะห์พลังงานโดยรวมของเบอร์
  * จุดที่ควรระวัง: ระบุความเสี่ยงหรือข้อควรระวังที่เฉพาะเจาะจง พร้อมตัวอย่างสถานการณ์
  * แนวทางที่ควรทำ: ให้คำแนะนำปฏิบัติที่ชัดเจน เช่น การใช้เบอร์อย่างไร เวลาที่เหมาะสม หรือการปรับปรุง

### หลักการวิเคราะห์เบอร์

**1. ความสำคัญของเลขราก (Root Number)**
- อธิบายว่าเลขรากคำนวณมาอย่างไร (รวมตัวเลขทั้งหมดแล้วลดเหลือหลักเดียว)
- อธิบายความหมายของเลขรากตามความเชื่อไทย
- เชื่อมโยงเลขรากกับพลังงานหลักของเบอร์
- อธิบายว่าเลขรากส่งผลต่อด้านต่างๆ ของชีวิตอย่างไร

**2. การวิเคราะห์แต่ละธีม**
ต้องวิเคราะห์ทั้ง 4 ธีมด้วยตัวอย่างเฉพาะเจาะจง:

**ด้านการงาน:**
- อธิบายว่าเบอร์นี้เหมาะกับงานประเภทใด
- ระบุโอกาสหรืออุปสรรคในการทำงาน
- ให้คำแนะนำเกี่ยวกับการใช้เบอร์ในการติดต่อธุรกิจ
- ตัวอย่าง: "เหมาะกับการเจรจาต่อรอง" หรือ "ควรระมัดระวังในการเซ็นสัญญา"

**ด้านการเงิน:**
- อธิบายแนวโน้มการเงินของเบอร์นี้
- ระบุว่าเงินไหลเวียนดีหรือติดขัด
- ให้คำแนะนำเกี่ยวกับการลงทุนหรือการออม
- ตัวอย่าง: "มีโอกาสได้โชคลาภ" หรือ "ต้องระมัดระวังการใช้จ่าย"

**ด้านความสัมพันธ์:**
- อธิบายว่าเบอร์นี้ส่งผลต่อความสัมพันธ์อย่างไร
- ระบุว่าเหมาะกับการสร้างมิตรภาพหรือความรัก
- ให้คำแนะนำเกี่ยวกับการสื่อสารกับผู้อื่น
- ตัวอย่าง: "เป็นที่รักและมีเสน่ห์" หรือ "อาจมีความเข้าใจผิดบ่อย"

**คำเตือน:**
- ระบุสิ่งที่ควรหลีกเลี่ยงเมื่อใช้เบอร์นี้
- เตือนเกี่ยวกับความเสี่ยงที่เฉพาะเจาะจง
- ให้คำแนะนำป้องกันที่ปฏิบัติได้จริง
- ตัวอย่าง: "หลีกเลี่ยงการตัดสินใจใหญ่" หรือ "ระวังคนหลอกลวง"

**3. ความเชื่อเรื่องตัวเลขในวัฒนธรรมไทย**
- อ้างอิงความเชื่อไทยเกี่ยวกับตัวเลขเมื่อเหมาะสม
- อธิบายความหมายของเลขมงคล (9, 8, 6) หรือเลขที่ต้องระวัง
- อธิบายผลของการซ้ำของตัวเลข (เช่น 777, 4444)
- เชื่อมโยงกับความเชื่อเรื่องฤกษ์ยามและโชคชะตา`;

  // Add score-specific framing instructions
  const scoringInstructions = buildScoringInstructions(score);

  // Add actionable guidance instructions
  const actionableInstructions = `

**4. คำแนะนำที่นำไปปฏิบัติได้**
- ให้คำแนะนำเฉพาะเจาะจงว่าควรใช้เบอร์นี้อย่างไร
- แนะนำเวลาหรือสถานการณ์ที่เหมาะสมในการใช้เบอร์
- ถ้าคะแนนต่ำ ให้คำแนะนำเกี่ยวกับการเปลี่ยนเบอร์หรือหาเบอร์สำรอง
- ถ้าคะแนนสูง ให้คำแนะนำว่าจะใช้ประโยชน์จากเบอร์ได้สูงสุดอย่างไร
- แนะนำการทำบุญหรือพิธีกรรมที่เหมาะสม (ถ้าจำเป็น)

**5. สมดุลระหว่างความหวังและความจริง**
- ไม่ว่าคะแนนจะสูงหรือต่ำ ให้คำแนะนำที่สมดุล
- เบอร์ดีไม่ได้หมายความว่าทุกอย่างจะสำเร็จเอง ต้องมีความพยายาม
- เบอร์ไม่ดีไม่ได้หมายความว่าชีวิตจะล้มเหลว ยังมีทางออกและทางเลือก
- เน้นว่าเบอร์เป็นเพียงปัจจัยหนึ่ง การกระทำและทัศนคติสำคัญกว่า
- ให้ความหวังที่สมจริง ไม่หลอกลวงหรือสร้างความกลัว`;

  return `${baseInstructions}${scoringInstructions}${actionableInstructions}`;
}

/**
 * Build instructions specific to score range
 */
function buildScoringInstructions(score: number): string {
  if (score >= 80) {
    // High score: Positive but not overconfident
    return `

**การกรอบคำตอบสำหรับคะแนนสูง (80+)**
- เน้นด้านบวกและโอกาสที่ดี แต่ไม่เกินจริง
- อธิบายว่าเบอร์นี้มีพลังงานที่สนับสนุนความสำเร็จ
- เตือนว่าเบอร์ดีต้องใช้คู่กับความพยายามและความมุ่งมั่น
- หลีกเลี่ยงการสร้างความคาดหวังที่สูงเกินไป
- ให้คำแนะนำว่าจะรักษาและใช้ประโยชน์จากเบอร์ดีได้อย่างไร
- เตือนอย่าประมาทหรือหยุดพัฒนาตัวเอง`;
  } else if (score < 40) {
    // Low score: Constructive without negativity
    return `

**การกรอบคำตอบสำหรับคะแนนต่ำ (< 40)**
- ให้คำแนะนำที่สร้างสรรค์ ไม่ใช่แค่บอกว่าเบอร์ไม่ดี
- อธิบายว่าเบอร์นี้มีความท้าทาย แต่ไม่ได้หมายความว่าใช้ไม่ได้
- เน้นการใช้อย่างมีสติและมีกลยุทธ์
- ให้ทางเลือกและทางออก เช่น การเปลี่ยนเบอร์หรือหาเบอร์สำรอง
- หลีกเลี่ยงการสร้างความกลัวหรือความท้อแท้
- ให้กำลังใจและเน้นว่าการกระทำสำคัญกว่าเบอร์
- อธิบายว่าเบอร์ต่ำสามารถใช้ในบางสถานการณ์ได้ (เช่น เรื่องส่วนตัว)`;
  } else {
    // Medium score: Balanced assessment
    return `

**การกรอบคำตอบสำหรับคะแนนปานกลาง (40-79)**
- ให้คำแนะนำที่สมดุล ชี้ให้เห็นทั้งจุดแข็งและจุดอ่อน
- อธิบายว่าเบอร์นี้ใช้งานได้ดีในบางสถานการณ์
- ระบุสถานการณ์ที่เหมาะสมและไม่เหมาะสมในการใช้เบอร์
- ให้คำแนะนำเกี่ยวกับการเพิ่มประสิทธิภาพของเบอร์
- เน้นว่าเบอร์ปานกลางต้องใช้คู่กับความระมัดระวัง
- แนะนำว่าอาจพิจารณาหาเบอร์ที่ดีกว่าสำหรับเรื่องสำคัญ`;
  }
}

/**
 * Format user data (phone number and analysis) for the prompt
 */
function formatNumerologyUserData(params: NumerologyPromptParams): string {
  const { normalizedPhone, score, tier, total, root, themes } = params;

  return `## ข้อมูลการวิเคราะห์เบอร์โทรศัพท์

เบอร์โทรศัพท์: ${formatPhoneDisplay(normalizedPhone)}
เบอร์ที่ปรับแล้ว: ${normalizedPhone}
คะแนน: ${score}/99 (${tier})
เลขรวม: ${total}
เลขราก: ${root}

ธีมการวิเคราะห์:
- งาน: ${themes.work}
- เงิน: ${themes.money}
- ความสัมพันธ์: ${themes.relationship}
- คำเตือน: ${themes.caution}`;
}

/**
 * Format phone number for display (add dashes for readability)
 */
function formatPhoneDisplay(normalizedPhone: string): string {
  // Format as XXX-XXX-XXXX
  if (normalizedPhone.length === 10) {
    return `${normalizedPhone.slice(0, 3)}-${normalizedPhone.slice(3, 6)}-${normalizedPhone.slice(6)}`;
  }
  return normalizedPhone;
}
