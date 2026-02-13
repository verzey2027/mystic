"use client";

import { useMemo, useState } from "react";
import type { LibraryStateV1, SavedReading } from "./types";
import { clearLibrary, loadLibrary, removeReading, upsertReading } from "./storage";

export function useLibrary() {
  const [state, setState] = useState<LibraryStateV1>(() => loadLibrary());

  const api = useMemo(() => {
    return {
      items: state.items,
      upsert: (reading: SavedReading) => setState(upsertReading(reading)),
      remove: (id: string) => setState(removeReading(id)),
      clear: () => setState(clearLibrary()),
    };
  }, [state.items]);

  return api;
}
