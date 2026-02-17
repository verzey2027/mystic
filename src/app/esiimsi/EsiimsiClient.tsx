"use client";

import { useState, useEffect } from "react";
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

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }

    // After 2.5s of shaking, show result
    setTimeout(() => {
      const num = Math.floor(Math.random() * 28) + 1;
      setResult(num);
      setIsShaking(false);
      setShowResult(true);
    }, 2500);
  };

  const fetchInterpretation = async () => {
    if (!result || isReading) return;
    setIsReading(true);
    try {
      const res = await fetch("/api/ai/tarot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cardsToken: `esiimsi_${result}.upright`, 
          count: 1, 
          question: `ทำนายเซียมซีหมายเลข ${result}` 
        }),
      });
      const data = await res.json();
      if (data.ok) setInterpretation(data.ai);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReading(false);
    }
  };

  return (
    <main className="fixed inset-0 bg-[#0a0a0a] text-white overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center z-50">
        <Link href="/explore" className="p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="flex-1 text-center font-bold tracking-[0.3em] text-yellow-500 text-xs uppercase">Esiimsi Oracle</h1>
      </div>

      <div className="relative flex flex-col items-center justify-center w-full max-w-md h-full pt-12">
        
        {/* Shaker Perspective Container */}
        <div className={cn(
          "relative w-48 h-80 transition-all duration-300",
          isShaking ? "animate-physical-shake" : ""
        )} style={{ transformStyle: 'preserve-3d' }}>
          
          {/* STICKS: Now placed ABOVE/INSIDE the cylinder visually */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-full flex justify-center items-start pt-4 z-10">
             {[...Array(15)].map((_, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "w-2 bg-[#d4a373] rounded-full border-b border-black/20 shadow-sm transition-all duration-500",
                        isShaking ? "animate-rattle-inner h-48" : "h-40"
                    )}
                    style={{ 
                        transform: `rotate(${(i - 7) * 4}deg)`,
                        transformOrigin: 'bottom center',
                        marginLeft: '-4px',
                        animationDelay: `${i * 30}ms`
                    }}
                />
            ))}
          </div>

          {/* THE CYLINDER: Brought forward with z-20 */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 h-64 z-20">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7f1d1d] via-[#dc2626] to-[#7f1d1d] rounded-b-[40px] border-x-4 border-b-8 border-yellow-600/40 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="text-yellow-400 font-serif text-6xl font-bold opacity-80 select-none drop-shadow-glow">福</div>
                    <div className="mt-4 w-12 h-0.5 bg-yellow-500/30" />
                    <div className="mt-2 text-[10px] tracking-[0.3em] text-yellow-500/40 uppercase">Ref Fortune</div>
                </div>
                {/* Surface Polish */}
                <div className="absolute top-0 left-4 w-4 h-full bg-white/10 blur-sm -skew-x-12" />
            </div>
            {/* Top Rim shadow to make sticks look inside */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-black/40 rounded-full border-t border-white/10" />
          </div>

          {/* THE WINNING STICK: Elevated z-index and explicit animation */}
          {showResult && (
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 z-50 animate-stick-pop-v2">
                 <div className="w-5 h-64 bg-gradient-to-b from-yellow-300 via-yellow-500 to-amber-700 rounded-xl shadow-2xl flex flex-col items-center py-6 border-2 border-yellow-200 relative">
                    <div className="absolute top-4 w-full text-center">
                         <span className="text-red-950 font-black text-3xl drop-shadow-sm">{result}</span>
                    </div>
                    <div className="mt-12 flex-1 w-px bg-red-950/20" />
                    <div className="absolute bottom-4 uppercase font-bold text-[#450a0a] text-[8px] tracking-widest opacity-60">Lucky</div>
                 </div>
            </div>
          )}
        </div>

        {/* UI Controls */}
        <div className="mt-12 w-full text-center z-40 px-4 min-h-[250px]">
          {!showResult ? (
              <div className="space-y-10">
                  <div className="animate-pulse">
                    <p className="text-xl font-medium text-yellow-500/90 italic">
                        {isShaking ? "กำลังสื่อจิตถึงสิ่งศักดิ์สิทธิ์..." : "ตั้งจิตอธิษฐาน"}
                    </p>
                    <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase mt-1">Focus on your question</p>
                  </div>
                  
                  <button 
                    disabled={isShaking}
                    onClick={startShake}
                    className={cn(
                        "group relative w-32 h-32 mx-auto rounded-full transition-all duration-300 active:scale-90",
                        isShaking ? "opacity-40" : "hover:scale-105"
                    )}
                  >
                    <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-600 to-red-900 border-4 border-yellow-500/40 shadow-2xl flex items-center justify-center">
                        <span className="text-xl font-black text-white">เขย่า</span>
                    </div>
                  </button>
              </div>
          ) : (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                  {interpretation ? (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl text-left animate-in zoom-in duration-300">
                         <h3 className="text-xl font-bold text-yellow-500 mb-3 border-b border-white/10 pb-2">คำทำนายใบที่ {result}</h3>
                         <p className="text-base text-white/90 leading-relaxed mb-6 italic">{interpretation.summary}</p>
                         <Button onClick={() => setShowResult(false)} variant="ghost" className="w-full text-white/30 hover:text-white">เสี่ยงทายอีกครั้ง</Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                         <p className="text-sm text-yellow-500 uppercase tracking-widest mb-4">หมายเลขที่ออก</p>
                         <h2 className="text-8xl font-black text-white drop-shadow-glow mb-10">{result}</h2>
                         <Button 
                            onClick={fetchInterpretation}
                            disabled={isReading}
                            className="w-full max-w-xs bg-yellow-500 hover:bg-yellow-400 text-black rounded-2xl h-14 text-lg font-bold shadow-xl"
                         >
                            {isReading ? <Loader2 className="animate-spin" /> : "ดูคำทำนาย"}
                         </Button>
                    </div>
                  )}
              </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes physical-shake {
            0%, 100% { transform: translate(0,0) rotate(0); }
            10% { transform: translate(-10px, -15px) rotate(-10deg); }
            30% { transform: translate(15px, 20px) rotate(15deg); }
            50% { transform: translate(-20px, -10px) rotate(-12deg); }
            70% { transform: translate(10px, 15px) rotate(10deg); }
            90% { transform: translate(-5px, -5px) rotate(-5deg); }
        }
        .animate-physical-shake {
            animation: physical-shake 0.3s infinite ease-in-out;
        }

        @keyframes rattle-inner {
            0%, 100% { transform: translateY(0) rotate(var(--r)); }
            50% { transform: translateY(-40px) rotate(calc(var(--r) + 5deg)); }
        }
        .animate-rattle-inner {
            animation: rattle-inner 0.15s infinite ease-in-out;
        }

        @keyframes stick-pop-v2 {
            0% { transform: translate(-50%, 150px); opacity: 0; }
            40% { transform: translate(-50%, -60px); opacity: 1; }
            70% { transform: translate(-50%, 10px); }
            100% { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-stick-pop-v2 {
            animation: stick-pop-v2 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .drop-shadow-glow {
            filter: drop-shadow(0 0 15px rgba(234, 179, 8, 0.4));
        }
      `}</style>
    </main>
  );
}
