export type ReadingVertical = "tarot" | "spirit-card" | "numerology";

export type ReadingBlockType =
  | "summary"
  | "insight"
  | "focus"
  | "action"
  | "warning"
  | "cta";

export interface InterpretationBlock {
  id: string;
  type: ReadingBlockType;
  title: string;
  body: string;
  emphasis?: "neutral" | "positive" | "caution";
  meta?: string;
}

export interface ReadingSession {
  sessionId: string;
  vertical: ReadingVertical;
  headline: string;
  summary: string;
  blocks: InterpretationBlock[];
  tags: string[];
}

export interface TarotReadingInput {
  kind: "tarot";
  cardsToken: string;
  count: number;
  question?: string;
}

export interface SpiritCardReadingInput {
  kind: "spirit-card";
  dob: string;
}

export interface NumerologyReadingInput {
  kind: "numerology";
  phone: string;
}

export type ReadingInput = TarotReadingInput | SpiritCardReadingInput | NumerologyReadingInput;
