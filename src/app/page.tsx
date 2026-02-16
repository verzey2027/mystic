"use client";

import Image from "next/image";
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
    id: "horoscope-full",
    name: "เปิดดวงชะตาฉบับเต็ม",
    subtitle: "Personal Horoscope Report",
    price: "฿929",
    description: "PDF 15-20 หน้า",
    features: [
      "พื้นดวงเดิม + Inner Self",
      "การเงิน & ความมั่งคั่ง",
      "อาชีพ & ความสำเร็จ",
      "ความรัก & คู่ครอง",
      "ดวงรายปี 2026 ครบทุกด้าน",
      "เคล็ดลับเสริมดวงเฉพาะบุคคล",
      "การ์ดฮีลใจประจำปี",
    ],
    popular: true,
    detail: "เจาะลึกทุกมิติชีวิตด้วยโหราศาสตร์ไทย ทำ 3-7 วัน",
  },
  {
    id: "tarot-10",
    name: "แพ็ก B | ไพ่ 10 ใบ + โหราศาสตร์",
    subtitle: "ยอดนิยม",
    price: "฿389",
    description: "คอล 20-30 นาที",
    features: [
      "ไพ่ 10 ใบ ดูภาพรวมชีวิต",
      "การงาน การเงิน ความรัก",
      "โชคลาภ คนรอบข้าง สุขภาพ",
      "อ่านคู่โหราศาสตร์",
      "พิมพ์ + อัดเสียง",
    ],
    popular: false,
    detail: "ดูทิศทางชีวิต 1-3 เดือน ชี้ชัดเรื่องไหนเด่น",
  },
  {
    id: "yearly",
    name: "ดูดวงรายปี",
    subtitle: "รู้จังหวะชีวิตล่วงหน้า",
    price: "฿489",
    priceAlt: "฿749 (คอล 1 ชม)",
    description: "PDF หรือ คอล",
    features: [
      "ดวงปีนี้โฟกัสอะไร",
      "เงิน งาน รัก โชค",
      "ไฮไลท์ครบ พร้อมระวัง",
      "ทริคเสริมโชค",
    ],
    popular: false,
    detail: "วางแผนให้แม่นยำ รู้ก่อนล่วงหน้า",
  },
  {
    id: "hora-report",
    name: "ดวงรายปี Hora-Report",
    subtitle: "เลข 7 ตัว",
    price: "฿489",
    description: "ไม่ต้องใช้เวลาเกิด",
    features: [
      "เลข 7 ตัว แม่นยำ",
      "ดวงช่วงอายุนั้นๆ",
      "อะไรดี อะไรปัง อะไรระวัง",
      "เงิน งาน รัก สุขภาพ",
      "ทริคเสริมดวง",
    ],
    popular: false,
    detail: "ศาสตร์เลข 7 ตัว ไม่ต้องใช้เวลาเกิด",
  },
  {
    id: "qa-3",
    name: "โปรเปิดไพ่ 3 คำถาม",
    subtitle: "พิเศษ",
    price: "฿99",
    description: "ถึง 31 ม.ค.",
    features: [
      "ไพ่ถามตอบ 3 คำถาม",
      "เช็คดวง ดูแนวทาง",
      "พิมพ์ตอบกลับ",
      "เร็วสุด 1-2 ชั่วโมง",
    ],
    popular: false,
    detail: "เคลียร์ข้อสงสัยเร็วๆ",
  },
  {
    id: "qa-1",
    name: "โปร 1 คำถาม",
    subtitle: "เหมาๆ",
    price: "฿39",
    description: "ถึง 31 ม.ค.",
    features: [
      "ไพ่ถามตอบ 1 คำถาม",
      "การงาน ความรัก",
      "พิมพ์ตอบกลับ",
    ],
    popular: false,
    detail: "มีข้อสงสัย เปิดไพ่ Q/A",
  },
];

export default function Home() {
  useEffect(() => {
    trackEvent("landing_view", { step: "home" });
  }, []);

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="REFFORTUNE" 
            width={40} 
            height={40} 
            className="w-10 h-10"
          />
          <span className="font-serif text-xl font-semibold text-violet-600">REFFORTUNE</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-5 pt-4">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-violet-600 via-violet-500 to-purple-500 p-6 text-white shadow-xl shadow-violet-200">
          {/* Decorative elements */}
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

        {/* Quick Stats */}
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

      {/* Packages Section */}
      <section className="px-5 pt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-semibold text-gray-900">แพ็กเกจแนะนำ</h2>
          <Link href="/pricing" className="text-violet-600 text-sm flex items-center gap-1">
            ดูทั้งหมด <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-4">
          {packages.map((pkg) => (
            <Link key={pkg.id} href={`/pricing/${pkg.id}`} className="block">
              <div
                className={`relative p-5 rounded-2xl border transition-all active:scale-[0.98] ${
                  pkg.popular
                    ? "bg-violet-50 border-violet-200 shadow-lg shadow-violet-100"
                    : "bg-white border-gray-200 hover:border-violet-200"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-5 px-3 py-1 bg-violet-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" /> ยอดนิยม
                  </div>
                )}
                {pkg.subtitle && !pkg.popular && (
                  <div className={`absolute -top-3 left-5 px-3 py-1 text-xs font-medium rounded-full ${
                    pkg.id === 'qa-3' || pkg.id === 'qa-1' 
                      ? "bg-amber-500 text-white" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {pkg.subtitle}
                  </div>
                )}

                <div className="flex items-start justify-between mb-2 mt-2">
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{pkg.description}</p>
                    {pkg.detail && (
                      <p className="text-xs text-violet-500 mt-1">{pkg.detail}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-2xl font-bold text-violet-600">{pkg.price}</p>
                    {pkg.priceAlt && (
                      <p className="text-xs text-gray-400">{pkg.priceAlt}</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-2">รวม:</p>
                  <ul className="flex flex-wrap gap-2">
                    {pkg.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                        {feature}
                      </li>
                    ))}
                    {pkg.features.length > 4 && (
                      <li className="text-xs text-violet-500 bg-violet-50 px-2 py-1 rounded-full">
                        +{pkg.features.length - 4} รายการ
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Daily Tip */}
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
