import { Suspense } from "react";
import PickClient from "./PickClient";

export default function TarotPickPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-4xl px-4 py-10 text-sm text-fg-muted">
          กำลังเตรียมไพ่...
        </main>
      }
    >
      <PickClient />
    </Suspense>
  );
}
