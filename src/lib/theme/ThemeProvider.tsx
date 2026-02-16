"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "rainbow";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("mysticflow-theme") as Theme;
    if (savedTheme && ["light", "dark", "rainbow"].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Save to localStorage
    localStorage.setItem("mysticflow-theme", theme);
    
    // Apply theme class to document
    document.documentElement.setAttribute("data-theme", theme);
    
    // Apply CSS variables based on theme
    applyThemeVariables(theme);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const themes: Theme[] = ["light", "dark", "rainbow"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setThemeState(themes[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

function applyThemeVariables(theme: Theme) {
  const root = document.documentElement;
  
  switch (theme) {
    case "dark":
      root.style.setProperty("--bg", "#0a0a0f");
      root.style.setProperty("--bg-elevated", "#12121a");
      root.style.setProperty("--bg-soft", "#1a1a2e");
      root.style.setProperty("--bg-muted", "#16161f");
      root.style.setProperty("--text", "#f8f8fc");
      root.style.setProperty("--text-muted", "#a0a0b0");
      root.style.setProperty("--text-subtle", "#707080");
      root.style.setProperty("--accent", "#a855f7");
      root.style.setProperty("--accent-hover", "#c084fc");
      root.style.setProperty("--accent-light", "#d8b4fe");
      root.style.setProperty("--border", "#2a2a3a");
      root.style.setProperty("--border-mystical", "#4c1d95");
      root.style.setProperty("--surface-1", "#12121a");
      root.style.setProperty("--surface-2", "#1a1a2e");
      root.style.setProperty("--surface-3", "#2d1f4f");
      root.style.setProperty("--shadow-soft", "0 4px 20px rgba(168, 85, 247, 0.15)");
      root.style.setProperty("--shadow-card", "0 4px 24px rgba(0, 0, 0, 0.3)");
      root.style.setProperty("--shadow-card-hover", "0 8px 32px rgba(168, 85, 247, 0.25)");
      root.style.setProperty("--bg-gradient", `
        radial-gradient(1200px 600px at 12% -10%, rgba(168, 85, 247, 0.15), transparent 58%),
        radial-gradient(900px 520px at 85% 0%, rgba(168, 85, 247, 0.08), transparent 60%),
        linear-gradient(180deg, #0a0a0f 0%, #12121a 55%, #0a0a0f 100%)
      `);
      break;
      
    case "rainbow":
      root.style.setProperty("--bg", "#0f0f1a");
      root.style.setProperty("--bg-elevated", "#1a1a2e");
      root.style.setProperty("--bg-soft", "#252545");
      root.style.setProperty("--bg-muted", "#1f1f35");
      root.style.setProperty("--text", "#ffffff");
      root.style.setProperty("--text-muted", "#c0c0d0");
      root.style.setProperty("--text-subtle", "#808090");
      root.style.setProperty("--accent", "#ff00ff");
      root.style.setProperty("--accent-hover", "#ff44ff");
      root.style.setProperty("--accent-light", "#ff88ff");
      root.style.setProperty("--border", "#3a3a5a");
      root.style.setProperty("--border-mystical", "#ff00ff");
      root.style.setProperty("--surface-1", "#1a1a2e");
      root.style.setProperty("--surface-2", "#252545");
      root.style.setProperty("--surface-3", "#3a3a6a");
      root.style.setProperty("--shadow-soft", "0 4px 20px rgba(255, 0, 255, 0.2)");
      root.style.setProperty("--shadow-card", "0 4px 24px rgba(0, 255, 255, 0.15)");
      root.style.setProperty("--shadow-card-hover", "0 8px 32px rgba(255, 0, 255, 0.3)");
      root.style.setProperty("--bg-gradient", `
        radial-gradient(1200px 600px at 12% -10%, rgba(255, 0, 255, 0.2), transparent 58%),
        radial-gradient(900px 520px at 85% 0%, rgba(0, 255, 255, 0.15), transparent 60%),
        radial-gradient(800px 400px at 50% 100%, rgba(255, 215, 0, 0.1), transparent 50%),
        linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 55%, #0f0f1a 100%)
      `);
      
      // Add rainbow animation class
      if (!document.getElementById("rainbow-styles")) {
        const style = document.createElement("style");
        style.id = "rainbow-styles";
        style.textContent = `
          [data-theme="rainbow"] .rainbow-text {
            background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            background-size: 200% auto;
            animation: rainbow-shift 3s linear infinite;
          }
          [data-theme="rainbow"] .rainbow-border {
            border-image: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3) 1;
          }
          [data-theme="rainbow"] .rainbow-glow {
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.4), 0 0 40px rgba(0, 255, 255, 0.2);
          }
          [data-theme="rainbow"] .card-hover:hover {
            box-shadow: 0 8px 32px rgba(255, 0, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.2);
          }
          @keyframes rainbow-shift {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
          @keyframes magical-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          [data-theme="rainbow"] .magical-float {
            animation: magical-float 3s ease-in-out infinite;
          }
        `;
        document.head.appendChild(style);
      }
      break;
      
    default: // light
      root.style.setProperty("--bg", "#ffffff");
      root.style.setProperty("--bg-elevated", "#ffffff");
      root.style.setProperty("--bg-soft", "#faf5ff");
      root.style.setProperty("--bg-muted", "#f3f4f6");
      root.style.setProperty("--text", "#1f2937");
      root.style.setProperty("--text-muted", "#6b7280");
      root.style.setProperty("--text-subtle", "#9ca3af");
      root.style.setProperty("--accent", "#7c3aed");
      root.style.setProperty("--accent-hover", "#5b21b6");
      root.style.setProperty("--accent-light", "#a78bfa");
      root.style.setProperty("--border", "#e5e7eb");
      root.style.setProperty("--border-mystical", "#e9d5ff");
      root.style.setProperty("--surface-1", "#ffffff");
      root.style.setProperty("--surface-2", "#faf5ff");
      root.style.setProperty("--surface-3", "#f3e8ff");
      root.style.setProperty("--shadow-soft", "0 4px 20px rgba(124, 58, 237, 0.08)");
      root.style.setProperty("--shadow-card", "0 4px 24px rgba(0, 0, 0, 0.06)");
      root.style.setProperty("--shadow-card-hover", "0 8px 32px rgba(124, 58, 237, 0.12)");
      root.style.setProperty("--bg-gradient", `
        radial-gradient(1200px 600px at 12% -10%, rgba(124, 58, 237, 0.08), transparent 58%),
        radial-gradient(900px 520px at 85% 0%, rgba(124, 58, 237, 0.05), transparent 60%),
        linear-gradient(180deg, #ffffff 0%, #faf5ff 55%, #ffffff 100%)
      `);
      break;
  }
}
