/**
 * Tarot Prompt Template Builder
 * 
 * This module provides specialized prompt building for tarot readings with:
 * - Spread-specific logic (1, 3, 10-card spreads)
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
function selectExamplesForSpread(spreadType: 1 | 2 | 3 | 4 | 10) {
  switch (spreadType) {
    case 1:
      return TAROT_EXAMPLES_BY_SPREAD.single;
    case 2:
    case 3:
    case 4:
      return TAROT_EXAMPLES_BY_SPREAD.three;
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

  // Base instructions for all tarot readings
  const baseInstructions = `## คำแนะนำการตีความไพ่

### โครงสร้างการตอบ
ตอบเป็น JSON เท่านั้น โดยมีคีย์ 2 ตัว:
- summary: (ย่อหน้าเดียว) สรุปภาพรวมคำทำนายแบบกระชับ เข้าใจง่าย
- cardStructure: (จัดเป็น 3 ส่วน) ต้องมีหัวข้อชัดเจน:
  * ภาพรวมสถานการณ์: อธิบายสถานการณ์ปัจจุบันและบริบท
  * จุดที่ควรระวัง: ระบุความเสี่ยงหรืออุปสรรคที่เฉพาะเจาะจง พร้อมตัวอย่างที่เป็นรูปธรรม
  * แนวทางที่ควรทำ: ให้ขั้นตอนปฏิบัติที่ชัดเจน มีกรอบเวลา (เช่น "ภายใน 1-2 สัปดาห์", "เดือนนี้")

### หลักการตีความ

**1. ความเฉพาะเจาะจง**
- ให้คำแนะนำที่เฉพาะเจาะจง ไม่ใช่คำพูดทั่วไปที่ใช้ได้กับทุกคน
- ระบุสถานการณ์ที่เป็นรูปธรรม เช่น "การประชุมสำคัญ" แทน "เหตุการณ์สำคัญ"
- ให้ตัวอย่างที่ชัดเจนในแต่ละส่วน

**2. ความสัมพันธ์ระหว่างไพ่**
- อธิบายว่าไพ่แต่ละใบเชื่อมโยงกันอย่างไร
- ชี้ให้เห็นรูปแบบหรือธีมที่ซ้ำกัน (เช่น ไพ่หลายใบเกี่ยวกับการเงิน)
- วิเคราะห์ความหมายรวมที่เกิดจากการผสมผสานของไพ่`;

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
function buildSpreadSpecificInstructions(spreadType: 1 | 2 | 3 | 4 | 10, cards: TarotPromptParams['cards']): string {
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
      return `### คำแนะนำเฉพาะสำหรับไพ่ 4 ใบ (Action Plan)
- **ไพ่ใบที่ 1 (สถานการณ์)**: อธิบายสถานการณ์ปัจจุบันที่ผู้ถามกำลังเผชิญ
- **ไพ่ใบที่ 2 (อุปสรรค)**: ระบุอุปสรรค ความท้าทาย หรือสิ่งที่ขัดขวางความสำเร็จ
- **ไพ่ใบที่ 3 (คำแนะนำ)**: ให้คำแนะนำที่ชัดเจนว่าควรทำอย่างไร ขั้นตอนปฏิบัติ
- **ไพ่ใบที่ 4 (ผลลัพธ์)**: บอกผลลัพธ์ที่เป็นไปได้หากทำตามคำแนะนำ
- วิเคราะห์ความเชื่อมโยงระหว่าง 4 ตำแหน่ง เป็นแผนปฏิบัติการที่ชัดเจน
- ให้กรอบเวลาที่เฉพาะเจาะจงในส่วนคำแนะนำ`;

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
