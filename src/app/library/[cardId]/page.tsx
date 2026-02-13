import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCardById, TAROT_DECK } from "@/lib/tarot/deck";

export function generateStaticParams() {
  return TAROT_DECK.map((card) => ({ cardId: card.id }));
}

export default async function TarotCardDetailPage({
  params,
}: {
  params: Promise<{ cardId: string }>;
}) {
  const { cardId } = await params;
  const card = getCardById(cardId);

  if (!card) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <Link
        href="/library"
        className="text-sm text-slate-300 underline-offset-2 hover:text-white hover:underline"
      >
        ← กลับห้องสมุด
      </Link>

      <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-amber-200/80">{card.id}</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{card.name}</h1>
        {card.nameTh ? <p className="mt-1 text-sm text-slate-400">{card.nameTh}</p> : null}
        {card.image ? (
          <Image
            src={card.image}
            alt={card.name}
            width={360}
            height={540}
            className="mt-4 w-full max-w-xs rounded-2xl border border-white/10 object-cover"
          />
        ) : null}

        <div className="mt-5 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-400">Arcana</p>
            <p className="mt-1 font-medium text-slate-100">{card.arcana}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-400">Number</p>
            <p className="mt-1 font-medium text-slate-100">{card.number}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-4">
            <h2 className="text-base font-semibold text-emerald-50">Upright</h2>
            <p className="mt-2 text-sm text-emerald-100">{card.meaningUpright}</p>
            <p className="mt-3 text-xs text-emerald-200/90">
              {card.keywordsUpright.join(" • ")}
            </p>
          </article>

          <article className="rounded-xl border border-rose-300/20 bg-rose-400/10 p-4">
            <h2 className="text-base font-semibold text-rose-50">Reversed</h2>
            <p className="mt-2 text-sm text-rose-100">{card.meaningReversed}</p>
            <p className="mt-3 text-xs text-rose-200/90">
              {card.keywordsReversed.join(" • ")}
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
