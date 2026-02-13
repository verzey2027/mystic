"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics/tracking";

const serviceCards = [
  {
    title: "ไพ่ทาโรต์",
    href: "/tarot",
    price: "เริ่มต้น 299.-",
    badge: null,
    icon: "https://www.reffortune.com/icon/backcard.png",
  },
  {
    title: "ไพ่จิตวิญญาณ",
    href: "/spirit-card",
    price: "ยอดนิยม 399.-",
    badge: "ยอดนิยม",
    icon: "https://www.reffortune.com/icon/backcard.png",
  },
  {
    title: "วิเคราะห์เบอร์มงคล",
    href: "/numerology",
    price: "พิเศษ 499.-",
    badge: null,
    icon: "https://www.reffortune.com/icon/backcard.png",
  },
];

const recommendedPackages = [
  {
    id: "promo-3q",
    emoji: "✨",
    badge: "โปรพิเศษ",
    title: "โปรเปิดไพ่ 3 คำถาม",
    price: "99.-",
    subtitle: "เช็คดวง ดูแนวทางต่างๆ อยากเคลียร์ข้อสงสัย",
    description: "ไพ่ถามตอบ จัดโปรดูดวงตลอดเดือนมกราคม 🌞",
    highlights: [
      "3 คำถาม 99.-",
      "พิมพ์ตอบกลับ ได้คำตอบภายในวันเดียว",
      "เร็วสุดภายใน 1-2 ชั่วโมง 🔮",
    ],
    format: "พิมพ์ตอบ",
  },
  {
    id: "monthly",
    emoji: "🔮",
    badge: "ลูกค้าประจำเยอะ",
    title: "แพคดูดวงรายเดือน",
    price: "259.-",
    subtitle: "สำหรับคนที่อยากรู้ทิศทาง ดูพลังงานตัวเองเพื่อตั้งรับ",
    description: "ใช้ศาสตร์ ไพ่ + โหราศาสตร์ไทย ดูครบทุกด้าน",
    highlights: [
      "การเงิน – รายรับ รายจ่าย โอกาสใหม่",
      "โชคลาภ – จังหวะเสี่ยงดวงที่ควรรู้",
      "ความรัก – คนโสด / คนมีคู่",
      "การงาน – ทิศทาง งานจะไปต่อหรือปรับอะไรดี",
      "สุขภาพ – สิ่งที่ควรระวัง",
      "คำแนะนำ & พลังงานชีวิตประจำเดือน",
    ],
    format: "พิมพ์ตอบ · อ่านง่าย ใช้ได้จริงทั้งเดือน",
  },
  {
    id: "pack-b",
    emoji: "⭐",
    badge: "ลูกค้าเลือกเยอะสุด",
    title: "แพ็ก B | เปิดไพ่ 10 ใบ + โหราศาสตร์",
    price: "389.-",
    subtitle: "ดูภาพรวมดวงและทิศทางชีวิตในช่วงนี้",
    description: "ครอบคลุมทุกเรื่องหลัก ทั้งการงาน การเงิน โชคลาภ ความรัก และจังหวะชีวิต",
    highlights: [
      "รู้ทิศทาง นำไปใช้ได้จริง ชี้ชัดว่าเรื่องไหนเด่น เรื่องไหนควรรอ",
      "อ่านคู่กับโหราศาสตร์ ดูจังหวะเวลา พลังดาว",
      "เหมาะกับคนที่ต้องการเช็คดวงชะตา 1-3 เดือน",
      "คนรอบข้าง ความก้าวหน้า อุปสรรค สุขภาพ",
    ],
    format: "คอล 20-30 นาที | พิมพ์ | อัดเสียง",
  },
  {
    id: "full-report",
    emoji: "📜",
    badge: "เจาะลึกที่สุด",
    title: "Personal Horoscope Report",
    price: "929.-",
    subtitle: "เปิดดวงชะตาฉบับเต็ม เจาะลึกทุกมิติชีวิตด้วยโหราศาสตร์ไทย",
    description: "รู้ก่อน วางแผนก่อน เปลี่ยนอุปสรรคให้เป็นโอกาส",
    highlights: [
      "พื้นดวงชะตาเดิม · จุดแข็ง จุดอ่อน Inner-Self",
      "การเงิน & ความมั่งคั่ง · อาชีพ & ความสำเร็จ",
      "ความรัก & คู่ครอง · บริวาร & คนรอบข้าง",
      "สุขภาพ & อุปสรรค",
      "ดวงรายปี 2026 ครึ่งปีแรก-หลัง ครบทุกด้าน",
      "เคล็ดลับเสริมดวง + การ์ดฮีลใจประจำปี",
    ],
    format: "ไฟล์ PDF 15-20 หน้า · ใช้เวลา 3-7 วัน",
  },
];

