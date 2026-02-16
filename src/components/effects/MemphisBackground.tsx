"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme/ThemeProvider";

interface MemphisElement {
  id: number;
  type: "circle" | "x" | "wave";
  x: number;
  y: number;
  size: number;
  rotation: number;
  opacity: number;
}

export function MemphisBackground() {
  const { theme } = useTheme();
  const [elements, setElements] = useState<MemphisElement[]>([]);

  useEffect(() => {
    // Generate random Memphis elements
    const generateElements = (): MemphisElement[] => {
      const types: ("circle" | "x" | "wave")[] = ["circle", "x", "wave"];
      const newElements: MemphisElement[] = [];
      
      for (let i = 0; i < 15; i++) {
        newElements.push({
          id: i,
          type: types[Math.floor(Math.random() * types.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 20 + Math.random() * 60,
          rotation: Math.random() * 360,
          opacity: 0.1 + Math.random() * 0.3,
        });
      }
      
      return newElements;
    };

    setElements(generateElements());
  }, []);

  // Only show in pastel theme
  if (theme !== "pastel") {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute floating"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            transform: `rotate(${el.rotation}deg)`,
            opacity: el.opacity,
            animationDelay: `${el.id * 0.5}s`,
          }}
        >
          {el.type === "circle" && (
            <div
              className="rounded-full border-2 border-white/40"
              style={{
                width: el.size,
                height: el.size,
              }}
            />
          )}
          {el.type === "x" && (
            <span
              className="text-white/50 text-2xl font-light"
              style={{ fontSize: el.size }}
            >
              ×
            </span>
          )}
          {el.type === "wave" && (
            <div
              className="flex gap-1"
              style={{ width: el.size * 2 }}
            >
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-full bg-white/30"
                  style={{
                    width: el.size / 3,
                    height: el.size / 3,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
