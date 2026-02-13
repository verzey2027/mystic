import { getCardById, TAROT_DECK } from "./deck";
import { DrawnCard, Orientation, TarotCard } from "./types";

const spreadLabels: Record<number, string[]> = {
  1: ["คำแนะนำหลัก"],
  3: ["อดีต", "ปัจจุบัน", "อนาคต"],
  10: [
    "สถานการณ์ปัจจุบัน",
    "ความท้าทาย",
    "รากของปัญหา",
    "อดีตที่ผ่านมา",
    "สิ่งที่มุ่งหวัง",
    "อนาคตใกล้",
    "ตัวคุณ",
    "สิ่งแวดล้อม",
    "ความหวัง/ความกลัว",
    "ผลลัพธ์โดยรวม",
  ],
};

export function shuffleCards(cards: TarotCard[]): TarotCard[] {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function randomOrientation(): Orientation {
  return Math.random() > 0.28 ? "upright" : "reversed";
}

export function drawCards(count: number): DrawnCard[] {
  const shuffled = shuffleCards(TAROT_DECK).slice(0, count);
  return shuffled.map((card) => ({
    card,
    orientation: randomOrientation(),
  }));
}

export function toCardToken(input: DrawnCard): string {
  return `${input.card.id}.${input.orientation}`;
}

export function parseCardToken(token: string): DrawnCard | null {
  const [id, maybeOrientation] = token.split(".");
  const card = getCardById(id);

  if (!card) {
    return null;
  }

  const orientation: Orientation =
    maybeOrientation === "reversed" ? "reversed" : "upright";

  return {
    card,
    orientation,
  };
}

export function parseCardTokens(tokens: string): DrawnCard[] {
  return tokens
    .split(",")
    .map((token) => parseCardToken(token.trim()))
    .filter((card): card is DrawnCard => card !== null);
}

export function cardMeaning(card: DrawnCard): string {
  return card.orientation === "upright"
    ? card.card.meaningUpright
    : card.card.meaningReversed;
}

export function summarizeReading(input: {
  cards: DrawnCard[];
  count: number;
  question?: string;
}) {
  const labels = spreadLabels[input.count] ?? input.cards.map((_, i) => `ตำแหน่ง ${i + 1}`);
  const sections = input.cards.map((drawn, index) => {
    const label = labels[index] ?? `ตำแหน่ง ${index + 1}`;
    const orientationLabel = drawn.orientation === "upright" ? "ตั้งตรง" : "กลับหัว";

    return {
      position: index + 1,
      label,
      title: `${label} — ${drawn.card.name} (${orientationLabel})`,
      description: cardMeaning(drawn),
      focus:
        drawn.orientation === "upright"
          ? `โฟกัส: ${drawn.card.keywordsUpright.slice(0, 3).join(" • ")}`
          : `ระวัง: ${drawn.card.keywordsReversed.slice(0, 3).join(" • ")}`,
    };
  });

  const ending =
    input.count === 1
      ? "โฟกัสสิ่งเดียวที่สำคัญที่สุดภายใน 24 ชั่วโมงข้างหน้า แล้วลงมือทันที"
      : input.count === 3
        ? "ใช้บทเรียนจากอดีตตัดสินใจในปัจจุบัน แล้วล็อก action สำหรับอนาคตให้ชัด"
        : "จัดแผน 3 ขั้น: สิ่งที่ต้องหยุด • สิ่งที่ต้องเริ่ม • สิ่งที่ต้องรักษาไว้";

  const summary = input.question?.trim()
    ? `คำถาม: “${input.question.trim()}”\nภาพรวมพลังงานบอกว่าให้เดินเกมอย่างมีสติและมีโครงสร้าง ${ending}`
    : `ภาพรวมพลังงานบอกว่าให้เดินเกมอย่างมีสติและมีโครงสร้าง ${ending}`;

  return { summary, sections };
}
