"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export default function EsiimsiClient() {
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [sticksOut, setSticksOut] = useState(false);

  const startShake = () => {
    if (isShaking) return;
    setIsShaking(true);
    setResult(null);
    setShowResult(false);
    setSticksOut(false);

    // Vibration API for mobile
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }

    // Simulate shaking phases
    setTimeout(() => {
        setSticksOut(true);
    }, 1500);

    setTimeout(() => {
      const num = Math.floor(Math.random() * 28) + 1;
      setResult(num);
      setIsShaking(false);
      setShowResult(true);
    }, 3000);
  };

  return (
    <main className="fixed inset-0 bg-[#0f172a] text-white overflow-hidden flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

      <div className="absolute top-0 left-0 right-0 p-4 flex items-center z-50">
        <Link href="/explore" className="p-2 rounded-full bg-white/10 backdrop-blur-md">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="flex-1 text-center font-bold tracking-widest text-yellow-500 drop-shadow-sm">ESIIMSI • เซียมซี</h1>
      </div>

      <div className="relative flex flex-col items-center justify-center w-full max-w-sm">
        
        {/* Shaking Animation Layer */}
        <div className={cn(
          "relative transition-all duration-300",
          isShaking ? "animate-complex-shake" : "hover:rotate-1"
        )}>
          
          {/* Sticks Container (Behind Cylinder) */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-40 flex justify-center items-end">
             {[...Array(15)].map((_, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "absolute w-2 bg-[#b45309] rounded-t-sm border-t-2 border-red-500/50 shadow-sm",
                        isShaking ? "animate-sticks-rattle" : "h-32"
                    )}
                    style={{ 
                        left: `${(i * 6)}%`,
                        transform: `rotate(${(i - 7) * 4}deg) translateY(${isShaking ? '-10px' : '0'})`,
                        transformOrigin: 'bottom center',
                        animationDelay: `${i * 30}ms`
                    }}
                />
            ))}
          </div>

          {/* Cylinder (The Body) */}
          <div className="relative w-44 h-72 z-20">
            <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-600 to-red-900 rounded-b-[40px] border-x-4 border-b-8 border-yellow-600/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
                <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="text-yellow-400 font-serif text-5xl font-bold opacity-80 select-none drop-shadow-glow">福</div>
                    <div className="mt-4 w-12 h-0.5 bg-yellow-500/30" />
                    <div className="mt-2 text-[10px] tracking-[0.3em] text-yellow-500/50 uppercase">Tradition</div>
                </div>
                {/* Highlights */}
                <div className="absolute top-0 left-4 w-2 h-full bg-white/10 blur-sm" />
            </div>
          </div>

          {/* The Result Stick (Popping out) */}
          {showResult && (
            <div className="absolute -top-48 left-1/2 -translate-x-1/2 z-30 animate-stick-pop">
                 <div className="w-4 h-56 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-lg shadow-2xl flex flex-col items-center py-6 border-2 border-yellow-600 relative">
                    <div className="absolute top-2 w-full text-center">
                         <span className="text-red-900 font-black text-2xl drop-shadow-sm">{result}</span>
                    </div>
                    <div className="mt-8 flex-1 w-px bg-red-900/20" />
                    <div className="w-full text-center pb-2 opacity-50">
                        <div className="text-[8px] text-red-900 font-bold uppercase rotate-90">Esiimsi</div>
                    </div>
                 </div>
            </div>
          )}
        </div>

        {/* Action UI */}
        <div className="mt-24 w-full text-center z-40 px-4">
          {!showResult ? (
              <div className="space-y-8">
                  <p className="text-lg font-medium text-white/70">
                      {isShaking ? "กำลังสื่อจิตถึงสิ่งศักดิ์สิทธิ์..." : "ตั้งจิตอธิษฐานแล้วเริ่มเขย่า"}
                  </p>
                  
                  <button 
                    disabled={isShaking}
                    onClick={startShake}
                    className={cn(
                        "group relative w-32 h-32 mx-auto rounded-full transition-all duration-500",
                        isShaking ? "scale-90" : "hover:scale-110"
                    )}
                  >
                    {/* Ring animation */}
                    <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-20" />
                    <div className="absolute inset-[-8px] rounded-full border border-yellow-500/30 rotate-45" />
                    
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-red-800 shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center justify-center overflow-hidden border-4 border-yellow-600/50">
                        <span className="text-xl font-bold tracking-tighter text-white drop-shadow-md">
                            {isShaking ? "..." : "เขย่าติ้ว"}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
              </div>
          ) : (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                  <p className="text-sm text-yellow-500 uppercase tracking-[0.4em] mb-4 font-bold">ผลเสี่ยงทายหมายเลข</p>
                  <h2 className="text-8xl font-black text-white drop-shadow-glow-large mb-10">{result}</h2>
                  
                  <div className="flex flex-col gap-3">
                    <Button size="lg" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white rounded-2xl h-16 text-xl font-bold shadow-[0_10px_30px_rgba(202,138,4,0.3)] border-b-4 border-yellow-800 active:border-b-0 active:translate-y-1 transition-all">
                        เปิดคำทำนาย
                    </Button>
                    <button 
                        onClick={() => setShowResult(false)} 
                        className="text-white/40 text-sm hover:text-white transition-colors py-2"
                    >
                        เสี่ยงทายใหม่
                    </button>
                  </div>
              </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes complex-shake {
            0% { transform: rotate(0deg) translate(0, 0); }
            10% { transform: rotate(8deg) translate(2px, -4px); }
            20% { transform: rotate(-8deg) translate(-2px, 4px); }
            30% { transform: rotate(12deg) translate(4px, -8px); }
            40% { transform: rotate(-12deg) translate(-4px, 8px); }
            50% { transform: rotate(10deg) translate(3px, -6px); }
            60% { transform: rotate(-10deg) translate(-3px, 6px); }
            70% { transform: rotate(6deg) translate(2px, -3px); }
            80% { transform: rotate(-6deg) translate(-2px, 3px); }
            90% { transform: rotate(3deg) translate(1px, -1px); }
            100% { transform: rotate(0deg) translate(0, 0); }
        }
        .animate-complex-shake {
            animation: complex-shake 0.4s infinite ease-in-out;
        }

        @keyframes sticks-rattle {
            0%, 100% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-15px) rotate(2deg); }
        }
        .animate-sticks-rattle {
            animation: sticks-rattle 0.15s infinite;
        }

        @keyframes stick-pop {
            0% { transform: translate(-50%, 100px) scale(0.5); opacity: 0; }
            60% { transform: translate(-50%, -20px) scale(1.1); opacity: 1; }
            100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
        .animate-stick-pop {
            animation: stick-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .drop-shadow-glow {
            filter: drop-shadow(0 0 8px rgba(234, 179, 8, 0.6));
        }
        .drop-shadow-glow-large {
            filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 40px rgba(234, 179, 8, 0.2));
        }
      `}</style>
    </main>
  );
}
