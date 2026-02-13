"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const bottomTabs = [
  { label: "หน้าแรก", href: "/", icon: "home" },
  { label: "ทาโรต์", href: "/tarot", icon: "tarot" },
  { label: "คลังไพ่", href: "/library", icon: "library" },
  { label: "โปรไฟล์", href: "#", icon: "profile" },
] as const;

type IconType = (typeof bottomTabs)[number]["icon"];

function BottomTabIcon({ type }: { type: IconType }) {
  switch (type) {
    case "home":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "tarot":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="6" x2="12" y2="6.01" />
          <line x1="12" y1="18" x2="12" y2="18.01" />
        </svg>
      );
    case "library":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    case "profile":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
      className="fixed left-0 right-0 bottom-0 z-[9999] w-full border-t border-border bg-bg"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {bottomTabs.map((tab) => {
          const active = isActive(pathname, tab.href);
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 text-[11px] transition-colors",
                active ? "text-accent" : "text-fg-subtle"
              )}
              aria-current={active ? "page" : undefined}
            >
              <BottomTabIcon type={tab.icon} />
              <span className="font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
