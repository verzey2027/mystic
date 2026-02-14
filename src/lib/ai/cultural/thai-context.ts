/**
 * Thai Cultural Context for AI Prompt Engineering
 * 
 * This module provides Thai astrology, Buddhist philosophy, and cultural wisdom
 * to enhance AI-generated divination interpretations with authentic Thai context.
 */

import type { DivinationType } from '@/lib/ai/types';

/**
 * Buddhist philosophy concepts for divination guidance
 */
export const THAI_BUDDHIST_PHILOSOPHY = `
คำแนะนำนี้สะท้อนหลักธรรมพุทธศาสนา:
- กฎแห่งกรรม: การกระทำในปัจจุบันสร้างผลในอนาคต ทุกการตัดสินใจมีผลที่ตามมา
- การทำบุญ: การสร้างคุณงามความดีนำมาซึ่งผลดี ทั้งในปัจจุบันและอนาคต
- สติและสมาธิ: การตระหนักรู้และมีสมาธิช่วยให้ตัดสินใจอย่างชาญฉลาด
- ทางสายกลาง: หลีกเลี่ยงความสุดโต่งทั้งสองด้าน รักษาสมดุลในชีวิต
- อนิจจัง: ทุกสิ่งเปลี่ยนแปลงได้ ไม่มีอะไรถาวร ดังนั้นต้องปรับตัวและยอมรับการเปลี่ยนแปลง
`;

/**
 * Thai astrology concepts and principles
 */
export const THAI_ASTROLOGY_CONCEPTS = `
โหราศาสตร์ไทยเชื่อว่า:
- ดวงชะตาเป็นแนวทาง ไม่ใช่คำตัดสิน: ดวงบอกแนวโน้มและโอกาส แต่การกระทำของเราเปลี่ยนแปลงผลลัพธ์ได้
- ฤกษ์ยามมีผลต่อความสำเร็จ: การเลือกเวลาที่เหมาะสมช่วยเพิ่มโอกาสความสำเร็จ
- ธาตุทั้งสี่ต้องสมดุล: ดิน น้ำ ลม ไฟ ต้องอยู่ในสมดุลเพื่อชีวิตที่ราบรื่น
- พลังงานจักรวาล: ดวงดาว ตัวเลข และสัญลักษณ์ล้วนมีพลังงานที่ส่งผลต่อชีวิต
- การเชื่อมโยงระหว่างจิตใจและโชคชะตา: จิตใจที่ดีดึงดูดสิ่งดีๆ มาสู่ชีวิต
`;

/**
 * Thai numerology beliefs and number meanings
 */
export const THAI_NUMEROLOGY_BELIEFS = `
ความเชื่อเรื่องตัวเลขในวัฒนธรรมไทย:
- เลข 9 เป็นเลขมงคลสูงสุด: หมายถึงความก้าวหน้า การเติบโต และการบรรลุเป้าหมาย
- เลข 8 หมายถึงความมั่งคั่ง: เป็นเลขแห่งโชคลาภและความอุดมสมบูรณ์
- เลข 6 หมายถึงความราบรื่น: ชีวิตที่สงบสุข ไม่มีอุปสรรค
- เลข 5 หมายถึงการเปลี่ยนแปลง: พลังงานแห่งการเคลื่อนไหวและโอกาสใหม่
- เลข 3 หมายถึงความคิดสร้างสรรค์: การสื่อสาร การแสดงออก
- เลข 1 หมายถึงการเริ่มต้น: ความเป็นผู้นำ ความมั่นใจ
- เลขรวมและเลขรากมีความหมาย: การรวมตัวเลขและลดเหลือหลักเดียวเผยให้เห็นพลังงานแท้จริง
- การจัดเรียงตัวเลขมีผล: ลำดับของตัวเลขสร้างพลังงานที่แตกต่างกัน
`;

/**
 * Thai guidance style and tone for fortune-telling
 */
export const THAI_GUIDANCE_STYLE = `
น้ำเสียงการให้คำแนะนำแบบไทย:
- อบอุ่น เป็นกันเอง ไม่ตัดสิน: ให้คำแนะนำด้วยความเมตตา ไม่ทำให้รู้สึกแย่
- ตรงไปตรงมาแต่ไม่ทำร้ายจิตใจ: บอกความจริงอย่างนุ่มนวล มีเหตุผล
- ให้กำลังใจและมองโอกาสในวิกฤต: แม้สถานการณ์ยาก ก็มองหาทางออกและบทเรียน
- เน้นสิ่งที่ทำได้ ไม่ใช่แค่ทำนาย: ให้แนวทางปฏิบัติที่ชัดเจน มีขั้นตอน
- ใช้ภาษาที่เข้าใจง่าย: หลีกเลี่ยงศัพท์เทคนิคที่ซับซ้อน ใช้คำที่คนทั่วไปเข้าใจ
- สร้างความหวังโดยไม่หลอกลวง: ให้ความหวังที่สมจริง ไม่สร้างความคาดหวังเกินจริง
- เคารพการตัดสินใจของผู้ฟัง: ให้ข้อมูลและแนวทาง แต่ไม่บังคับหรือขู่เข็ญ
`;

/**
 * Complete Thai cultural context combining all elements
 */
export const THAI_DIVINATION_CONTEXT = {
  philosophy: THAI_BUDDHIST_PHILOSOPHY,
  astrology: THAI_ASTROLOGY_CONCEPTS,
  numerology: THAI_NUMEROLOGY_BELIEFS,
  guidance: THAI_GUIDANCE_STYLE,
};

/**
 * Get appropriate cultural context based on divination type
 * 
 * @param type - The type of divination (tarot, spirit, numerology, chat)
 * @returns Formatted cultural context string appropriate for the divination type
 */
export function getContextForDivinationType(type: DivinationType): string {
  const baseContext = `${THAI_BUDDHIST_PHILOSOPHY}\n\n${THAI_GUIDANCE_STYLE}`;
  
  switch (type) {
    case 'tarot':
      // Tarot readings benefit from Buddhist philosophy and astrology concepts
      return `${baseContext}\n\n${THAI_ASTROLOGY_CONCEPTS}`;
    
    case 'spirit':
      // Spirit cards connect to life path, so include astrology and numerology
      return `${baseContext}\n\n${THAI_ASTROLOGY_CONCEPTS}\n\n${THAI_NUMEROLOGY_BELIEFS}`;
    
    case 'numerology':
      // Numerology focuses on number meanings and beliefs
      return `${baseContext}\n\n${THAI_NUMEROLOGY_BELIEFS}`;
    
    case 'chat':
      // Chat mode uses general context with emphasis on empathetic guidance
      return baseContext;
    
    default:
      // Fallback to base context
      return baseContext;
  }
}

/**
 * Get specific cultural element by key
 * 
 * @param key - The cultural element key (philosophy, astrology, numerology, guidance)
 * @returns The cultural context string for that element
 */
export function getCulturalElement(
  key: keyof typeof THAI_DIVINATION_CONTEXT
): string {
  return THAI_DIVINATION_CONTEXT[key];
}
