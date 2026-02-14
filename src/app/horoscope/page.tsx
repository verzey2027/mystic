import type { Metadata } from "next";
import Link from "next/link";
import { AppBar } from "@/components/nav/AppBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { FAB } from "@/components/ui/FAB";

export const metadata: Metadata = {
  title: "ดูดวงรายวัน รายสัปดาห์ รายเดือน — ดวงชะตาตามราศี",
  description:
    "ดูดวงตามราศีออนไลน์ เลือกดูดวงรายวัน รายสัปดาห์ หรือรายเดือน รับคำทำนายแม่นยำ ใช้ได้จริง",
  alternates: { canonical: "/horoscope" },
  openGraph: {
    title: "ดูดวงตามราศี — MysticFlow",
    description: "เลือกช่วงเวลาที่เหมาะกับคุณ ดูดวงรายวัน รายสัปดาห์ หรือรายเดือน",
    url: "/horoscope",
  },
};

const periods = [
  {
    period: "daily",
    title: "ดูดวงรายวัน",
    description: "ดูดวงวันนี้ โฟกัสพลังงานและโอกาสในแต่ละวัน",
    eta: "2 นาที",
    icon: "📅",
    credits: 1,
  },
  {
    period: "weekly",
    title: "ดูดวงรายสัปดาห์",
    description: "ดูดวงสัปดาห์นี้ วางแผนและเตรียมตัวล่วงหน้า",
    eta: "3 นาที",
    icon: "📆",
    credits: 2,
  },
  {
    period: "monthly",
    title: "ดูดวงรายเดือน",
    description: "ดูดวงเดือนนี้ เห็นภาพรวมและแนวโน้มระยะยาว",
    eta: "5 นาที",
    icon: "🗓️",
    credits: 3,
  },
];

export default function HoroscopePage() {
  return (
    <main className="mx-auto w-full max-w-lg">
      {/* Header */}
      <header className="px-5 pt-7 pb-3">
        <AppBar title={<span className="sr-only">ดูดวงตามราศี</span>} className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-fg">ดูดวงตามราศี</h1>
        <p className="mt-1 text-sm text-fg-muted">
          เลือกช่วงเวลาที่คุณต้องการดูดวง รับคำทำนายที่ชัดเจนและใช้ได้จริง
        </p>
      </header>

      <div className="px-5 pb-6">
        {/* Period cards */}
        <div className="mt-4 flex flex-col gap-4">
          {periods.map((item) => (
            <Link key={item.period} href={`/horoscope/${item.period}`} className="block">
              <Card className="p-5 bg-bg">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-surface text-2xl">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-fg">{item.title}</h3>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-fg-subtle">
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {item.eta}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        {item.credits} เครดิต
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{item.description}</p>
              </Card>
            </Link>
          ))}
        </div>

        {/* Sticky CTA */}
        <div className="sticky bottom-20 z-30 mt-6">
          <Link href="/horoscope/daily" className="block">
            <Button className="w-full" size="lg">
              เริ่มดูดวงรายวัน
            </Button>
          </Link>
        </div>

        {/* Feature Menu */}
        <div className="mt-8">
          <FeatureMenu />
        </div>
      </div>

      {/* FAB */}
      <FAB label="เพิ่มเพื่อน LINE" />
    </main>
  );
}
