"use client";

import type { ScoredContent } from "@/lib/types";
import { StatusPill } from "@/components/ui/StatusPill";
import { DataQualityBadge } from "@/components/ui/DataQualityBadge";

export function ContentCard({ item, rank, onOpen }: { item: ScoredContent; rank: number; onOpen: () => void }) {
  const posted = new Date(item.postedAt);
  return (
    <button
      onClick={onOpen}
      className="w-full rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-left transition hover:border-slate-700 hover:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono text-slate-600">#{rank}</span>
            <span>{item.creator}</span>
            <span>·</span>
            <span>{posted.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <p className="mt-1 truncate text-sm text-slate-200">{item.caption}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="font-serif text-xl text-amber-400">{item.momentumScore}</div>
          <div className="text-[10px] text-slate-500">momentum score</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusPill status={item.status} />
        <DataQualityBadge quality={item.sourceType === "demo" ? "estimated" : "observed"} />
        <span className="text-xs text-slate-500">{item.latestVelocity.toLocaleString("en-IN")} views/hr now</span>
        <span className="text-xs text-slate-500">·</span>
        <span className="text-xs text-slate-500">{item.reachRatio.toFixed(1)}x followers reach</span>
      </div>
    </button>
  );
}
