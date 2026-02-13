export type SavedReadingKind = "tarot";

export interface SavedTarotReading {
  id: string; // uuid
  kind: "tarot";
  createdAt: string; // ISO

  count: number;
  cardsToken: string;
  question?: string;

  // Optional denormalized preview
  aiSummary?: string;
  aiCardStructure?: string;

  version: 1;
}

export type SavedReading = SavedTarotReading;

export interface LibraryStateV1 {
  version: 1;
  items: SavedReading[];
}
