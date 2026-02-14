"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const bottomTabs = [
  { label: "Home", href: "/", icon: "home" },
  { label: "Numerology", href: "/numerology", icon: "numerology" },
  { label: "Tarot", href: "/tarot", icon: "tarot" },
  { label: "Profile", href: "/profile", icon: "profile" },
  { label: "Saved", href: "/library/saved", icon: "saved" },
] as const;

type IconType = (typeof bottomTabs)[number]["icon"];

function BottomTabIcon({ type }: { type: IconType }) {
  switch (type) {
    case "home":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "numerology":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 8h16" />
          <path d="M4 16h16" />
          <path d="M10 3 8 21" />
          <path d="M16 3l-2 18" />
        </svg>
      );
    case "tarot":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="6" x2="12" y2="6.01" />
          <line x1="12" y1="18" x2="12" y2="18.01" />
        </svg>
      );
    case "saved":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "profile":
      return (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    default:
      return null;
  }
}

function isActive(pathname: string, href: string) {
  if (href === "#") return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[9999] w-full",
        "border-t border-[color:var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl",
        "shadow-[var(--shadow-soft)]"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-2 px-3 py-2">
        {bottomTabs.map((tab) => {
          const active = isActive(pathname, tab.href);
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "relative flex h-12 min-w-[72px] flex-1 flex-col items-center justify-center gap-0.5 rounded-[20px] px-2",
                "text-[11px] transition-[transform,background-color,color]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                active
                  ? "bg-[var(--accent-soft)] text-fg"
                  : "text-fg-subtle hover:text-fg"
              )}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={cn(
                  "grid place-items-center",
                  active ? "text-accent" : "text-fg-subtle"
                )}
              >
                <BottomTabIcon type={tab.icon} />
              </span>
              <span className="font-medium leading-none">{tab.label}</span>
              <span
                aria-hidden
                className={cn(
                  "mt-1 h-1 w-6 rounded-full transition-colors",
                  active ? "bg-accent" : "bg-transparent"
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
