"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export default function EsiimsiClient() {
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [interpretation, setInterpretation] = useState<any>(null);

  const startShake = () => {
    if (isShaking) return;
    setIsShaking(true);
    setResult(null);
    setShowResult(false);
    setInterpretation(null);

    // Vibration API
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200, 50, 150]);
    }

    // Sequence of animations
    setTimeout(() => {
      const num = Math.floor(Math.random() * 28) + 1;
      setResult(num);
      setIsShaking(false);
      setShowResult(true);
    }, 2800);
  };

  const fetchInterpretation = async () => {
    if (!result || isReading) return;
    setIsReading(true);

    try {
      const res = await fetch("/api/ai/tarot", { // Reusing tarot engine with Esiimsi context
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cardsToken: `esiimsi_${result}.upright`, 
          count: 1, 
          question: `ทำนายเซียมซีหมายเลข ${result}` 
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setInterpretation(data.ai);
      }
    } catch (err) {
      console.error("Failed to fetch interpretation:", err);
    } finally {
      setIsReading(false);
    }
  };

  return (
    <main className="fixed inset-0 bg-[#0a0a0a] text-white overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-black" />

      <div className="absolute top-0 left-0 right-0 p-4 flex items-center z-50">
        <Link href="/explore" className="p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="flex-1 text-center font-bold tracking-[0.3em] text-yellow-500 text-sm uppercase">Esiimsi Oracle</h1>
      </div>

      <div className="relative flex flex-col items-center justify-center w-full max-w-md">
        
        {/* Shaking Container with Perspective */}
        <div className={cn(
          "relative transition-all duration-100",
          isShaking && "animate-physical-shake"
        )} style={{ perspective: '1000px' }}>
          
          {/* Rattle Sticks (Behind) */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-24 h-40 flex justify-center items-end overflow-visible">
             {[...Array(12)].map((_, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "absolute w-2 bg-[#8b4513] rounded-t-full border-t-2 border-orange-400/30",
                        isShaking ? "animate-rattle" : "h-32"
                    )}
                    style={{ 
                        left: `${(i * 8)}%`,
                        transform: `rotate(${(i - 6) * 5}deg)`,
                        transformOrigin: 'bottom center',
                        animationDelay: `${i * 40}ms`,
                        boxShadow: '0 -2px 10px rgba(0,0,0,0.5)'
                    }}
                />
            ))}
          </div>

          {/* Cylinder (Premium Design) */}
          <div className="relative w-40 h-64 z-20">
             {/* Body */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#7f1d1d] via-[#b91c1c] to-[#450a0a] rounded-b-[50px] border-x-[3px] border-b-[6px] border-[#fbbf24]/30 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Visual Ornaments */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="text-[#fbbf24] font-serif text-6xl font-bold opacity-90 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">福</div>
                    <div className="mt-2 text-[8px] tracking-[0.4em] text-yellow-500/40 uppercase font-black">Ref Fortune</div>
                </div>
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </div>
            {/* Top Rim */}
            <div className="absolute -top-1 left-0 right-0 h-4 bg-[#450a0a] rounded-full border-2 border-[#fbbf24]/20 shadow-inner" />
          </div>

          {/* Winning Stick (The Pop-Out) */}
          {showResult && (
            <div className="absolute -top-56 left-1/2 -translate-x-1/2 z-30 animate-stick-emergence">
                 <div className="w-5 h-64 bg-gradient-to-b from-[#fbbf24] via-[#f59e0b] to-[#d97706] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col items-center py-8 border-2 border-white/20 relative">
                    <div className="absolute top-4 w-full text-center">
                         <span className="text-[#450a0a] font-black text-3xl drop-shadow-sm">{result}</span>
                    </div>
                    <div className="mt-12 flex-1 w-[1px] bg-[#450a0a]/20" />
                    <div className="absolute bottom-4 rotate-90 whitespace-nowrap">
                        <span className="text-[10px] text-[#450a0a] font-bold tracking-[0.2em] uppercase opacity-60">Lucky Stick</span>
                    </div>
                 </div>
            </div>
          )}
        </div>

        {/* Dynamic UI Content */}
        <div className="mt-20 w-full text-center z-40">
          {!showResult ? (
              <div className="space-y-12">
                  <div className="space-y-2">
                    <p className="text-xl font-serif text-yellow-500/90 italic">
                        {isShaking ? "โชคชะตากำลังเคลื่อนไหว..." : "ตั้งจิตอธิษฐาน"}
                    </p>
                    <p className="text-xs text-white/40 tracking-widest uppercase">ถอดรหัสความลับผ่านติ้วเซียมซี</p>
                  </div>
                  
                  <button 
                    disabled={isShaking}
                    onClick={startShake}
                    className={cn(
                        "group relative w-32 h-32 mx-auto rounded-full transition-all duration-500 outline-none",
                        isShaking ? "scale-95 opacity-50" : "hover:scale-110 active:scale-90"
                    )}
                  >
                    <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-10" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#991b1b] to-[#dc2626] border-4 border-yellow-500/50 shadow-[0_0_40px_rgba(220,38,38,0.4)] flex items-center justify-center">
                        <span className="text-xl font-black tracking-widest text-white uppercase drop-shadow-md">
                            {isShaking ? "..." : "เขย่า"}
                        </span>
                    </div>
                  </button>
              </div>
          ) : (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 w-full">
                  {!interpretation ? (
                    <>
                      <p className="text-sm text-yellow-500 uppercase tracking-[0.5em] mb-4 font-bold">หมายเลขมงคล</p>
                      <h2 className="text-9xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-12">{result}</h2>
                      
                      <Button 
                        size="lg" 
                        onClick={fetchInterpretation}
                        disabled={isReading}
                        className="w-full max-w-xs bg-yellow-500 hover:bg-yellow-400 text-black rounded-2xl h-16 text-xl font-black shadow-[0_15px_40px_rgba(234,179,8,0.3)] transition-all"
                      >
                        {isReading ? <Loader2 className="animate-spin" /> : "อ่านคำทำนาย"}
                      </Button>
                    </>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl text-left max-h-[60vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-yellow-500">ใบที่ {result}</h3>
                            <div className="h-px flex-1 bg-yellow-500/20 mx-4" />
                        </div>
                        <p className="text-lg leading-relaxed text-white/90 mb-6 font-medium whitespace-pre-line">
                            {interpretation.summary}
                        </p>
                        <div className="space-y-4 pt-4 border-t border-white/10">
                             {interpretation.opportunities?.map((o: string, i: number) => (
                                <div key={i} className="flex gap-3 text-sm text-white/70">
                                    <span className="text-yellow-500">✨</span> {o}
                                </div>
                             ))}
                        </div>
                        <Button 
                            variant="ghost" 
                            onClick={() => setShowResult(false)} 
                            className="mt-8 w-full text-white/30 hover:text-white"
                        >
                            เขย่าใหม่อีกครั้ง
                        </Button>
                    </div>
                  )}
              </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes physical-shake {
            0%, 100% { transform: rotate(0deg) translateY(0); }
            15% { transform: rotate(12deg) translateY(-10px) translateX(5px); }
            30% { transform: rotate(-12deg) translateY(10px) translateX(-5px); }
            45% { transform: rotate(15deg) translateY(-15px) translateX(8px); }
            60% { transform: rotate(-15deg) translateY(15px) translateX(-8px); }
            75% { transform: rotate(8deg) translateY(-5px); }
            90% { transform: rotate(-8deg) translateY(5px); }
        }
        .animate-physical-shake {
            animation: physical-shake 0.3s infinite ease-in-out;
        }

        @keyframes rattle {
            0%, 100% { transform: translateY(0) rotate(var(--rot)); }
            50% { transform: translateY(-25px) rotate(calc(var(--rot) + 2deg)); }
        }
        .animate-rattle {
            animation: rattle 0.15s infinite alternate ease-in-out;
        }

        @keyframes stick-emergence {
            0% { transform: translate(-50%, 150px) scaleY(0.5); opacity: 0; }
            40% { transform: translate(-50%, -40px) scaleY(1.1); opacity: 1; }
            70% { transform: translate(-50%, 10px) scaleY(0.95); opacity: 1; }
            100% { transform: translate(-50%, 0) scaleY(1); opacity: 1; }
        }
        .animate-stick-emergence {
            animation: stick-emergence 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.2); border-radius: 10px; }
      `}</style>
    </main>
  );
}
