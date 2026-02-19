"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { TAROT_DECK } from "@/lib/tarot/deck";
import { shuffleCards } from "@/lib/tarot/engine";
import { trackEvent } from "@/lib/analytics/tracking";
import { ChevronLeft, RefreshCcw } from "lucide-react";

const allowedCounts = new Set([1, 2, 3, 4, 5, 6, 10]);

const CardBackImage = "/card/backcard.png"; // Use user-provided asset

export default function PickClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawCount = Number(searchParams.get("count") ?? "3");
  const count = allowedCounts.has(rawCount) ? rawCount : 3;
  
  const [shuffled, setShuffled] = useState<typeof TAROT_DECK>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [isShuffling, setIsShuffling] = useState(true);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });

  const canSelectMore = selected.length < count;

  // Initialize and Shuffle
  useEffect(() => {
    handleShuffle();
  }, []);

  const handleShuffle = () => {
    setIsShuffling(true);
    setSelected([]);
    // Simulate shuffle time
    setTimeout(() => {
        setShuffled(shuffleCards(TAROT_DECK));
        setIsShuffling(false);
    }, 800);
  };

  useEffect(() => {
    trackEvent("reading_start", { vertical: "tarot", step: "pick_view", count });
  }, [count]);

  // Calculate card size to fit screen
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Calculate card size to fit 13 cols x 6 rows exactly
    const updateSize = () => {
        const { clientWidth, clientHeight } = containerRef.current!;
        const cols = 13;
        const rows = 6;
        
        // Subtract gap size (e.g. 1px gap)
        const gap = 1; 
        const w = (clientWidth - (cols - 1) * gap) / cols;
        const h = (clientHeight - (rows - 1) * gap - 128) / rows; // -128 for bottom padding
        
        setCardSize({ width: w, height: h });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [containerRef.current]);

  const onToggleSelect = useCallback(
    (cardId: string) => {
      if (isShuffling) return;
      const pickedIndex = selected.findIndex((token) => token.startsWith(`${cardId}.`));
      
      if (pickedIndex >= 0) {
        // Deselect
        setSelected((prev) => prev.filter((_, i) => i !== pickedIndex));
      } else {
        // Select
        if (!canSelectMore) return;
        setSelected((prev) => [...prev, `${cardId}.upright`]);
      }
    },
    [canSelectMore, selected, isShuffling]
  );

  function submitReading() {
    if (selected.length !== count) return;
    trackEvent("reading_submitted", {
      vertical: "tarot",
      step: "pick_submit",
      count,
      hasQuestion: question.trim().length > 0,
    });
    const params = new URLSearchParams({ count: String(count), cards: selected.join(",") });
    if (question.trim()) params.set("question", question.trim());
    router.push(`/tarot/result?${params.toString()}`);
  }

  return (
    <main className="fixed inset-0 bg-[#1a1a1a] text-white overflow-hidden flex flex-col">
      {/* ── Top Bar (Minimal) ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/20 backdrop-blur-sm z-20">
        <Link href="/tarot" className="p-2 rounded-full hover:bg-white/10 transition">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        
        <div className="flex flex-col items-center">
            <h1 className="text-sm font-semibold tracking-wide">
                เลือกไพ่ {selected.length}/{count} ใบ
            </h1>
            <div className="flex gap-1 mt-1">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", i < selected.length ? "bg-accent scale-125" : "bg-white/20")} />
                ))}
            </div>
        </div>

        <button onClick={handleShuffle} disabled={isShuffling} className="p-2 rounded-full hover:bg-white/10 transition">
          <RefreshCcw className={cn("w-5 h-5", isShuffling && "animate-spin")} />
        </button>
      </div>

      {/* ── Grid Wall ── */}
      <div ref={containerRef} className="flex-1 relative w-full h-full pb-32 overflow-hidden bg-black">
        {isShuffling ? (
             <div className="absolute inset-0 flex items-center justify-center">
                 <div className="flex flex-col items-center gap-4">
                     <div className="relative w-24 h-40">
                         {[1, 2, 3].map((i) => (
                             <div key={i} className="absolute inset-0 border border-white/20 bg-[#2a2a2a] rounded-lg animate-pulse" 
                                  style={{ animationDelay: `${i * 150}ms`, transform: `rotate(${i * 5}deg)` }} 
                             />
                         ))}
                     </div>
                     <p className="text-xs font-medium tracking-widest uppercase text-white/50 animate-pulse">Shuffling...</p>
                 </div>
             </div>
        ) : (
            <div className="w-full h-full grid grid-cols-13 gap-px bg-white/5">
                {shuffled.map((card, idx) => {
                    const isSelected = selected.some(s => s.startsWith(card.id));
                    const isDimmed = !isSelected && !canSelectMore;

                    return (
                        <div 
                            key={card.id}
                            onClick={() => onToggleSelect(card.id)}
                            className={cn(
                                "relative cursor-pointer transition-all duration-300 w-full h-full overflow-hidden",
                                isSelected ? "z-20 brightness-125" : "hover:brightness-110",
                                isDimmed && "opacity-50 grayscale"
                            )}
                            style={{ 
                                animation: `fadeIn 0.3s ease-out ${idx * 0.005}s backwards`
                            }}
                        >
                            <div className={cn(
                                "w-full h-full relative",
                                isSelected ? "ring-2 ring-inset ring-accent" : ""
                            )}>
                                {/* Card Back Pattern */}
                                <div 
                                    className="w-full h-full bg-cover bg-center" 
                                    style={{ backgroundImage: `url(${CardBackImage})` }}
                                />
                                
                                {isSelected && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-accent/40 backdrop-blur-[1px]">
                                        <span className="text-[10px] md:text-sm font-bold text-white drop-shadow-md">
                                            {selected.findIndex(s => s.startsWith(card.id)) + 1}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      {/* ── Bottom Controls ── */}
      <div className="fixed bottom-24 left-0 right-0 p-4 z-50 flex justify-center pointer-events-none">
         {selected.length === count ? (
             <Button 
                onClick={submitReading} 
                className="w-full max-w-sm h-14 rounded-full text-lg shadow-[0_0_40px_rgba(139,92,246,0.5)] bg-accent hover:bg-accent-hover text-white animate-in slide-in-from-bottom-8 duration-300 pointer-events-auto border-2 border-white/20"
             >
                 ดูผลทำนาย
             </Button>
         ) : (
             <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white/80 text-sm pointer-events-auto shadow-lg animate-pulse">
                 เลือกอีก {count - selected.length} ใบ
             </div>
         )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </main>
  );
}
