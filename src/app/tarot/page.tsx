import Image from "next/image";
import Link from "next/link";

const spreads = [
  {
    count: 1,
    title: "1 ใบ — คำตอบเร็ว",
    description: "เหมาะกับการตัดสินใจทันทีในเรื่องที่กำลังค้างใจ",
    eta: "~ 1 นาที",
    icon: "✦",
  },
  {
    count: 3,
    title: "3 ใบ — อดีต ปัจจุบัน อนาคต",
    description: "มองภาพรวมสถานการณ์ให้ครบ แล้ววาง action ที่ชัดขึ้น",
    eta: "~ 2 นาที",
    icon: "✦✦✦",
  },
  {
    count: 10,
    title: "10 ใบ — ภาพใหญ่เชิงลึก",
    description: "เหมาะกับการวางแผนชีวิต งาน ความรัก หรือจุดเปลี่ยนสำคัญ",
    eta: "~ 4 นาที",
    icon: "✦✦✦✦✦",
  },
];

const steps = [
  { num: "01", label: "เลือกสเปรด", desc: "เลือกจำนวนไพ่ที่เหมาะกับคำถาม" },
  { num: "02", label: "เปิดไพ่", desc: "โฟกัสคำถามในใจ แล้วแตะเลือกไพ่" },
  { num: "03", label: "อ่านคำทำนาย", desc: "รับผลวิเคราะห์ AI พร้อมถามต่อได้" },
];

