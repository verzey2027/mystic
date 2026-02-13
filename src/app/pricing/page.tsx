import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ราคาบริการดูดวง — แพ็กเกจดูดวงออนไลน์",
  description:
    "ราคาบริการดูดวงกับ REFFORTUNE ทั้งแบบสนทนาและพิมพ์ตอบ เริ่มต้น 45 บาท พร้อมแพ็กคำถามสุดคุ้ม เลือกแพ็กที่เหมาะกับคุณ",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "ราคาบริการดูดวง — REFFORTUNE",
    description: "เปรียบเทียบแพ็กเกจดูดวงออนไลน์ เริ่มต้น 45 บาท/คำถาม",
    url: "/pricing",
  },
};

const plans = [
  {
    name: "คำถามผ่านการสนทนา",
    price: "15 นาที : 189 บาท",
    detail: "เหมาะสำหรับผู้ที่มีหลายคำถาม หรือต้องการพื้นที่ปลอดภัยในการพูดคุยและปลดปล่อย",
  },
  {
    name: "คำถามผ่านการสนทนา",
    price: "30 นาที : 359 บาท",
    detail: "เจาะลึกประเด็นได้มากขึ้นต่อเนื่องในเซสชันเดียว",
  },
  {
    name: "คำถามผ่านการพิมพ์",
    price: "45 บาท / คำถาม",
    detail: "รับคำตอบที่ละเอียดและตรงประเด็น สามารถกลับมาทบทวนได้ทุกเมื่อ",
  },
  {
    name: "แพ็กคำถามผ่านการพิมพ์",
    price: "3 คำถาม 125 บาท • 5 คำถาม 195 บาท",
    detail: "คุ้มค่าสำหรับผู้ที่ต้องการถามต่อเนื่องหลายประเด็น",
  },
  {
    name: "คำถามเปรียบเทียบ",
    price: "85 บาท",
    detail: 'เช่น "เส้นทาง A กับ B จะนำพาฉันไปสู่อะไร?"',
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-white md:text-4xl">แพ็กเกจดูดวงออนไลน์กับเรฟ</h1>
      <p className="mt-2 text-sm text-slate-300">อัปเดตตามหน้าแพ็กเกจล่าสุดจาก REFFORTUNE</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {plans.map((plan, i) => (
          <article
            key={`${plan.name}-${i}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="text-sm text-amber-200">{plan.name}</p>
            <h2 className="mt-1 text-xl font-semibold text-white">{plan.price}</h2>
            <p className="mt-2 text-sm text-slate-300">{plan.detail}</p>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-amber-300/40 bg-amber-200/10 p-5">
        <p className="text-sm text-amber-100">ดูแพ็กเกจเต็มและอัปเดตล่าสุด</p>
        <a
          href="https://www.reffortune.com/packages.html"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-slate-900"
        >
          เปิดหน้าแพ็กเกจ REFFORTUNE
        </a>
      </div>
    </main>
  );
}
