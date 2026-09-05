import { Suspense } from "react";
import { BusinessesContent } from "./BusinessesContent";

export default function BusinessesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-6 py-10 text-slate-500">Loading…</div>}>
      <BusinessesContent />
    </Suspense>
  );
}
