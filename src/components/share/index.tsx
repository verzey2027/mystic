"use client";

import React from "react";
import type { ShareableData } from "./types";
import { TarotShareableCard } from "./tarot/TarotShareableCard";
import { SpiritShareableCard } from "./spirit/SpiritShareableCard";
import { NumerologyShareableCard } from "./numerology/NumerologyShareableCard";

interface UniversalShareableCardProps {
  data: ShareableData;
  onShare?: () => void;
  className?: string;
}

export function UniversalShareableCard({ data, onShare, className }: UniversalShareableCardProps) {
  switch (data.vertical) {
    case "tarot":
      return <TarotShareableCard data={data} onShare={onShare} className={className} />;
    case "spirit":
      return <SpiritShareableCard data={data} onShare={onShare} className={className} />;
    case "numerology":
      return <NumerologyShareableCard data={data} onShare={onShare} className={className} />;
    default:
      return null;
  }
}

// Re-export types
export * from "./types";
