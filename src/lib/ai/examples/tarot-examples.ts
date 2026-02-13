import { FewShotExample } from "../types";

/**
 * Few-shot examples for Tarot readings
 * 
 * These examples demonstrate expert-level interpretations that:
 * - Use natural, conversational Thai language
 * - Provide specific, actionable guidance
 * - Explain card relationships and combined meanings
 * - Include concrete timeframes and steps
 * - Balance honesty with compassion
 * - Avoid absolute predictions while maintaining confidence
 */

/**
 * Example 1: 3-card spread - Positive scenario
 * Demonstrates: Clear narrative flow, actionable timeline, optimistic but grounded tone
 */
export const TAROT_3_CARD_POSITIVE: FewShotExample = {
  scenario: "3-card career decision - positive outcome",
  input: `คำถามผู้ใช้: ควรเปลี่ยนงานหรือไม่
จำนวนไพ่: 3
ไพ่ที่เปิดได้:
1. The Sun (ตั้งตรง) => ความสำเร็จ ความสุข พลังงานบวก ความชัดเจน
2. Two of Pentacles (ตั้งตรง) => การจัดการหลายเรื่อง ความยืดหยุ่น การชั่งน้ำหนัก
3. Ace of Wands (ตั้งตรง) => จุดเริ่มต้นใหม่ แรงบันดาลใจ โอกาสใหม่`,
  output: `{
  "summary": "ไพ่บอกว่าคุณมีพื้นฐานที่ดีจากความสำเร็จในอดีต ตอนนี้กำลังชั่งน้ำหนักทางเลือก และอนาคตเปิดโอกาสให้เริ่มต้นใหม่ด้วยพลังงานสดใส การเปลี่ยนงานในช่วงนี้มีโอกาสนำมาซึ่งความก้าวหน้าที่คุณรอคอย",
  "cardStructure": "ภาพรวมสถานการณ์: คุณมีประสบการณ์และความสำเร็จที่สั่งสมมา (The Sun) ทำให้มั่นใจในตัวเองพอที่จะพิจารณาทางเลือกใหม่ ขณะนี้กำลังชั่งน้ำหนักระหว่างความมั่นคงเดิมกับโอกาสใหม่ (Two of Pentacles) และพลังงานของ Ace of Wands บอกว่ามีโครงการหรือบทบาทใหม่ที่จะจุดประกายความกระตือรือร้นให้คุณ\\n\\nจุดที่ควรระวัง: อย่าตัดสินใจเพียงเพราะเบื่องานเดิม ต้องแน่ใจว่างานใหม่ตอบโจทย์ทั้งด้านการเงินและการเติบโต อย่าลืมว่า Two of Pentacles เตือนให้จัดการหลายเรื่องพร้อมกัน ดังนั้นช่วงเปลี่ยนผ่านอาจต้องใช้พลังงานมาก\\n\\nแนวทางที่ควรทำ: (1) ภายใน 1-2 สัปดาห์: รวบรวมข้อมูลงานใหม่ให้ครบ เช็กเงื่อนไข สวัสดิการ โอกาสเติบโต (2) สัปดาห์ที่ 3-4: คุยกับคนในวงการหรือคนที่ทำงานที่นั่นแล้ว (3) ตัดสินใจภายในเดือนนี้ เพราะ Ace of Wands บอกว่าโอกาสนี้มีกรอบเวลา ยิ่งรอนานยิ่งพลาดจังหวะ"
}`,
  notes: "Shows positive reading with clear past-present-future narrative and actionable timeline"
};

/**
 * Example 2: 3-card spread - Challenging scenario
 * Demonstrates: Honest assessment, constructive guidance, compassionate tone
 */