export default function TarotHomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 md:py-14">
      {/* ── Hero Section ── */}
      <section
        className="relative isolate overflow-hidden rounded-3xl border border-[var(--purple-700)]/40 p-6 md:p-10"
        style={{
          background:
            "linear-gradient(135deg, var(--purple-deep) 0%, var(--purple-900) 40%, var(--purple-800) 100%)",
          backgroundSize: "200% 200%",
          animation: "tarot-drift 12s ease-in-out infinite",
        }}
      >
        {/* Ambient glow orbs */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--purple-600)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--purple-500)" }}
        />

        {/* Shimmer overlay */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute -top-1/2 left-0 h-[200%] w-24 opacity-[0.07]"
            style={{
              background: "linear-gradient(90deg, transparent, white, transparent)",
              animation: "tarot-shimmer 4s ease-in-out infinite",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Text content */}
          <div className="max-w-xl">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.25em]"
              style={{ color: "var(--purple-300)" }}
            >
              Tarot Reading
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-white md:text-5xl">
              เปิดไพ่ทาโรต์
              <span className="block" style={{ color: "var(--purple-300)" }}>
                อ่านเส้นทางที่รออยู่
              </span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed md:text-base" style={{ color: "var(--purple-200)" }}>
              เลือกสเปรดที่เข้ากับคำถาม เปิดไพ่ด้วยสัญชาตญาณ
              แล้วรับคำทำนาย AI ที่นำไปใช้ได้จริง
            </p>
            <Link
              href="/tarot/pick?count=3"
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-bold transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
              style={{
                background: "var(--purple-500)",
                color: "#fff",
                boxShadow: "0 0 24px var(--purple-glow)",
              }}
            >
              เริ่มเปิดไพ่เลย
              <span className="text-base">→</span>
            </Link>
          </div>

          {/* Floating card imagery */}
          <div className="relative mx-auto h-56 w-48 shrink-0 md:mx-0 md:h-72 md:w-56">
            {/* Back card 1 — tilted left */}
            <div
              className="absolute left-0 top-4 h-44 w-28 overflow-hidden rounded-xl border shadow-2xl md:h-56 md:w-36"
              style={{
                borderColor: "var(--purple-700)",
                animation: "tarot-float 5s ease-in-out infinite",
                "--float-rotate": "-8deg",
                transform: "rotate(-8deg)",
                boxShadow: "0 8px 32px var(--purple-glow)",
              } as React.CSSProperties}
            >
              <Image
                src="https://www.reffortune.com/icon/backcard.png"
                alt="Tarot card back"
                fill
                sizes="144px"
                className="object-cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--purple-deep), transparent 60%)" }} />
            </div>

            {/* Back card 2 — tilted right, offset */}
            <div
              className="absolute right-0 top-0 h-44 w-28 overflow-hidden rounded-xl border shadow-2xl md:h-56 md:w-36"
              style={{
                borderColor: "var(--purple-600)",
                animation: "tarot-float 6s ease-in-out 0.8s infinite",
                "--float-rotate": "6deg",
                transform: "rotate(6deg)",
                boxShadow: "0 8px 32px var(--purple-glow)",
              } as React.CSSProperties}
            >
              <Image
                src="https://www.reffortune.com/icon/backcard.png"
                alt="Tarot card back"
                fill
                sizes="144px"
                className="object-cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--purple-deep), transparent 60%)" }} />
            </div>

            {/* Center card — front facing, slightly raised */}
            <div
              className="absolute left-1/2 top-6 h-44 w-28 -translate-x-1/2 overflow-hidden rounded-xl border-2 shadow-2xl md:h-56 md:w-36"
              style={{
                borderColor: "var(--purple-400)",
                animation: "tarot-float 4.5s ease-in-out 0.4s infinite",
                "--float-rotate": "0deg",
                zIndex: 10,
                boxShadow: "0 12px 48px var(--purple-glow-strong)",
              } as React.CSSProperties}
            >
              <Image
                src="https://www.reffortune.com/icon/backcard.png"
                alt="Tarot card"
                fill
                sizes="144px"
                className="object-cover"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--purple-deep), transparent 50%)" }} />
              <div
                className="absolute bottom-3 left-0 right-0 text-center text-[10px] font-semibold tracking-wider"
                style={{ color: "var(--purple-300)" }}
              >
                TAROT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="mt-10">
        <h2 className="text-center text-lg font-semibold text-white md:text-xl">
          เริ่มดูดวงใน <span style={{ color: "var(--purple-400)" }}>3 ขั้นตอน</span>
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="rounded-2xl border p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: "var(--purple-800)",
                background: "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(139,92,246,0.02))",
                animation: `tarot-fade-up 0.6s ease-out ${i * 0.15}s both`,
              }}
            >
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--purple-500)" }}
              >
                {step.num}
              </p>
              <h3 className="mt-2 text-sm font-semibold text-white">{step.label}</h3>
              <p className="mt-1 text-sm" style={{ color: "var(--purple-200)" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Spread Selection ── */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white md:text-2xl">เลือกสเปรด</h2>
        <p className="mt-1 text-sm" style={{ color: "var(--purple-300)" }}>
          เลือกจำนวนไพ่ตามเป้าหมายที่อยากรู้ตอนนี้
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {spreads.map((spread, i) => (
            <article
              key={spread.count}
              className="group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: "var(--purple-700)",
                background: "linear-gradient(160deg, rgba(139,92,246,0.08), rgba(13,10,26,0.95))",
                animation: `tarot-fade-up 0.6s ease-out ${0.1 + i * 0.12}s both`,
              }}
            >
              {/* Hover glow */}
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
                style={{ background: "var(--purple-500)" }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <p
                    className="inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium"
                    style={{
                      borderColor: "var(--purple-600)",
                      color: "var(--purple-300)",
                      background: "rgba(139,92,246,0.1)",
                    }}
                  >
                    {spread.eta}
                  </p>
                  <span
                    className="text-xs tracking-widest"
                    style={{ color: "var(--purple-500)" }}
                  >
                    {spread.icon}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-semibold text-white">{spread.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--purple-200)" }}>
                  {spread.description}
                </p>

                <Link
                  href={`/tarot/pick?count=${spread.count}`}
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                  style={{
                    background: "var(--purple-600)",
                    boxShadow: "0 0 16px var(--purple-glow)",
                  }}
                >
                  เริ่มเปิด {spread.count} ใบ
                  <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
