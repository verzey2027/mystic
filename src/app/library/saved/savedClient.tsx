"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardDesc, CardTitle } from "@/components/ui/Card";
import { useLibrary } from "@/lib/library/useLibrary";

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
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-fg md:text-4xl">คลังของฉัน</h1>
          <p className="mt-2 text-sm text-fg-muted">รายการผลการเปิดไพ่ที่คุณบันทึกไว้ในเครื่องนี้</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tarot" className="inline-flex">
            <Button>ไปเปิดไพ่</Button>
          </Link>
          <Link href="/library" className="inline-flex">
            <Button variant="ghost">ดูห้องสมุดไพ่</Button>
          </Link>
        </div>
      </div>

      {lib.items.length === 0 ? (
        <Card className="mt-6 text-center">
          <CardTitle>ยังไม่มีรายการที่บันทึกไว้</CardTitle>
          <CardDesc className="mt-2">ไปเปิดไพ่ แล้วกด “บันทึกผลนี้” เพื่อเก็บไว้กลับมาอ่านได้</CardDesc>
          <div className="mt-4 flex justify-center">
            <Link href="/tarot" className="inline-flex">
              <Button>ไปเปิดไพ่</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                    <p className="text-[11px] uppercase tracking-[0.2em] text-fg-subtle">Tarot • {r.count} ใบ</p>
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

                {r.question ? (
                  <p className="mt-3 line-clamp-2 text-sm text-fg">คำถาม: {r.question}</p>
                ) : (
                  <p className="mt-3 text-sm text-fg-muted">ไม่มีคำถาม</p>
                )}

                {r.aiSummary ? (
                  <p className="mt-2 line-clamp-3 text-sm text-fg-muted">สรุป: {r.aiSummary}</p>
                ) : null}

                <div className="mt-4 flex gap-2">
                  <Link href={`/tarot/result?${params.toString()}`} className="inline-flex flex-1">
                    <Button className="w-full" variant="secondary">
                      ดูผล
                    </Button>
                  </Link>
                  <Link href="/tarot" className="inline-flex">
                    <Button variant="ghost">เปิดใหม่</Button>
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
            className="text-xs text-fg-muted underline underline-offset-4 hover:text-fg"
          >
            ล้างทั้งหมด
          </button>
        </div>
      ) : null}
    </main>
  );
}
