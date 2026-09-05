import { Suspense } from "react";
import { CreatorsContent } from "./CreatorsContent";

export default function CreatorsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-6 py-10 text-slate-500">Loading…</div>}>
      <CreatorsContent />
    </Suspense>
  );
}
