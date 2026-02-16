"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Sparkles, Star, ChevronRight, Crown } from "lucide-react";

function trackEvent(event: string, data?: Record<string, unknown>) {
  console.log("[Analytics]", event, data);
}

function todayDate() {
  const d = new Date();
  const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return `วัน${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "สวัสดีตอนเช้า";
  if (hour < 16) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
}

const packages = [
  {
    name: "เริ่มต้น",
    price: "ฟรี",
    description: "3 ครั้ง/วัน",
    features: ["ไพ่ทาโรต์ 1 ใบ", "ดวงรายวัน", "ไพ่จิตวิญญาณ"],
    popular: false,
  },
  {
    name: "พรีเมียม",
    price: "฿99",
    period: "/เดือน",
    description: "ไม่จำกัด",
    features: ["ทุกศาสตร์ไม่จำกัด", "วิเคราะห์ละเอียด", "บันทึกผลย้อนหลัง", "ไม่มีโฆษณา"],
    popular: true,
  },
  {
    name: "แพ็คเกจ",
    price: "฿199",
    period: "",
    description: "30 ครั้ง",
    features: ["ใช้ได้ทุกศาสตร์", "ไม่หมดอายุ", "แชร์ผลได้"],
    popular: false,
  },
];

export default function Home() {
  useEffect(() => {
    trackEvent("landing_view", { step: "home" });
  }, []);

  return (
    <main className="min-h-screen bg-white pb-24">
      <{/* Header */}>
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-violet-600" />
          <span className="font-serif text-xl font-semibold text-violet-600">MysticFlow</span>
        </div>
      </header>

      <{/* Hero Section */}>
      <section className="px-5 pt-4">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-600 via-violet-500 to-purple-500 p-6 text-white shadow-xl shadow-violet-200">
          <{/* Decorative elements */}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <p className="text-violet-100 text-sm mb-1">{greeting()}</p>
            <h1 className="font-serif text-2xl font-semibold leading-tight">
              ค้นหาคำตอบที่คุณตามหา
            </h1>
            <p className="mt-2 text-violet-100 text-sm leading-relaxed">
              ไพ่ทาโรต์ • ดวงชะตา • ความรัก • เลขศาสตร์
            </p>

            <div className="mt-5 flex gap-3">
              <Link href="/tarot" className="flex-1">
                <button className="w-full h-12 rounded-xl bg-white text-violet-600 font-semibold shadow-lg hover:bg-violet-50 transition-all active:scale-[0.98]">
                  เริ่มดูดวง
                </button>
              </Link>
            </div>
          </div>
        </div>

        <{/* Quick Stats */}>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link href="/daily-card">
            <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100">
              <div className="flex items-center gap-2 text-violet-600 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-xs font-medium">ไพ่ประจำวัน</span>
              </div>
              <p className="text-xs text-gray-500">{todayDate()}</p>
            </div>
          </Link>

          <Link href="/library/saved">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-medium">การอ่านของฉัน</span>
              </div>
              <p className="text-xs text-gray-500">ดูย้อนหลัง</p>
            </div>
          </Link>
        </div>
      </section>

      <{/* Packages Section */}>
      <section className="px-5 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold text-gray-900">แพ็กเกจแนะนำ</h2>
          <Link href="/pricing" className="text-violet-600 text-sm flex items-center gap-1">
            ดูทั้งหมด <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative p-5 rounded-2xl border transition-all ${
                pkg.popular
                  ? "bg-violet-50 border-violet-200 shadow-lg shadow-violet-100"
                  : "bg-white border-gray-200"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-5 px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" /> ยอดนิยม
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                  <p className="text-sm text-gray-500">{pkg.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-violet-600">{pkg.price}</p>
                  {pkg.period && <p className="text-xs text-gray-400">{pkg.period}</p>}
                </div>
              </div>

              <ul className="space-y-2 mb-4">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full h-11 rounded-xl font-medium transition-all active:scale-[0.98] ${
                  pkg.popular
                    ? "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {pkg.popular ? "สมัครเลย" : "เลือกแพ็กเกจนี้"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <{/* Daily Tip */}>
      <section className="px-5 pt-8">
        <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium">คำแนะนำวันนี้</span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            "การเปิดรับพลังงานบวกจะช่วยให้คุณผ่านพ้นวันที่ท้าทายไปได้ด้วยดี"
          </p>
        </div>
      </section>
    </main>
  );
}
