"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input, Label, HelperText } from "@/components/ui/Input";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { FAB } from "@/components/ui/FAB";
import { TimePeriod } from "@/lib/horoscope/types";
import { PrivacyNotice } from "@/components/ui/PrivacyNotice";
import { ReadingType } from "@/lib/reading/types";

export default function ChineseZodiacPage() {
  const router = useRouter();
  const [birthYear, setBirthYear] = useState("");
  const [period, setPeriod] = useState<TimePeriod>(TimePeriod.DAILY);
  const [error, setError] = useState("");

  const validateYear = (): boolean => {
    setError("");

    if (!birthYear) {
      setError("กรุณาระบุปีเกิด");
      return false;
    }

    const year = parseInt(birthYear);
    const currentYear = new Date().getFullYear();

    if (isNaN(year)) {
      setError("ปีเกิดไม่ถูกต้อง");
      return false;
    }

    if (year < 1900 || year > currentYear) {
      setError(`ปีเกิดต้องอยู่ระหว่าง 1900 ถึง ${currentYear}`);
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateYear()) return;

    const params = new URLSearchParams({
      year: birthYear,
      period: period,
    });

    router.push(`/chinese-zodiac/result?${params.toString()}`);
  };

  const periods = [
    { value: TimePeriod.DAILY, label: "รายวัน", icon: "☀️" },
    { value: TimePeriod.WEEKLY, label: "รายสัปดาห์", icon: "📅" },
    { value: TimePeriod.MONTHLY, label: "รายเดือน", icon: "🗓️" },
  ];

  return (
    <main className="mx-auto w-full max-w-lg">
      {/* Privacy Notice - shows only on first use */}
      <PrivacyNotice 
        featureType={ReadingType.CHINESE_ZODIAC}
        featureName="ดูดวงจีน"
      />
      
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ดูดวงจีน" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">ดูดวงจีน 12 นักษัตร</h1>
        <p className="mt-1 text-sm text-fg-muted">
          ใส่ปีเกิดเพื่อดูดวงตามนักษัตรจีน
        </p>
      </header>

      <div className="px-5 pb-6">
        <Card className="p-5 bg-bg">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🐉</span>
              <h2 className="text-base font-semibold text-fg">ข้อมูลปีเกิด</h2>
            </div>
            <p className="text-sm text-fg-muted">
              ระบบจะคำนวณนักษัตรและธาตุโดยอัตโนมัติ
            </p>
          </div>

          <div className="space-y-4">
            {/* Birth Year Input */}
            <div className="space-y-2">
              <Label htmlFor="birth-year">ปีเกิด (ค.ศ.)</Label>
              <Input
                id="birth-year"
                type="number"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder="เช่น 1990"
                min="1900"
                max={new Date().getFullYear()}
                required
                className={error && "border-danger focus-visible:ring-danger"}
              />
              {error && (
                <HelperText className="text-danger">{error}</HelperText>
              )}
            </div>

            {/* Period Selection */}
            <div className="space-y-2">
              <Label>ช่วงเวลาที่ต้องการดู</Label>
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
            </div>
          </div>
        </Card>

        <Card className="mt-4 p-4 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-fg mb-1">เกี่ยวกับดวงจีน</h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                ดวงจีน 12 นักษัตรใช้ปีเกิดในการคำนวณ 
                แต่ละนักษัตรมีธาตุประจำตัว (ไม้ ไฟ ดิน เหล็ก น้ำ) 
                ที่มีผลต่อโชคชะตาและบุคลิกภาพ
              </p>
            </div>
          </div>
        </Card>

        <div className="sticky bottom-20 z-30 mt-6">
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={!birthYear}
          >
            ดูดวงจีน
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
