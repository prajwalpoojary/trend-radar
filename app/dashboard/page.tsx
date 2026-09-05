import { Suspense } from "react";
import { DashboardContent } from "./DashboardContent";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-6 py-10 text-slate-500">Loading…</div>}>
      <DashboardContent />
    </Suspense>
  );
}