export const TAROT_3_CARD_CHALLENGING: FewShotExample = {
  scenario: "3-card relationship question - challenging situation",
  input: `คำถามผู้ใช้: ความสัมพันธ์จะไปต่อได้ไหม
จำนวนไพ่: 3
ไพ่ที่เปิดได้:
1. Five of Cups (ตั้งตรง) => ความผิดหวัง การสูญเสีย ความเสียใจ
2. The Tower (ตั้งตรง) => การพังทลาย การเปลี่ยนแปลงกะทันหัน ความจริงที่เจ็บปวด
3. Six of Swords (ตั้งตรง) => การเดินทางออกจากความยากลำบาก การเปลี่ยนผ่าน`,
  output: `{
  "summary": "ไพ่สะท้อนว่าความสัมพันธ์นี้ผ่านความผิดหวังมาแล้ว และตอนนี้กำลังเผชิญจุดเปลี่ยนครั้งใหญ่ที่บังคับให้เห็นความจริง แม้ Six of Swords บอกว่าจะผ่านพ้นไปได้ แต่การ 'ผ่านพ้น' อาจหมายถึงการปล่อยวางและเดินหน้าต่อในทางของตัวเอง",
  "cardStructure": "ภาพรวมสถานการณ์: ความสัมพันธ์นี้มีรอยแตกมาตั้งแต่อดีต (Five of Cups) จากเหตุการณ์ที่ทำให้ผิดหวังหรือรู้สึกสูญเสียบางอย่าง ปัจจุบัน The Tower บอกว่าสิ่งที่สร้างมาอาจกำลังพังทลาย ไม่ใช่เพราะใครผิดใครถูก แต่เพราะรากฐานไม่แข็งแรงพอ Six of Swords ในอนาคตหมายถึงการเคลื่อนไปสู่ที่ที่สงบกว่า แต่ต้องยอมรับว่าบางอย่างต้องทิ้งไว้ข้างหลัง\\n\\nจุดที่ควรระวัง: อย่าพยายามซ่อมแซมสิ่งที่พังจนไม่เหลือรูปร่าง The Tower บอกว่าบางครั้งการพังทลายคือการเริ่มต้นใหม่ที่จำเป็น อย่าหลอกตัวเองว่าทุกอย่างจะกลับมาเหมือนเดิม เพราะ Six of Swords บอกว่าทางออกคือการเดินหน้า ไม่ใช่ย้อนกลับ\\n\\nแนวทางที่ควรทำ: (1) สัปดาห์นี้: ให้เวลาตัวเองคิดอย่างสงบ ไม่ต้องรีบตัดสินใจทันที (2) สัปดาห์หน้า: คุยกันตรงๆ ว่าทั้งคู่ยังต้องการอะไรจากความสัมพันธ์นี้ (3) ภายใน 2-3 สัปดาห์: ถ้าคำตอบไม่ตรงกัน ให้กล้าปล่อยวางด้วยความเคารพซึ่งกันและกัน Six of Swords บอกว่าการเดินออกจากสถานการณ์ที่เป็นพิษคือการดูแลตัวเอง"
}`,
  notes: "Shows challenging reading with honest assessment and constructive guidance without being harsh"
};

/**
 * Example 3: 1-card spread - Neutral/balanced scenario
 * Demonstrates: Concise interpretation, balanced perspective, practical advice
 */
export const TAROT_1_CARD_NEUTRAL: FewShotExample = {
  scenario: "1-card daily guidance - neutral situation",
  input: `คำถามผู้ใช้: วันนี้ควรระวังอะไร
จำนวนไพ่: 1
ไพ่ที่เปิดได้:
1. The Hermit (ตั้งตรง) => การใคร่ครวญ ความเงียบ การค้นหาภายใน ปัญญา`,
  output: `{
  "summary": "วันนี้ The Hermit บอกว่าคุณต้องการเวลาอยู่กับตัวเอง ไม่ใช่เพราะหนีปัญหา แต่เพราะต้องการความชัดเจนจากภายใน บางคำตอบไม่ได้อยู่ข้างนอก แต่อยู่ในความเงียบของคุณเอง",
  "cardStructure": "ภาพรวมสถานการณ์: วันนี้พลังงานของ The Hermit เชื้อเชิญให้คุณชะลอความเร่งรีบและหันเข้าหาตัวเอง อาจมีคำถามหรือสถานการณ์ที่ต้องการความคิดเชิงลึก ไม่ใช่แค่ตอบสนองตามอารมณ์หรือความคาดหวังของคนอื่น นี่คือช่วงเวลาที่ดีสำหรับการทบทวน วางแผน หรือศึกษาหาความรู้\\n\\nจุดที่ควรระวัง: อย่าแยกตัวจนเกินไปหรือปิดกั้นคนที่ห่วงใยคุณ The Hermit ต้องการความสงบ ไม่ใช่ความโดดเดี่ยว ระวังอย่าคิดมากจนเป็นกังวล บางครั้งการคิดมากเกินไปก็ทำให้เห็นภาพไม่ชัด\\n\\nแนวทางที่ควรทำ: ให้เวลาตัวเอง 30-60 นาทีในวันนี้เพื่อนั่งคิดอย่างสงบ อาจเป็นการเดินเล่น เขียนไดอารี่ หรือนั่งสมาธิ ถ้ามีเรื่องต้องตัดสินใจ อย่ารีบ ให้เวลาตัวเองคิดจนกระจ่างก่อน และจำไว้ว่าความเงียบไม่ใช่ความอ่อนแอ แต่เป็นพื้นที่ให้ปัญญาเติบโต"
}`,
  notes: "Shows 1-card reading with balanced perspective and practical daily guidance"
};

/**
 * Example 4: 10-card Celtic Cross - Complex scenario
 * Demonstrates: Comprehensive analysis, pattern recognition across positions, integrated guidance
 */
