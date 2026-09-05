import type { BusinessOpportunity } from "@/lib/types";

export function BusinessOpportunityCard({ item }: { item: BusinessOpportunity }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
      <p className="text-sm font-medium text-slate-100">{item.sector}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
        {item.trendChain.map((step, i) => (
          <span key={step} className="flex items-center gap-1.5">
            <span className="rounded-md border border-slate-800 bg-slate-950 px-2 py-1">{step}</span>
            {i < item.trendChain.length - 1 && <span className="text-slate-700">→</span>}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-400">{item.reasoning}</p>
      <p className="mt-2 text-[11px] text-slate-600">Unvalidated hypothesis — confidence: {item.confidence}. Treat as a lead to test, not a forecast.</p>
    </div>
  );
}
