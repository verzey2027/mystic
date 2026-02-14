"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/nav/AppBar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DateInputPair } from "@/components/compatibility/DateInputPair";
import { FeatureMenu } from "@/components/nav/FeatureMenu";
import { FAB } from "@/components/ui/FAB";
import { PrivacyNotice } from "@/components/ui/PrivacyNotice";
import { ReadingType } from "@/lib/reading/types";

export default function CompatibilityPage() {
  const router = useRouter();
  const [person1Date, setPerson1Date] = useState("");
  const [person2Date, setPerson2Date] = useState("");
  const [person1Error, setPerson1Error] = useState("");
  const [person2Error, setPerson2Error] = useState("");

  const validateDates = (): boolean => {
    let isValid = true;
    setPerson1Error("");
    setPerson2Error("");

    if (!person1Date) {
      setPerson1Error("กรุณาระบุวันเกิดคนที่ 1");
      isValid = false;
    }

    if (!person2Date) {
      setPerson2Error("กรุณาระบุวันเกิดคนที่ 2");
      isValid = false;
    }

    // Check if dates are valid
    if (person1Date) {
      const date1 = new Date(person1Date);
      if (isNaN(date1.getTime())) {
        setPerson1Error("วันเกิดไม่ถูกต้อง");
        isValid = false;
      }
    }

    if (person2Date) {
      const date2 = new Date(person2Date);
      if (isNaN(date2.getTime())) {
        setPerson2Error("วันเกิดไม่ถูกต้อง");
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!validateDates()) return;

    const params = new URLSearchParams({
      date1: person1Date,
      date2: person2Date,
    });

    router.push(`/compatibility/result?${params.toString()}`);
  };

  return (
    <main className="mx-auto w-full max-w-lg">
      {/* Privacy Notice - shows only on first use */}
      <PrivacyNotice 
        featureType={ReadingType.COMPATIBILITY}
        featureName="ดูดวงความรัก"
      />
      
      <header className="px-5 pt-7 pb-3">
        <AppBar title="ดูดวงความรัก" className="px-0 pt-0 pb-0" />
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-fg">ดูดวงความเข้ากัน</h1>
        <p className="mt-1 text-sm text-fg-muted">
          ใส่วันเกิดของทั้งสองคน เพื่อดูความเข้ากันในความรัก
        </p>
      </header>

      <div className="px-5 pb-6">
        <Card className="p-5 bg-bg">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💕</span>
              <h2 className="text-base font-semibold text-fg">ข้อมูลวันเกิด</h2>
            </div>
            <p className="text-sm text-fg-muted">
              ระบบจะคำนวณราศีและวิเคราะห์ความเข้ากันโดยอัตโนมัติ
            </p>
          </div>

          <DateInputPair
            person1Date={person1Date}
            person2Date={person2Date}
            onPerson1DateChange={setPerson1Date}
            onPerson2DateChange={setPerson2Date}
            person1Error={person1Error}
            person2Error={person2Error}
          />
        </Card>

        <Card className="mt-4 p-4 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <span className="text-lg">💡</span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-fg mb-1">เคล็ดลับ</h3>
              <p className="text-xs text-fg-muted leading-relaxed">
                การวิเคราะห์ความเข้ากันจะดูจากราศีของทั้งสองคน 
                รวมถึงองค์ประกอบและคุณสมบัติของราศี 
                เพื่อให้คำแนะนำที่เหมาะสมสำหรับความสัมพันธ์
              </p>
            </div>
          </div>
        </Card>

        <div className="sticky bottom-20 z-30 mt-6">
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={!person1Date || !person2Date}
          >
            วิเคราะห์ความเข้ากัน
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
