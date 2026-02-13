import type { LibraryStateV1, SavedReading, SavedTarotReading } from "./types";

const KEY = "reffortune.library.v1";

function emptyState(): LibraryStateV1 {
  return { version: 1, items: [] };
}

function safeParse(json: string | null): unknown {
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function loadLibrary(): LibraryStateV1 {
  if (typeof window === "undefined") return emptyState();
  const raw = safeParse(window.localStorage.getItem(KEY));
  if (!raw || typeof raw !== "object") return emptyState();
  const obj = raw as Partial<LibraryStateV1>;
  if (obj.version !== 1 || !Array.isArray(obj.items)) return emptyState();
  return { version: 1, items: obj.items as SavedReading[] };
}

export function saveLibrary(state: LibraryStateV1): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function upsertReading(reading: SavedReading): LibraryStateV1 {
  const state = loadLibrary();
  const idx = state.items.findIndex((r) => r.id === reading.id);
  const items = idx >= 0
    ? state.items.map((r, i) => (i === idx ? reading : r))
    : [reading, ...state.items];
  const next: LibraryStateV1 = { version: 1, items };
  saveLibrary(next);
  return next;
}

export function removeReading(id: string): LibraryStateV1 {
  const state = loadLibrary();
  const next: LibraryStateV1 = { version: 1, items: state.items.filter((r) => r.id !== id) };
  saveLibrary(next);
  return next;
}

export function clearLibrary(): LibraryStateV1 {
  const next = emptyState();
  saveLibrary(next);
  return next;
}

export function buildSavedTarotReading(params: {
  id: string;
  count: number;
  cardsToken: string;
  question?: string;
  aiSummary?: string;
  aiCardStructure?: string;
}): SavedTarotReading {
  return {
    id: params.id,
    kind: "tarot",
    createdAt: new Date().toISOString(),
    count: params.count,
    cardsToken: params.cardsToken,
    question: params.question,
    aiSummary: params.aiSummary,
    aiCardStructure: params.aiCardStructure,
    version: 1,
  };
}
