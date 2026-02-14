/**
 * Spirit Card Prompt Template Builder
 * 
 * This module provides specialized prompt building for spirit card readings with:
 * - Life path number connection guidance
 * - Orientation-specific instructions (upright vs reversed)
 * - Long-term personal development focus
 * - Natural strengths and growth areas analysis
 * - Thai cultural context integration
 */

import type { SpiritPromptParams } from '@/lib/ai/types';
import { PromptBuilder } from './base';
import { getContextForDivinationType } from '../cultural/thai-context';
import { SPIRIT_EXAMPLES_BY_ORIENTATION } from '../examples/spirit-examples';

/**
 * Build a complete spirit card reading prompt with orientation-specific instructions
 * 
 * @param params - Spirit card reading parameters (card, orientation, lifePathNumber, dob)
 * @returns Complete prompt string ready for Gemini API
 */
export function buildSpiritPrompt(params: SpiritPromptParams): string {
  const { card, orientation, lifePathNumber, dob } = params;

  // Build role definition
  const role = buildSpiritRole();

  // Get Thai cultural context for spirit cards (includes astrology and numerology)
  const culturalContext = getContextForDivinationType('spirit');

  // Select appropriate few-shot examples based on orientation
  const examples = selectExamplesForOrientation(orientation);

  // Build orientation-specific instructions
  const instructions = buildSpiritInstructions(params);

  // Format user data (card, orientation, life path number, DOB)
  const userData = formatSpiritUserData(params);

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
 * Build the role definition for spirit card reading AI
 */
function buildSpiritRole(): string {
  return `คุณคือผู้เชี่ยวชาญด้านไพ่ทาโรต์และเลขศาสตร์ที่ทำงานกับโปรเจกต์ REFFORTUNE

บทบาทของคุณในการอ่านไพ่ประจำตัว (Spirit Card):
- วิเคราะห์ความเชื่อมโยงระหว่างวันเกิด เลขเส้นทางชีวิต และไพ่ประจำตัว
- ให้คำแนะนำระยะยาวเกี่ยวกับการพัฒนาตัวเอง ไม่ใช่การทำนายระยะสั้น
- อธิบายจุดแข็งตามธรรมชาติ (ไพ่ตั้งตรง) หรือจุดที่ต้องพัฒนา (ไพ่กลับหัว)
- ใช้ภาษาไทยที่อบอุ่น ให้กำลังใจ และสร้างแรงบันดาลใจ
- เชื่อมโยงไพ่กับธีมการพัฒนาตัวเองและเส้นทางชีวิต`;
}

/**
 * Select appropriate few-shot examples based on card orientation
 */
function selectExamplesForOrientation(orientation: SpiritPromptParams['orientation']) {
  if (orientation === 'upright') {
    return SPIRIT_EXAMPLES_BY_ORIENTATION.upright;
  } else {
    return SPIRIT_EXAMPLES_BY_ORIENTATION.reversed;
  }
}

/**
 * Build orientation-specific instructions for spirit card reading
 */
function buildSpiritInstructions(params: SpiritPromptParams): string {
  const { orientation } = params;

  // Base instructions for all spirit card readings
  const baseInstructions = `## คำแนะนำการตีความไพ่ประจำตัว

### โครงสร้างการตอบ
ตอบเป็น JSON เท่านั้น โดยมีคีย์ 2 ตัว:
- summary: (ย่อหน้าเดียว) สรุปความหมายของไพ่ประจำตัวและเลขเส้นทางชีวิต อธิบายพลังงานหลักที่คุณเกิดมาพร้อม
- cardStructure: (จัดเป็น 3 ส่วน) ต้องมีหัวข้อชัดเจน:
  * ภาพรวมสถานการณ์: อธิบายพลังงานของไพ่และเลขเส้นทางชีวิต บุคลิกภาพและพรสวรรค์ตามธรรมชาติ
  * จุดที่ควรระวัง: ระบุความท้าทายหรือจุดอ่อนที่อาจเกิดขึ้น พร้อมคำแนะนำป้องกัน
  * แนวทางที่ควรทำ: ให้แนวทางการพัฒนาตัวเองระยะยาว เหมาะกับอาชีพหรือทิศทางชีวิต

### หลักการตีความไพ่ประจำตัว

**1. การเชื่อมโยงเลขเส้นทางชีวิตกับไพ่**
- อธิบายว่าเลขเส้นทางชีวิตเสริมหรือสะท้อนพลังงานของไพ่อย่างไร
- ชี้ให้เห็นความสอดคล้องหรือความตึงเครียดระหว่างเลขกับไพ่
- เชื่อมโยงความหมายของเลขในเลขศาสตร์ไทยกับสัญลักษณ์ของไพ่
- อธิบายว่าการผสมผสานนี้สร้างบุคลิกภาพและเส้นทางชีวิตอย่างไร

**2. มุมมองระยะยาว**
- ให้คำแนะนำเกี่ยวกับการพัฒนาตัวเองตลอดชีวิต ไม่ใช่การทำนายระยะสั้น
- เน้นการเรียนรู้ การเติบโต และการค้นพบตัวเอง
- อธิบายว่าพลังงานของไพ่จะแสดงออกอย่างไรในแต่ละช่วงชีวิต
- ให้แนวทางที่สามารถนำไปใช้ได้ตลอดชีวิต ไม่ใช่แค่ช่วงเวลาหนึ่ง

**3. การเชื่อมโยงกับธีมการพัฒนาตัวเอง**
- เชื่อมโยงไพ่กับธีมการพัฒนาตัวเอง เช่น ความมั่นใจ ความคิดสร้างสรรค์ ความเป็นผู้นำ
- อธิบายว่าไพ่นี้สอนบทเรียนชีวิตอะไร
- ให้แนวทางการพัฒนาทักษะหรือคุณสมบัติที่ไพ่แทน
- เชื่อมโยงกับเป้าหมายชีวิตและความหมายของการมีชีวิต`;

  // Add orientation-specific instructions
  const orientationInstructions = buildOrientationInstructions(orientation);

  // Add actionable guidance instructions
  const actionableInstructions = `

**4. คำแนะนำที่นำไปปฏิบัติได้**
- แนะนำอาชีพหรือสายงานที่เหมาะสมกับพลังงานของไพ่
- ให้แนวทางการพัฒนาทักษะที่เฉพาะเจาะจง
- แนะนำกิจกรรมหรือการฝึกฝนที่จะเสริมจุดแข็ง
- ให้คำแนะนำเกี่ยวกับความสัมพันธ์และการทำงานร่วมกับผู้อื่น

**5. น้ำเสียงที่ให้กำลังใจ**
- ใช้ภาษาที่อบอุ่น เป็นกันเอง และให้กำลังใจ
- แม้ไพ่กลับหัว ก็ให้มองเป็นโอกาสในการเติบโต ไม่ใช่ข้อจำกัด
- เน้นศักยภาพและความเป็นไปได้ ไม่ใช่ข้อจำกัด
- สร้างความมั่นใจและแรงบันดาลใจให้ผู้อ่าน`;

  return `${baseInstructions}${orientationInstructions}${actionableInstructions}`;
}

/**
 * Build instructions specific to card orientation
 */
function buildOrientationInstructions(orientation: SpiritPromptParams['orientation']): string {
  if (orientation === 'upright') {
    return `

**การตีความไพ่ตั้งตรง (Upright)**
- เน้นจุดแข็งและพรสวรรค์ตามธรรมชาติที่คุณเกิดมาพร้อม
- อธิบายว่าคุณมีความสามารถพิเศษอะไรที่โดดเด่น
- บอกว่าคุณทำอะไรได้ดีโดยธรรมชาติ ไม่ต้องฝืนตัวเอง
- ให้คำแนะนำว่าจะใช้จุดแข็งนี้ให้เกิดประโยชน์สูงสุดได้อย่างไร
- อธิบายว่าผู้คนมักรับรู้หรือชื่นชมคุณในด้านใด
- แนะนำทิศทางชีวิตที่จะทำให้คุณรู้สึกเติมเต็มและมีความสุข`;
  } else {
    return `

**การตีความไพ่กลับหัว (Reversed)**
- เน้นจุดที่ต้องพัฒนาและความท้าทายที่ต้องเผชิญ
- อธิบายด้านเงา (shadow aspect) หรือพลังงานที่ยังไม่เต็มที่
- ไม่ใช่แค่ "ตรงข้าม" ของไพ่ตั้งตรง แต่เป็นพลังงานที่ถูกกดไว้หรือใช้ในทางที่ผิด
- ให้คำแนะนำว่าจะปลดล็อกหรือพัฒนาพลังงานนี้ได้อย่างไร
- อธิบายว่าความท้าทายนี้สอนบทเรียนชีวิตอะไร
- มองความท้าทายเป็นโอกาสในการเติบโต ไม่ใช่ข้อจำกัดถาวร
- ให้แนวทางการเปลี่ยนแปลงและพัฒนาตัวเองอย่างเป็นขั้นตอน`;
  }
}

/**
 * Format user data (card, orientation, life path number, DOB) for the prompt
 */
function formatSpiritUserData(params: SpiritPromptParams): string {
  const { card, orientation, lifePathNumber, dob } = params;

  const orientationText = orientation === 'upright' ? 'ตั้งตรง' : 'กลับหัว';
  
  // Get card meaning/keywords
  const cardKeywords = getCardKeywords(card, orientation);

  return `## ข้อมูลไพ่ประจำตัว

วันเกิด: ${dob}
เลขเส้นทางชีวิต: ${lifePathNumber}
ไพ่ประจำตัว: ${card.name} (${orientationText})
ความหมายไพ่: ${cardKeywords}`;
}

/**
 * Get card keywords based on orientation
 */
function getCardKeywords(card: SpiritPromptParams['card'], orientation: SpiritPromptParams['orientation']): string {
  // For spirit cards, we use the card's meaning based on orientation
  const baseMeaning = orientation === 'upright' 
    ? card.meaningUpright 
    : card.meaningReversed;
  
  if (orientation === 'reversed') {
    return `${baseMeaning} (กลับหัว: พลังงานที่ถูกกดไว้ จุดที่ต้องพัฒนา ความท้าทายในการเติบโต)`;
  }
  
  return baseMeaning;
}