export default function Home() {
  const [expandedPkg, setExpandedPkg] = useState<string | null>(null);

  useEffect(() => {
    trackEvent("landing_view", { step: "home" });
  }, []);

  return (
    <main className="theme-light mx-auto w-full max-w-lg">
      {/* ── Hero ── */}
      <section
        className="relative isolate overflow-hidden px-5 pb-8 pt-12"
        style={{
          background: "linear-gradient(160deg, #1a0e3e 0%, #2d1b69 35%, #4c2889 70%, #6d3bbd 100%)",
        }}
      >
        {/* Ambient glow orbs */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 rounded-full opacity-30 blur-3xl"
          style={{ background: "#8b5cf6" }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full opacity-20 blur-3xl"
          style={{ background: "#a78bfa" }}
        />

        {/* Shimmer overlay */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute -top-1/2 left-0 h-[200%] w-20 opacity-[0.06]"
            style={{
              background: "linear-gradient(90deg, transparent, white, transparent)",
              animation: "tarot-shimmer 4s ease-in-out infinite",
            }}
          />
        </div>

        <div className="relative z-10 text-center">
          <p
            className="text-sm font-semibold tracking-[0.15em]"
            style={{ color: "#d4af37", fontStyle: "italic" }}
          >
            REFFORTUNE
          </p>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-white">
            ค้นหาคำตอบของชีวิต
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#c4b5fd" }}>
            ด้วยศาสตร์แห่งการพยากรณ์ชั้นสูง
          </p>
        </div>

        {/* ── Service Cards (horizontal scroll) ── */}
        <div className="relative z-10 mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {serviceCards.map((item, i) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex-shrink-0 overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1"
              style={{
                width: "140px",
                borderColor: "rgba(212,175,55,0.3)",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
                animation: `tarot-fade-up 0.5s ease-out ${i * 0.1}s both`,
              }}
            >
              {/* Image */}
              <div className="relative mx-auto mt-3 h-24 w-20 overflow-hidden rounded-lg">
                <Image
                  src={item.icon}
                  alt={item.title}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              {/* Text */}
              <div className="px-2 pb-3 pt-2 text-center">
                <h3 className="text-xs font-bold text-white">{item.title}</h3>
                <p
                  className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{
                    background: item.badge
                      ? "linear-gradient(135deg, #d4af37, #e6c34a)"
                      : "rgba(212,175,55,0.15)",
                    color: item.badge ? "#1a0e3e" : "#d4af37",
                  }}
                >
                  {item.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── บริการด่วน ── */}
      <section className="px-5 pt-6">
        <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>
          บริการด่วน
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            href="/tarot"
            className="flex items-center gap-3 rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style={{
              borderColor: "var(--border-gold)",
              background: "var(--bg-elevated)",
              boxShadow: "0 2px 12px rgba(139,92,246,0.06)",
            }}
          >
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              style={{ background: "linear-gradient(135deg, #4c2889, #6d3bbd)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>จองคิวดูดวง</p>
              <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>พร้อมให้บริการทันที</p>
            </div>
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            style={{
              borderColor: "var(--border-gold)",
              background: "var(--bg-elevated)",
              boxShadow: "0 2px 12px rgba(139,92,246,0.06)",
            }}
          >
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              style={{ background: "linear-gradient(135deg, #4c2889, #6d3bbd)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>ปรึกษาฟรีเบื้องต้น</p>
              <p className="text-[11px]" style={{ color: "var(--text-subtle)" }}>พูดคุยกับผู้เชี่ยวชาญ</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── แพคแนะนำ ── */}
      <section className="px-5 pt-8 pb-4">
        <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>
          แพคแนะนำ
        </h2>
        <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
          เลือกแพคที่เหมาะกับคุณ
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {recommendedPackages.map((pkg, i) => {
            const isExpanded = expandedPkg === pkg.id;
            const isPopular = pkg.id === "pack-b";
            return (
              <div
                key={pkg.id}
                className="relative overflow-hidden rounded-2xl border transition-all duration-300"
                style={{
                  borderColor: isPopular
                    ? "rgba(212,175,55,0.5)"
                    : "rgba(139,92,246,0.15)",
                  background: isPopular
                    ? "linear-gradient(160deg, #1a0e3e 0%, #2d1b69 50%, #4c2889 100%)"
                    : "var(--bg-elevated)",
                  boxShadow: isPopular
                    ? "0 4px 24px rgba(139,92,246,0.15), 0 0 0 1px rgba(212,175,55,0.2)"
                    : "0 2px 12px rgba(139,92,246,0.06)",
                  animation: `tarot-fade-up 0.5s ease-out ${i * 0.08}s both`,
                }}
              >
                {/* Popular ribbon */}
                {isPopular && (
                  <div
                    className="absolute top-0 right-0 rounded-bl-xl px-3 py-1 text-[10px] font-bold"
                    style={{
                      background: "linear-gradient(135deg, #d4af37, #e6c34a)",
                      color: "#1a0e3e",
                    }}
                  >
                    🔥 ยอดนิยม
                  </div>
                )}

                <div className="p-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{pkg.emoji}</span>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: isPopular
                              ? "rgba(212,175,55,0.2)"
                              : "rgba(139,92,246,0.1)",
                            color: isPopular ? "#d4af37" : "#8b5cf6",
                          }}
                        >
                          {pkg.badge}
                        </span>
                      </div>
                      <h3
                        className="mt-1.5 text-sm font-bold leading-tight"
                        style={{ color: isPopular ? "#fff" : "var(--text)" }}
                      >
                        {pkg.title}
                      </h3>
                      <p
                        className="mt-1 text-xs leading-relaxed"
                        style={{
                          color: isPopular
                            ? "rgba(255,255,255,0.7)"
                            : "var(--text-subtle)",
                        }}
                      >
                        {pkg.subtitle}
                      </p>
                    </div>
                    {/* Price badge */}
                    <div
                      className="flex-shrink-0 rounded-xl px-3 py-2 text-center"
                      style={{
                        background: isPopular
                          ? "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.1))"
                          : "rgba(139,92,246,0.08)",
                        border: isPopular
                          ? "1px solid rgba(212,175,55,0.3)"
                          : "1px solid rgba(139,92,246,0.12)",
                      }}
                    >
                      <p
                        className="text-lg font-bold leading-none"
                        style={{ color: isPopular ? "#d4af37" : "#8b5cf6" }}
                      >
                        {pkg.price}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="mt-2 text-[11px] italic leading-relaxed"
                    style={{
                      color: isPopular
                        ? "rgba(255,255,255,0.55)"
                        : "var(--text-subtle)",
                    }}
                  >
                    {pkg.description}
                  </p>

                  {/* Expand/collapse toggle */}
                  <button
                    onClick={() =>
                      setExpandedPkg(isExpanded ? null : pkg.id)
                    }
                    className="mt-2 flex items-center gap-1 text-[11px] font-semibold transition-colors"
                    style={{ color: isPopular ? "#d4af37" : "#8b5cf6" }}
                  >
                    {isExpanded ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-300"
                      style={{
                        transform: isExpanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Expandable details */}
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      maxHeight: isExpanded ? "400px" : "0px",
                      opacity: isExpanded ? 1 : 0,
                    }}
                  >
                    <div
                      className="mt-3 rounded-xl p-3"
                      style={{
                        background: isPopular
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(139,92,246,0.04)",
                      }}
                    >
                      {pkg.highlights.map((h) => (
                        <div
                          key={h}
                          className="flex items-start gap-2 py-1"
                        >
                          <span
                            className="mt-1 text-[8px]"
                            style={{
                              color: isPopular ? "#d4af37" : "#8b5cf6",
                            }}
                          >
                            ●
                          </span>
                          <p
                            className="text-xs leading-relaxed"
                            style={{
                              color: isPopular
                                ? "rgba(255,255,255,0.8)"
                                : "var(--text-muted)",
                            }}
                          >
                            {h}
                          </p>
                        </div>
                      ))}
                      {/* Format tag */}
                      <div
                        className="mt-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-medium"
                        style={{
                          background: isPopular
                            ? "rgba(212,175,55,0.12)"
                            : "rgba(139,92,246,0.08)",
                          color: isPopular
                            ? "rgba(212,175,55,0.9)"
                            : "#8b5cf6",
                        }}
                      >
                        📋 {pkg.format}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href="https://line.me/R/ti/p/@reffortune"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                    style={{
                      background: isPopular
                        ? "linear-gradient(135deg, #d4af37, #e6c34a)"
                        : "linear-gradient(135deg, #4c2889, #6d3bbd)",
                      color: isPopular ? "#1a0e3e" : "white",
                      boxShadow: isPopular
                        ? "0 4px 20px rgba(212,175,55,0.3)"
                        : "0 4px 20px rgba(109,59,189,0.25)",
                    }}
                  >
                    จองคิว · ปรึกษา · นัดหมาย
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── ดูดวงออนไลน์กับเรฟ (Contact) ── */}
      <section className="px-5 pt-4 pb-6">
        <div
          className="overflow-hidden rounded-2xl border p-5"
          style={{
            borderColor: "var(--border-gold)",
            background: "linear-gradient(135deg, rgba(212,175,55,0.06), rgba(139,92,246,0.04))",
          }}
        >
          <h3 className="text-sm font-bold" style={{ color: "var(--text)" }}>
            ดูดวงออนไลน์กับเรฟ
          </h3>
          <p className="mt-1 text-xs" style={{ color: "var(--text-subtle)" }}>
            ติดต่อเพื่อดูดวงออนไลน์กับเรฟได้ที่ช่องทางด้านล่าง
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://line.me/R/ti/p/@reffortune"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all hover:scale-[1.03]"
              style={{
                background: "linear-gradient(135deg, #4c2889, #6d3bbd)",
                color: "white",
              }}
            >
              LINE @reffortune
            </a>
            <a
              href="https://www.instagram.com/reffortune"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition hover:bg-purple-50"
              style={{ borderColor: "var(--border-strong)", color: "var(--text)" }}
            >
              IG reffortune
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
