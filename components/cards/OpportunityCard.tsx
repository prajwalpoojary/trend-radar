import type { Opportunity } from "@/lib/types";

const URGENCY_STYLE: Record<Opportunity["urgency"], string> = {
  high: "text-amber-300 border-amber-700/50 bg-amber-900/30",
  medium: "text-sky-300 border-sky-700/50 bg-sky-900/30",
  low: "text-slate-400 border-slate-700 bg-slate-900/40",
};

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-100">Opportunity detected — {opportunity.title}</p>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] ${URGENCY_STYLE[opportunity.urgency]}`}>
          {opportunity.urgency} urgency
        </span>
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        <div>
          <dt className="text-xs text-slate-500">What is happening</dt>
          <dd className="text-slate-300">{opportunity.whatIsHappening}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Why it matters</dt>
          <dd className="text-slate-300">{opportunity.whyItMatters}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Possible action</dt>
          <dd className="text-slate-300">{opportunity.possibleAction}</dd>
        </div>
      </dl>
      <p className="mt-3 text-[11px] text-slate-600">
        Inference, not a guarantee — confidence: {opportunity.confidence}. Based on {opportunity.kind === "content" ? "content" : "business"}-side
        signals only.
      </p>
    </div>
  );
}
