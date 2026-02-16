/**
 * Tarot Prompt Template Builder
 * 
 * This module provides specialized prompt building for tarot readings with:
 * - Spread-specific logic (1, 2, 3, 4, 10-card spreads)
 * - Card relationship analysis
 * - Reversed card interpretation guidance
 * - Major Arcana emphasis
 * - Thai cultural context integration
 */

import type { TarotPromptParams } from '@/lib/ai/types';
import { PromptBuilder } from './base';
import { getContextForDivinationType } from '../cultural/thai-context';
import { TAROT_EXAMPLES_BY_SPREAD } from '../examples/tarot-examples';
import { cardMeaning } from '@/lib/tarot/engine';

/**
 * Build a complete tarot reading prompt with spread-specific instructions
 * 
 * @param params - Tarot reading parameters (cards, count, question, spreadType)
 * @returns Complete prompt string ready for Gemini API
 */
export function buildTarotPrompt(params: TarotPromptParams): string {
  const { cards, count, question, spreadType } = params;

  // Build role definition
  const role = buildTarotRole();

  // Get Thai cultural context for tarot
  const culturalContext = getContextForDivinationType('tarot');

  // Select appropriate few-shot examples based on spread type
  const examples = selectExamplesForSpread(spreadType);

  // Build spread-specific instructions
  const instructions = buildTarotInstructions(params);

  // Format user data (cards and question)
  const userData = formatTarotUserData(params);

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
 * Build the role definition for tarot reading AI
 */
function buildTarotRole(): string {
  return `คุณคือผู้อ่านไพ่ทาโรต์ผู้เชี่ยวชาญที่ทำงานกับโปรเจกต์ REFFORTUNE

บทบาทของคุณ:
- ให้คำแนะนำที่ชัดเจน เฉพาะเจาะจง และนำไปปฏิบัติได้จริง
- ใช้ภาษาไทยที่เป็นธรรมชาติ อบอุ่น และเข้าใจง่าย
- วิเคราะห์ความสัมพันธ์ระหว่างไพ่และความหมายรวม
- ให้คำแนะนำที่สมดุลระหว่างความหวังและความจริง
- หลีกเลี่ยงการทำนายแบบเด็ดขาด แต่ให้แนวทางที่มั่นใจ`;
}

/**
 * Select appropriate few-shot examples based on spread type
 */
function selectExamplesForSpread(spreadType: 1 | 2 | 3 | 4 | 5 | 6 | 10) {
  switch (spreadType) {
    case 1:
      return TAROT_EXAMPLES_BY_SPREAD.single;
    case 2:
      return TAROT_EXAMPLES_BY_SPREAD.dual;
    case 3:
      return TAROT_EXAMPLES_BY_SPREAD.three;
    case 4:
      return TAROT_EXAMPLES_BY_SPREAD.action;
    case 5:
      return TAROT_EXAMPLES_BY_SPREAD.five;
    case 6:
      return TAROT_EXAMPLES_BY_SPREAD.relationship;
    case 10:
      return TAROT_EXAMPLES_BY_SPREAD.celtic;
    default:
      return TAROT_EXAMPLES_BY_SPREAD.three;
  }
}

/**
 * Build spread-specific instructions for tarot reading
 */
function buildTarotInstructions(params: TarotPromptParams): string {
  const { cards, spreadType } = params;

  // Base instructions for all tarot readings using the "FULL PACK" schema
  const baseInstructions = `## คำแนะนำการตีความไพ่ (Schema-First)

### รูปแบบการตอบกลับ (JSON Only)
คุณต้องตอบกลับเป็น JSON ที่ถูกต้องตามโครงสร้างนี้เท่านั้น:
{
  "summary": "สรุปภาพรวมคำทำนาย 2-4 บรรทัด",
  "cards": [
    {
      "position": "ชื่อตำแหน่ง (เช่น อดีต, ปัจจุบัน, อนาคต)",
      "card": "ชื่อไพ่ภาษาไทย",
      "keywords": ["คำค้น 1", "คำค้น 2"],
      "meaning": "การตีความไพ่ใบนี้ในบริบทของคำถาม"
    }
  ],
  "opportunities": ["โอกาส/จุดเด่น 1", "โอกาส/จุดเด่น 2"],
  "risks": ["จุดควรระวัง/อุปสรรค 1", "จุดควรระวัง 2"],
  "actions": ["สิ่งที่ควรทำทันที 1", "สิ่งที่ควรทำ 2"],
  "timeframe": "กรอบเวลาที่คาดหวัง (เช่น ภายใน 1 เดือน)",
  "confidence": "low|med|high",
  "disclaimer": "คำเตือนมาตรฐาน (ความเชื่อส่วนบุคคล)"
}

### หลักการตีความ
1. **ความเฉพาะเจาะจง**: ให้คำแนะนำที่เป็นรูปธรรม อ้างอิงบริบทจริงของผู้ใช้ (งาน/รัก/เงิน)
2. **ความสัมพันธ์**: เชื่อมโยงไพ่แต่ละใบเข้าหากันเป็นเรื่องราวเดียว
3. **คุณภาพคำตอบ**: อ้างอิงข้อมูลจาก Knowledge Base ที่แนบมาให้มากที่สุด`;

  // Add reversed card instructions if any cards are reversed
  const hasReversed = cards.some(c => c.orientation === 'reversed');
  const reversedInstructions = hasReversed ? `

**3. ไพ่กลับหัว (Reversed Cards)**
- เมื่อไพ่กลับหัว ให้อธิบายด้านเงา (shadow aspect) หรือพลังงานที่ถูกขัดขวาง
- ไม่ใช่แค่ "ตรงข้าม" ของไพ่ตั้งตรง แต่เป็นพลังงานที่ยังไม่เต็มที่หรือถูกกดไว้
- ให้คำแนะนำว่าจะปลดล็อกพลังงานนี้ได้อย่างไร` : '';

  // Add Major Arcana emphasis if any Major Arcana cards are present
  const hasMajorArcana = cards.some(c => c.card.arcana === 'major');
  const majorArcanaInstructions = hasMajorArcana ? `

**4. ไพ่เมเจอร์อาร์คานา (Major Arcana)**
- เมื่อมีไพ่ Major Arcana ให้เน้นย้ำความสำคัญของมัน
- Major Arcana แทนธีมชีวิตใหญ่ บทเรียนสำคัญ หรือจุดเปลี่ยนที่สำคัญ
- อธิบายว่าไพ่นี้บอกอะไรเกี่ยวกับเส้นทางชีวิตหรือการเติบโตของผู้ถาม` : '';

  // Add actionable guidance instructions
  const actionableInstructions = `

**5. คำแนะนำที่นำไปปฏิบัติได้**
- ในส่วน "แนวทางที่ควรทำ" ให้ขั้นตอนที่ชัดเจน เรียงลำดับ
- ระบุกรอบเวลาที่เฉพาะเจาะจง (วัน สัปดาห์ เดือน)
- ให้คำแนะนำที่ผู้ถามสามารถควบคุมได้ ไม่ใช่สิ่งที่ขึ้นกับคนอื่น

**6. สัญลักษณ์และความหมายเชิงลึก**
- อ้างอิงสัญลักษณ์ในไพ่เมื่อเหมาะสม (เช่น "ดาบในไพ่นี้แทนความคิดที่คม")
- เชื่อมโยงกับความหมายดั้งเดิม (archetypal meanings) ของไพ่
- ใช้ภาพพจน์ที่ช่วยให้เข้าใจง่ายขึ้น

**7. สมดุลระหว่างความหวังและความจริง**
- หลีกเลี่ยงการทำนายแบบเด็ดขาด 100% (เช่น "คุณจะสำเร็จแน่นอน")
- ใช้ภาษาที่แสดงแนวโน้มและโอกาส (เช่น "มีโอกาสสูง", "แนวโน้มบ่งชี้ว่า")
- แม้สถานการณ์ยาก ก็ให้ความหวังและทางออกที่สมจริง`;

  // Add spread-specific instructions
  const spreadInstructions = buildSpreadSpecificInstructions(spreadType, cards);

  return `${baseInstructions}${reversedInstructions}${majorArcanaInstructions}${actionableInstructions}

${spreadInstructions}`;
}

/**
 * Build instructions specific to the spread type
 */
function buildSpreadSpecificInstructions(spreadType: 1 | 2 | 3 | 4 | 5 | 6 | 10, cards: TarotPromptParams['cards']): string {
  switch (spreadType) {
    case 1:
      return `### คำแนะนำเฉพาะสำหรับไพ่ 1 ใบ
- โฟกัสที่ข้อความหลักของไพ่ใบนี้
- ให้คำแนะนำที่กระชับแต่ลึกซึ้ง
- เหมาะสำหรับคำแนะนำรายวันหรือคำถามเฉพาะเจาะจง
- ไม่ต้องยืดยาว เน้นความชัดเจนและนำไปปฏิบัติได้`;

    case 2:
      return `### คำแนะนำเฉพาะสำหรับไพ่ 2 ใบ (Choice/Duality)
- **ไพ่ใบที่ 1 (ทางเลือก A)**: วิเคราะห์ข้อดี ข้อเสีย พลังงาน และแนวโน้มของทางเลือกนี้
- **ไพ่ใบที่ 2 (ทางเลือก B)**: วิเคราะห์ข้อดี ข้อเสีย พลังงาน และแนวโน้มของทางเลือกนี้
- เปรียบเทียบทั้งสองทางเลือกอย่างชัดเจน ชี้ให้เห็นความแตกต่าง
- ให้คำแนะนำว่าทางไหนเหมาะกับสถานการณ์มากกว่า พร้อมเหตุผล
- ไม่ตัดสินใจแทนผู้ถาม แต่ให้ข้อมูลเพียงพอเพื่อตัดสินใจ`;

    case 3:
      return `### คำแนะนำเฉพาะสำหรับไพ่ 3 ใบ (Past-Present-Future)
- **ไพ่ใบที่ 1 (อดีต)**: อธิบายพื้นฐานหรือสาเหตุที่นำมาสู่สถานการณ์ปัจจุบัน
- **ไพ่ใบที่ 2 (ปัจจุบัน)**: วิเคราะห์สถานการณ์ที่กำลังเผชิญอยู่
- **ไพ่ใบที่ 3 (อนาคต)**: บอกแนวโน้มหรือผลลัพธ์ที่เป็นไปได้
- วิเคราะห์การไหลของเรื่องราว (narrative flow) จากอดีตสู่อนาคต
- ชี้ให้เห็นว่าอดีตส่งผลต่อปัจจุบันอย่างไร และปัจจุบันจะนำไปสู่อนาคตอย่างไร`;

    case 4:
      return `### คำแนะนำเฉพาะสำหรับไพ่ 4 ใบ (Action Plan Spread)
- **ไพ่ใบที่ 1 (สถานการณ์)**: อธิบายสถานการณ์ปัจจุบันที่ผู้ถามกำลังเผชิญ
- **ไพ่ใบที่ 2 (อุปสรรค)**: ระบุอุปสรรค ความท้าทาย หรือสิ่งที่ขัดขวางความสำเร็จ
- **ไพ่ใบที่ 3 (คำแนะนำ)**: ให้คำแนะนำที่ชัดเจนว่าควรทำอย่างไร ขั้นตอนปฏิบัติ
- **ไพ่ใบที่ 4 (ผลลัพธ์)**: บอกผลลัพธ์ที่เป็นไปได้หากทำตามคำแนะนำ
- วิเคราะห์ความเชื่อมโยงระหว่าง 4 ตำแหน่ง เป็นแผนปฏิบัติการที่ชัดเจน
- ให้กรอบเวลาที่เฉพาะเจาะจงในส่วนคำแนะนำ`;

    case 5:
      return `### คำแนะนำเฉพาะสำหรับไพ่ 5 ใบ (Five Card Cross)
- **ไพ่ใบที่ 1 (ศูนย์กลาง - สถานการณ์หลัก)**: อธิบายสถานการณ์หรือประเด็นหลักที่กำลังเผชิญ
- **ไพ่ใบที่ 2 (ขวา - อดีต)**: สิ่งที่ผ่านมาและมีอิทธิพลต่อปัจจุบัน
- **ไพ่ใบที่ 3 (ซ้าย - อนาคต)**: แนวโน้มที่กำลังจะเกิดขึ้น
- **ไพ่ใบที่ 4 (บน - เป้าหมาย/ความท้าทาย)**: สิ่งที่ต้องการบรรลุหรืออุปสรรคสูงสุด
- **ไพ่ใบที่ 5 (ล่าง - รากฐาน/จิตใต้สำนึก)**: พื้นฐานหรือปัจจัยลึกๆ ที่ขับเคลื่อนสถานการณ์
- วิเคราะห์การไหลเวียนของพลังงานในทั้ง 5 ตำแหน่ง
- เน้นความสัมพันธ์ระหว่างศูนย์กลางกับไพ่อื่นๆ
- ให้คำแนะนำที่ครอบคลุมทั้งรากเหง้าและแนวโน้ม`;

    case 6:
      return `### คำแนะนำเฉพาะสำหรับไพ่ 6 ใบ (Relationship Spread)
- **ไพ่ใบที่ 1 (คุณ)**: ตัวตน ความรู้สึก และมุมมองของคุณในความสัมพันธ์
- **ไพ่ใบที่ 2 (เขา/อีกฝ่าย)**: ตัวตน ความรู้สึก และมุมมองของอีกฝ่าย
- **ไพ่ใบที่ 3 (อดีตของความสัมพันธ์)**: พื้นฐานหรือประวัติความสัมพันธ์
- **ไพ่ใบที่ 4 (ปัจจุบัน)**: สถานการณ์ปัจจุบันของความสัมพันธ์
- **ไพ่ใบที่ 5 (อนาคต)**: แนวโน้มที่เป็นไปได้ของความสัมพันธ์
- **ไพ่ใบที่ 6 (ผลลัพธ์/คำแนะนำ)**: ผลลัพธ์ที่เป็นไปได้หรือคำแนะนำสำคัญ
- วิเคราะห์ความสัมพันธ์ระหว่างคุณกับอีกฝ่ายอย่างชัดเจน
- ชี้ให้เห็นจุดแข็ง จุดอ่อน และโอกาสในการพัฒนาความสัมพันธ์
- ให้คำแนะนำที่สร้างสรรค์สำหรับทั้งสองฝ่าย`;

    case 10:
      return `### คำแนะนำเฉพาะสำหรับไพ่ 10 ใบ (Celtic Cross)
- **ตำแหน่งที่ 1-2**: สถานการณ์หลักและสิ่งที่ขัดขวาง/สนับสนุน
- **ตำแหน่งที่ 3-4**: รากฐาน (อดีต) และอนาคตใกล้
- **ตำแหน่งที่ 5-6**: เป้าหมายและจิตใต้สำนึก
- **ตำแหน่งที่ 7-10**: ตัวตน สิ่งแวดล้อม ความหวัง/กลัว และผลลัพธ์
- ระบุธีมหลักที่ปรากฏซ้ำในหลายตำแหน่ง
- วิเคราะห์ความสัมพันธ์ระหว่างตำแหน่งที่เชื่อมโยงกัน
- ให้ภาพรวมที่ครอบคลุมแต่ไม่สับสน เน้นประเด็นสำคัญ 2-3 ประเด็น
- ในส่วน "แนวทางที่ควรทำ" ให้แผนระยะยาว (1-6 เดือน) แบ่งเป็นขั้นตอน`;

    default:
      return '';
  }
}

/**
 * Format user data (cards and question) for the prompt
 */
function formatTarotUserData(params: TarotPromptParams): string {
  const { cards, count, question } = params;

  const questionText = question?.trim() || '(ไม่ได้ระบุคำถาม)';
  
  const cardsList = cards
    .map((drawn, index) => {
      const orientation = drawn.orientation === 'upright' ? 'ตั้งตรง' : 'กลับหัว';
      const meaning = cardMeaning(drawn);
      return `${index + 1}. ${drawn.card.name} (${orientation}) => ${meaning}`;
    })
    .join('\n');

  return `## ข้อมูลการอ่านไพ่

คำถามผู้ใช้: ${questionText}
จำนวนไพ่: ${count}
ไพ่ที่เปิดได้:
${cardsList}`;
}
