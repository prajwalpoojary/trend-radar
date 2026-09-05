import type { CreatorOpportunity } from "@/lib/types";

const CATEGORY_LABEL: Record<CreatorOpportunity["category"], string> = {
  "create-now": "Create now",
  emerging: "Emerging",
  saturated: "Saturated",
  "business-opportunity": "Business opportunity",
};

const CATEGORY_STYLE: Record<CreatorOpportunity["category"], string> = {
  "create-now": "border-amber-700/50 bg-amber-950/20",
  emerging: "border-sky-700/50 bg-sky-950/20",
  saturated: "border-slate-700 bg-slate-900/40",
  "business-opportunity": "border-emerald-700/50 bg-emerald-950/20",
};

export function CreatorOpportunityCard({ item }: { item: CreatorOpportunity }) {
  return (
    <div className={`rounded-lg border p-4 ${CATEGORY_STYLE[item.category]}`}>
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{CATEGORY_LABEL[item.category]}</p>
      <p className="mt-1 text-sm text-slate-200">{item.topic}</p>
      <p className="mt-2 text-xs text-slate-500">{item.reasoning}</p>
    </div>
  );
}
