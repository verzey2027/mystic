"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ZodiacSelector } from "@/components/horoscope/ZodiacSelector";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { FAB } from "@/components/ui/FAB";
import { PrivacyNotice } from "@/components/ui/PrivacyNotice";
import { ReadingType } from "@/lib/reading/types";
import { ZodiacSign, TimePeriod } from "@/lib/horoscope/types";
import { ReadingDomain } from "@/lib/horoscope/specialized";

export default function SpecializedPage() {
  const router = useRouter();
  const [zodiacSign, setZodiacSign] = useState<ZodiacSign | null>(null);
  const [domain, setDomain] = useState<ReadingDomain>(ReadingDomain.FINANCE_CAREER);
  const [period, setPeriod] = useState<TimePeriod>(TimePeriod.DAILY);

  const handleSubmit = () => {
    if (!zodiacSign) return;

    const params = new URLSearchParams({
      sign: zodiacSign,
      domain: domain,
      period: period,
    });

    router.push(`/specialized/result?${params.toString()}`);
  };

  const domains = [
    {
      value: ReadingDomain.FINANCE_CAREER,
      label: "การเงิน/การงาน",
      icon: "💼",
      desc: "ดูดวงเกี่ยวกับการงาน รายได้ และโอกาสทางอาชีพ",
    },
    {
      value: ReadingDomain.LOVE_RELATIONSHIPS,
      label: "ความรัก/ความสัมพันธ์",
      icon: "💕",
      desc: "ดูดวงเกี่ยวกับความรัก ความสัมพันธ์ และชีวิตคู่",
    },
  ];

  const periods = [
    { value: TimePeriod.DAILY, label: "รายวัน", icon: "☀️" },
    { value: TimePeriod.WEEKLY, label: "รายสัปดาห์", icon: "📅" },
    { value: TimePeriod.MONTHLY, label: "รายเดือน", icon: "🗓️" },
  ];

  return (
    <main className="mx-auto w-full max-w-lg">
      {/* Privacy Notice - shows only on first use */}
      <PrivacyNotice 
        featureType={ReadingType.SPECIALIZED}
        featureName="ดูดวงเฉพาะด้าน"
      />
      
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ดูดวงเฉพาะด้าน" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">
          ดูดวงเฉพาะด้าน
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          เลือกด้านที่ต้องการดูดวงเจาะลึก
        </p>
      </header>

      <div className="px-5 pb-6">
        {/* Domain Selection */}
        <Card className="p-5 bg-bg mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎯</span>
            <h2 className="text-base font-semibold text-fg">เลือกด้านที่สนใจ</h2>
          </div>

          <div className="space-y-2">
            {domains.map((d) => (
              <button
                key={d.value}
                onClick={() => setDomain(d.value)}
                className={`
                  w-full flex items-start gap-3 p-4 rounded-lg border-2 transition-all text-left
                  ${
                    domain === d.value
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-bg-subtle text-fg-muted hover:border-accent/50"
                  }
                `}
              >
                <span className="text-2xl flex-shrink-0">{d.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-fg mb-0.5">{d.label}</div>
                  <div className="text-xs text-fg-muted">{d.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Zodiac Selection */}
        <Card className="p-5 bg-bg mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">♈</span>
            <h2 className="text-base font-semibold text-fg">เลือกราศีของคุณ</h2>
          </div>
          <ZodiacSelector value={zodiacSign ?? undefined} onChange={setZodiacSign} />
        </Card>

        {/* Period Selection */}
        <Card className="p-5 bg-bg mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📆</span>
            <h2 className="text-base font-semibold text-fg">เลือกช่วงเวลา</h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`
                  flex flex-col items-center justify-center gap-1 p-3 rounded-lg border-2 transition-all
                  ${
                    period === p.value
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-bg-subtle text-fg-muted hover:border-accent/50"
                  }
                `}
              >
                <span className="text-xl">{p.icon}</span>
                <span className="text-xs font-medium">{p.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-fg mb-1">
                เกี่ยวกับดูดวงเฉพาะด้าน
              </h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                ดูดวงเฉพาะด้านจะให้คำทำนายที่เจาะลึกในเรื่องที่คุณสนใจ
                พร้อมคำแนะนำและแนวทางปฏิบัติที่ชัดเจน
              </p>
            </div>
          </div>
        </Card>

        <div className="sticky bottom-20 z-30 mt-6">
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={!zodiacSign}
          >
            ดูดวงเฉพาะด้าน
          </Button>
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
