"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export default function EsiimsiClient() {
  const [isShaking, setIsShaking] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const shakeAudioRef = useRef<HTMLAudioElement | null>(null);

  const startShake = () => {
    if (isShaking) return;
    setIsShaking(true);
    setResult(null);
    setShowResult(false);

    // Vibration API for mobile
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }

    // Simulate shaking time
    setTimeout(() => {
      const num = Math.floor(Math.random() * 28) + 1; // Standard 28 sticks
      setResult(num);
      setIsShaking(false);
      setShowResult(true);
    }, 2500);
  };

  return (
    <main className="fixed inset-0 bg-[#0f172a] text-white overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]" />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center">
        <Link href="/" className="p-2 rounded-full bg-white/10">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="flex-1 text-center font-bold tracking-widest text-yellow-500">ESIIMSI • เซียมซี</h1>
      </div>

      {/* Shaking Cylinder Container */}
      <div className={cn(
        "relative w-48 h-80 transition-transform duration-100",
        isShaking && "animate-shake"
      )}>
        {/* The Cylinder (กระบอก) */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-700 to-red-900 rounded-b-3xl border-x-4 border-b-4 border-yellow-600/50 shadow-2xl overflow-hidden">
            {/* Texture/Pattern */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
            <div className="absolute top-10 left-1/2 -translate-x-1/2 text-yellow-500 font-serif text-4xl opacity-50 select-none">福</div>
        </div>

        {/* The Sticks (ติ้ว) */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-1 items-end">
            {[...Array(12)].map((_, i) => (
                <div 
                    key={i} 
                    className={cn(
                        "w-2 bg-[#d97706] rounded-t-sm border-t-2 border-red-500 transition-all duration-300",
                        isShaking ? "h-32" : "h-24"
                    )}
                    style={{ 
                        transform: `rotate(${(i - 6) * 3}deg)`,
                        transformOrigin: 'bottom center',
                        animationDelay: `${i * 50}ms`
                    }}
                />
            ))}
        </div>

        {/* Falling Stick Animation */}
        {showResult && (
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 animate-stick-fall">
                 <div className="w-3 h-40 bg-yellow-400 rounded-lg shadow-lg flex flex-col items-center py-4 border-2 border-yellow-600">
                    <span className="text-red-800 font-bold text-xl">{result}</span>
                    <div className="flex-1 w-px bg-red-800/20 my-2" />
                 </div>
            </div>
        )}
      </div>

      {/* Instructions / Status */}
      <div className="mt-16 text-center z-10">
        {!showResult ? (
            <p className="text-lg font-medium text-white/70 animate-pulse">
                {isShaking ? "กำลังสื่อจิตถึงสิ่งศักดิ์สิทธิ์..." : "ตั้งจิตอธิษฐานแล้วเริ่มเขย่า"}
            </p>
        ) : (
            <div className="animate-in fade-in zoom-in duration-500">
                <p className="text-sm text-yellow-500 uppercase tracking-widest mb-2">คุณได้หมายเลข</p>
                <h2 className="text-7xl font-black text-white drop-shadow-glow mb-8">{result}</h2>
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full px-12 h-14 text-lg shadow-xl">
                    อ่านคำทำนาย
                </Button>
            </div>
        )}
      </div>

      {!showResult && (
        <Button 
            disabled={isShaking}
            onClick={startShake}
            className={cn(
                "mt-8 w-40 h-40 rounded-full bg-red-600 hover:bg-red-700 border-8 border-yellow-600/50 shadow-2xl transition-all",
                isShaking ? "scale-90 opacity-50" : "hover:scale-105"
            )}
        >
            <span className="text-2xl font-bold tracking-tighter">เขย่าติ้ว</span>
        </Button>
      )}

      <style jsx global>{`
        @keyframes shake {
            0%, 100% { transform: rotate(0deg) translate(0, 0); }
            20% { transform: rotate(15deg) translate(5px, -10px); }
            40% { transform: rotate(-15deg) translate(-5px, 10px); }
            60% { transform: rotate(10deg) translate(5px, -5px); }
            80% { transform: rotate(-10deg) translate(-5px, 5px); }
        }
        .animate-shake {
            animation: shake 0.2s infinite;
        }
        @keyframes stick-fall {
            0% { transform: translate(-50%, -20px) rotate(0deg); opacity: 0; }
            50% { transform: translate(-50%, 100px) rotate(45deg); opacity: 1; }
            100% { transform: translate(-50%, 250px) rotate(90deg); opacity: 0; }
        }
        .animate-stick-fall {
            animation: stick-fall 1s ease-in forwards;
        }
        .drop-shadow-glow {
            filter: drop-shadow(0 0 10px rgba(234, 179, 8, 0.5));
        }
      `}</style>
    </main>
  );
}
