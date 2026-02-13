import Link from "next/link";

const spreads = [
  {
    count: 1,
    title: "1 ใบ — คำตอบเร็ว",
    description: "เหมาะกับการตัดสินใจทันทีในเรื่องที่กำลังค้างใจ",
    eta: "~ 1 นาที",
  },
  {
    count: 3,
    title: "3 ใบ — อดีต ปัจจุบัน อนาคต",
    description: "มองภาพรวมสถานการณ์ให้ครบ แล้ววาง action ที่ชัดขึ้น",
    eta: "~ 2 นาที",
  },
  {
    count: 10,
    title: "10 ใบ — ภาพใหญ่เชิงลึก",
    description: "เหมาะกับการวางแผนชีวิต งาน ความรัก หรือจุดเปลี่ยนสำคัญ",
    eta: "~ 4 นาที",
  },
];

export default function TarotHomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:py-12">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-200/90">Tarot Reading</p>
        <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">เลือกสเปรดที่เข้ากับคำถามของคุณ</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200 md:text-base">
          เริ่มจากเลือกจำนวนไพ่ → แตะเลือกไพ่ → อ่านผลคำทำนาย
          ออกแบบลำดับให้ไหลลื่นบนมือถือและใช้งานง่ายทุกขั้น
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {spreads.map((spread) => (
          <article key={spread.count} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-2.5 py-1 text-[11px] text-emerald-100">
              {spread.eta}
            </p>
            <h2 className="mt-3 text-lg font-semibold text-white">{spread.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{spread.description}</p>
            <Link
              href={`/tarot/pick?count=${spread.count}`}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-amber-300 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-200"
            >
              เริ่มเปิด {spread.count} ใบ
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
