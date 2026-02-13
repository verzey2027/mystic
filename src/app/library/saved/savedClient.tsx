"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardDesc, CardTitle } from "@/components/ui/Card";
import { useLibrary } from "@/lib/library/useLibrary";
import { parseCardTokens } from "@/lib/tarot/engine";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function SavedClient() {
  const lib = useLibrary();

  return (
    <main className="mx-auto w-full max-w-lg px-5 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Saved</h1>
        <div className="flex gap-2">
          <Link href="/tarot" className="inline-flex">
            <Button>New Reading</Button>
          </Link>
          <Link href="/library" className="inline-flex">
            <Button variant="ghost">Library</Button>
          </Link>
        </div>
      </div>
      <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>รายการผลการเปิดไพ่ที่คุณบันทึกไว้</p>

      {lib.items.length === 0 ? (
        <Card className="mt-5 text-center">
          <CardTitle>No saved readings yet</CardTitle>
          <CardDesc className="mt-2">Go read some tarot cards and tap "Save" to keep them here.</CardDesc>
          <div className="mt-4 flex justify-center">
            <Link href="/tarot" className="inline-flex">
              <Button>Start Reading</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="mt-5 grid gap-3">
          {lib.items.map((r) => {
            const params = new URLSearchParams({
              count: String(r.count),
              cards: r.cardsToken,
            });
            if (r.question) params.set("question", r.question);

            return (
              <Card key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.15em]" style={{ color: "var(--text-subtle)" }}>Tarot • {r.count} cards</p>
                    <p className="mt-1 text-sm text-fg-muted">{formatDate(r.createdAt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => lib.remove(r.id)}
                    className="rounded-full border border-border px-3 py-1 text-xs text-fg-muted hover:bg-surface-2 hover:text-fg"
                  >
                    ลบ
                  </button>
                </div>

                {/* Card thumbnails */}
                {(() => {
                  const cards = parseCardTokens(r.cardsToken);
                  return cards.length > 0 ? (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {cards.map((dc) => (
                        <div
                          key={dc.card.id}
                          className="relative flex-shrink-0 overflow-hidden rounded-lg border"
                          style={{ width: "48px", height: "74px", borderColor: "var(--purple-200)" }}
                        >
                          {dc.card.image ? (
                            <Image
                              src={dc.card.image}
                              alt={dc.card.nameTh ?? dc.card.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-surface-2 text-xs">🔮</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : null;
                })()}

                {r.question ? (
                  <p className="mt-3 line-clamp-2 text-sm" style={{ color: "var(--text)" }}>Q: {r.question}</p>
                ) : (
                  <p className="mt-3 text-sm" style={{ color: "var(--text-subtle)" }}>No question</p>
                )}

                {r.aiSummary ? (
                  <p className="mt-2 line-clamp-3 text-sm" style={{ color: "var(--text-muted)" }}>{r.aiSummary}</p>
                ) : null}

                <div className="mt-4 flex gap-2">
                  <Link href={`/tarot/result?${params.toString()}`} className="inline-flex flex-1">
                    <Button className="w-full" variant="secondary">
                      View
                    </Button>
                  </Link>
                  <Link href="/tarot" className="inline-flex">
                    <Button variant="ghost">New</Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {lib.items.length > 0 ? (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => {
              if (confirm("ต้องการล้างรายการที่บันทึกไว้ทั้งหมดไหม?")) lib.clear();
            }}
            className="text-xs underline underline-offset-4 transition"
            style={{ color: "var(--text-subtle)" }}
          >
            Clear all
          </button>
        </div>
      ) : null}
    </main>
  );
}
