"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/tracking";

const serviceCards = [
  {
    title: "ไพ่ทาโรต์",
    desc: "อ่านสถานการณ์ปัจจุบัน เห็นจุดเสี่ยง จุดหนุน และแนวทางที่ควรเลือกต่อ",
    href: "/tarot",
    cta: "เปิดไพ่ทาโรต์",
    badge: "ยอดนิยม",
  },
  {
    title: "ไพ่จิตวิญญาณ",
    desc: "ค้นหาไพ่ประจำตัวจากวันเกิด เพื่อเข้าใจพลังภายในและจังหวะชีวิตของคุณ",
    href: "/spirit-card",
    cta: "ดูไพ่จิตวิญญาณ",
    badge: "เข้าใจตัวเอง",
  },
  {
    title: "วิเคราะห์เบอร์มงคล",
    desc: "ถอดพลังตัวเลขจากเบอร์โทร เพื่อมองภาพรวมงาน เงิน ความรักอย่างเป็นระบบ",
    href: "/numerology",
    cta: "วิเคราะห์เบอร์",
    badge: "วางแผนชีวิต",
  },
];

const quickSteps = [
  { title: "เลือกศาสตร์", desc: "Tarot / Spirit Card / Numerology" },
  { title: "ใส่คำถามหรือข้อมูล", desc: "ระบุประเด็นที่อยากโฟกัสเพื่อผลที่ตรงขึ้น" },
  { title: "รับคำทำนายทันที", desc: "อ่านสรุปและแนวทางที่นำไปใช้ได้ในชีวิตประจำวัน" },
];

export default function Home() {
  useEffect(() => {
    trackEvent("landing_view", { step: "home" });
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-fuchsia-500/10 p-6 md:p-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-amber-200/90">REFFORTUNE</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight text-white md:text-5xl">
          ดูดวง 3 ศาสตร์หลักในที่เดียว
          <span className="block text-amber-200">ชัดเจน ใช้งานได้จริง และเริ่มได้ทันที</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200/90 md:text-lg">
          โฟกัสเฉพาะเส้นทางที่คุณต้องการ: ไพ่ทาโรต์ ไพ่จิตวิญญาณ และวิเคราะห์เบอร์มงคล
          เพื่อช่วยมองภาพรวมและตัดสินใจอย่างมั่นใจขึ้น
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:flex md:flex-wrap">
          <Link
            href="/tarot"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
          >
            เริ่มที่ไพ่ทาโรต์
          </Link>
          <Link
            href="/spirit-card"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            ดูไพ่จิตวิญญาณ
          </Link>
          <Link
            href="/numerology"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            วิเคราะห์เบอร์มงคล
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold text-white md:text-2xl">บริการหลัก</h2>
          <p className="text-xs text-slate-400 md:text-sm">เลือกตามเป้าหมายที่อยากรู้ตอนนี้</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {serviceCards.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="inline-flex rounded-full border border-amber-200/30 bg-amber-200/10 px-2.5 py-1 text-[11px] text-amber-100">
                {item.badge}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.desc}</p>
              <Link href={item.href} className="mt-5 inline-flex min-h-10 items-center text-sm font-semibold text-amber-200 hover:text-amber-100">
                {item.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-cyan-300/30 bg-cyan-400/10 p-5 md:p-7">
        <h2 className="text-xl font-semibold text-cyan-100 md:text-2xl">เริ่มดูดวงภายใน 3 ขั้นตอน</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {quickSteps.map((step, index) => (
            <article key={step.title} className="rounded-xl border border-white/15 bg-black/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">Step {index + 1}</p>
              <h3 className="mt-1 text-sm font-semibold text-cyan-50">{step.title}</h3>
              <p className="mt-2 text-sm text-cyan-50/85">{step.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-amber-300/40 bg-amber-200/10 p-5 md:p-7">
        <h2 className="text-xl font-semibold text-amber-100 md:text-2xl">ดูดวงออนไลน์กับเรฟ</h2>
        <p className="mt-2 text-sm text-amber-50/90 md:text-base">
          ติดต่อเพื่อดูดวงออนไลน์กับเรฟได้ที่ช่องทางด้านล่าง
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="https://line.me/R/ti/p/@reffortune" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200">LINE @reffortune</a>
          <a href="https://www.instagram.com/reffortune" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10">IG reffortune</a>
          <a href="https://www.reffortune.com/package.html" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10">ดูแพ็กเกจ</a>
        </div>
      </section>
    </main>
  );
}
