import { Suspense } from "react";
import ResultClient from "./ResultClient";

export default function TarotResultPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-4xl px-4 py-10 text-sm text-fg-muted">
          กำลังประมวลผลคำทำนาย...
        </main>
      }
    >
      <ResultClient />
    </Suspense>
  );
}
