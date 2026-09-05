import type { ContentRecommendation } from "@/lib/types";

const URGENCY_DOT: Record<ContentRecommendation["urgency"], string> = {
  high: "bg-amber-400",
  medium: "bg-sky-400",
  low: "bg-slate-600",
};

export function RecommendationCard({ item }: { item: ContentRecommendation }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-start gap-2">
        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${URGENCY_DOT[item.urgency]}`} />
        <div>
          <p className="text-sm text-slate-200">{item.idea}</p>
          <p className="mt-1 text-xs text-slate-500">{item.reason}</p>
          <p className="mt-2 text-[11px] text-slate-600">
            Related: #{item.relatedTrend} · Audience: {item.targetAudience} · Urgency: {item.urgency}
          </p>
        </div>
      </div>
    </div>
  );
}
