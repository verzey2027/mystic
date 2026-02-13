import { Suspense } from "react";
import SavedClient from "./savedClient";

export default function SavedReadingsPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-fg-muted">
          กำลังโหลด…
        </main>
      }
    >
      <SavedClient />
    </Suspense>
  );
}
