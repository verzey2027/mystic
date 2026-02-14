"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CompatibilityReading } from "@/lib/compatibility/types";
import { calculateCompatibility } from "@/lib/compatibility/engine";
import { getZodiacThaiName } from "@/lib/horoscope/zodiac";

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const date1 = searchParams.get("date1");
  const date2 = searchParams.get("date2");

  const [reading, setReading] = useState<CompatibilityReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!date1 || !date2) {
      setError("กรุณาระบุวันเกิดทั้งสองคน");
      setLoading(false);
      return;
    }

    const fetchReading = async () => {
      try {
        const result = await calculateCompatibility({
          person1: { birthDate: new Date(date1) },
          person2: { birthDate: new Date(date2) },
        });
        setReading(result);
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการวิเคราะห์ความเข้ากัน กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, [date1, date2]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="text-2xl">💕</div>
          <p className="mt-2 text-sm text-fg-muted">กำลังวิเคราะห์ความเข้ากัน...</p>
        </div>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="px-5">
        <Card className="p-5 bg-bg border-danger/30">
          <p className="text-sm text-danger">{error || "ไม่พบข้อมูล"}</p>
          <Button className="mt-4 w-full" onClick={() => router.push("/compatibility")}>
            กลับไปใส่วันเกิด
          </Button>
        </Card>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-orange-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "เข้ากันดีมาก";
    if (score >= 60) return "เข้ากันดี";
    if (score >= 40) return "เข้ากันปานกลาง";
    return "ต้องปรับตัว";
  };

  return (
    <div className="px-5 pb-6">
      {/* Header Card */}
      <Card className="p-5 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="text-center">
              <div className="text-lg font-bold text-fg">
                {getZodiacThaiName(reading.person1.zodiacSign)}
              </div>
              <div className="text-xs text-fg-muted">คนที่ 1</div>
            </div>
            <div className="text-2xl">💕</div>
            <div className="text-center">
              <div className="text-lg font-bold text-fg">
                {getZodiacThaiName(reading.person2.zodiacSign)}
              </div>
              <div className="text-xs text-fg-muted">คนที่ 2</div>
            </div>
          </div>
          <div className={`text-4xl font-bold ${getScoreColor(reading.overallScore)}`}>
            {reading.overallScore}%
          </div>
          <p className="mt-1 text-sm text-fg-muted">{getScoreLabel(reading.overallScore)}</p>
        </div>
      </Card>

      {/* Element Compatibility */}
      <Card className="mt-4 p-5 bg-bg">
        <h3 className="text-sm font-bold text-accent mb-2">🌟 ความเข้ากันของธาตุ</h3>
        <p className="text-sm leading-relaxed text-fg-muted">{reading.elementCompatibility}</p>
      </Card>

      {/* Detailed Scores */}
      <Card className="mt-4 p-5 bg-bg">
        <h3 className="text-sm font-bold text-accent mb-3">📊 คะแนนรายด้าน</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-fg">การสื่อสาร</span>
            <span className={`text-sm font-semibold ${getScoreColor(reading.scores.communication)}`}>
              {reading.scores.communication}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-fg">ความเข้าใจทางอารมณ์</span>
            <span className={`text-sm font-semibold ${getScoreColor(reading.scores.emotional)}`}>
              {reading.scores.emotional}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-fg">ความสัมพันธ์ระยะยาว</span>
            <span className={`text-sm font-semibold ${getScoreColor(reading.scores.longTerm)}`}>
              {reading.scores.longTerm}%
            </span>
          </div>
        </div>
      </Card>

      {/* Strengths */}
      <Card className="mt-4 p-5 bg-bg">
        <h3 className="text-sm font-bold text-accent mb-3">💪 จุดแข็งของความสัมพันธ์</h3>
        <ul className="space-y-2">
          {reading.strengths.map((strength, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span className="text-sm leading-relaxed text-fg-muted flex-1">{strength}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Challenges */}
      <Card className="mt-4 p-5 bg-bg">
        <h3 className="text-sm font-bold text-accent mb-3">⚠️ ความท้าทาย</h3>
        <ul className="space-y-2">
          {reading.challenges.map((challenge, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-orange-600 mt-0.5">!</span>
              <span className="text-sm leading-relaxed text-fg-muted flex-1">{challenge}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Advice */}
      <Card className="mt-4 p-5 bg-bg">
        <h3 className="text-sm font-bold text-accent mb-2">✨ คำแนะนำ</h3>
        <p className="text-sm leading-relaxed text-fg-muted">{reading.advice}</p>
      </Card>

      {/* Actions */}
      <div className="mt-6 space-y-3">
        <Button className="w-full" onClick={() => router.push("/compatibility")}>
          วิเคราะห์คู่อื่น
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => router.push("/")}
        >
          กลับหน้าหลัก
        </Button>
      </div>
    </div>
  );
}

export default function CompatibilityResultPage() {
  return (
    <main className="mx-auto w-full max-w-lg">
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ดูดวงความเข้ากัน" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">ผลการวิเคราะห์</h1>
      </header>

      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="text-center">
              <div className="text-2xl">💕</div>
              <p className="mt-2 text-sm text-fg-muted">กำลังโหลด...</p>
            </div>
          </div>
        }
      >
        <ResultContent />
      </Suspense>
    </main>
  );
}