export const TAROT_10_CARD_COMPLEX: FewShotExample = {
  scenario: "10-card Celtic Cross - career transition with multiple factors",
  input: `คำถามผู้ใช้: ควรเปิดธุรกิจส่วนตัวหรือไม่
จำนวนไพ่: 10
ไพ่ที่เปิดได้:
1. Three of Pentacles (ตั้งตรง) => ความร่วมมือ ทักษะ การทำงานเป็นทีม
2. Five of Wands (ตั้งตรง) => การแข่งขัน ความขัดแย้ง ความท้าทาย
3. The Magician (ตั้งตรง) => ทักษะ ความสามารถ การสร้างสรรค์
4. Four of Pentacles (กลับหัว) => ปล่อยวาง ความยืดหยุ่น ไม่ยึดติด
5. Eight of Pentacles (ตั้งตรง) => การฝึกฝน ความเชี่ยวชาญ การพัฒนา
6. Two of Cups (ตั้งตรง) => ความร่วมมือ พันธมิตร ความสัมพันธ์ที่ดี
7. King of Pentacles (ตั้งตรง) => ความมั่นคง ความสำเร็จ การจัดการที่ดี
8. Seven of Swords (กลับหัว) => ความซื่อสัตย์ ความโปร่งใส
9. The Star (ตั้งตรง) => ความหวัง แรงบันดาลใจ วิสัยทัศน์
10. Ten of Pentacles (ตั้งตรง) => ความมั่งคั่ง มรดก ความสำเร็จระยะยาว`,
  output: `{
  "summary": "ไพ่บอกว่าคุณมีทักษะและความพร้อมในการเปิดธุรกิจ (The Magician, Eight of Pentacles) แต่จะต้องเผชิญการแข่งขันและความท้าทาย (Five of Wands) กุญแจสำคัญคือการหาพันธมิตรที่ใช่ (Two of Cups) และการปล่อยวางความกลัวเรื่องเงิน (Four of Pentacles กลับหัว) ผลลัพธ์ระยะยาวมีโอกาสสูงที่จะประสบความสำเร็จและสร้างมูลค่าที่ยั่งยืน (Ten of Pentacles)",
  "cardStructure": "ภาพรวมสถานการณ์: คุณอยู่ในจุดที่มีทักษะและประสบการณ์จากการทำงานเป็นทีม (Three of Pentacles) และมีความสามารถที่จะสร้างสรรค์สิ่งใหม่ (The Magician) แต่กำลังเผชิญความกังวลเรื่องการแข่งขันในตลาด (Five of Wands) อดีตของคุณแสดงให้เห็นการพัฒนาทักษะอย่างต่อเนื่อง (Eight of Pentacles) และตอนนี้กำลังปล่อยวางความยึดติดกับความมั่นคงเดิม (Four of Pentacles กลับหัว) อนาคตใกล้บอกว่าคุณจะพบพันธมิตรหรือลูกค้าที่ใช่ (Two of Cups) และมีโอกาสเติบโตเป็นผู้นำที่มั่นคง (King of Pentacles) ความหวังและวิสัยทัศน์ของคุณชัดเจน (The Star) และผลลัพธ์สุดท้ายชี้ไปที่ความสำเร็จระยะยาวที่สร้างมูลค่าจริง (Ten of Pentacles)\\n\\nจุดที่ควรระวัง: Five of Wands เตือนว่าตลาดมีการแข่งขันสูง ต้องเตรียมพร้อมรับมือกับคู่แข่งและความท้าทาย Seven of Swords กลับหัวบอกว่าต้องโปร่งใสและซื่อสัตย์ในการทำธุรกิจ อย่าใช้กลยุทธ์ที่ไม่สุจริต อย่าคาดหวังว่าจะสำเร็จในชั่วข้ามคืน Eight of Pentacles บอกว่าต้องใช้เวลาฝึกฝนและพัฒนาอย่างต่อเนื่อง\\n\\nแนวทางที่ควรทำ: (1) เดือนแรก: วางแผนธุรกิจให้ละเอียด ศึกษาตลาดและคู่แข่ง ใช้ทักษะที่มี (The Magician) วิเคราะห์จุดแข็งจุดอ่อน (2) เดือนที่ 2-3: หาพันธมิตรหรือที่ปรึกษาที่เชื่อถือได้ (Two of Cups) อย่าทำคนเดียว (3) เดือนที่ 4-6: เริ่มต้นแบบค่อยเป็นค่อยไป ทดสอบตลาดก่อน อย่ากลัวที่จะปรับเปลี่ยน (Four of Pentacles กลับหัว) (4) ปีแรก: โฟกัสที่การสร้างฐานลูกค้าที่มั่นคงและพัฒนาคุณภาพอย่างต่อเนื่อง (Eight of Pentacles) มองเป้าหมายระยะยาว 3-5 ปี (Ten of Pentacles) ไม่ใช่แค่กำไรระยะสั้น"
}`,
  notes: "Shows 10-card Celtic Cross with comprehensive analysis, pattern recognition, and phased action plan"
};

/**
 * All tarot examples grouped by spread type
 */
export const TAROT_EXAMPLES_BY_SPREAD = {
  single: [TAROT_1_CARD_NEUTRAL],
  three: [TAROT_3_CARD_POSITIVE, TAROT_3_CARD_CHALLENGING],
  celtic: [TAROT_10_CARD_COMPLEX]
};

/**
 * All tarot examples in a flat array
 */
export const TAROT_EXAMPLES: FewShotExample[] = [
  TAROT_1_CARD_NEUTRAL,
  TAROT_3_CARD_POSITIVE,
  TAROT_3_CARD_CHALLENGING,
  TAROT_10_CARD_COMPLEX
];
