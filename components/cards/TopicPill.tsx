"use client";

import type { Topic } from "@/lib/types";

export function TopicPill({ topic, active, onClick }: { topic: Topic; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "border-amber-500 bg-amber-500/10 text-amber-300"
          : "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-slate-700"
      }`}
    >
      #{topic.name} <span className="text-slate-500">· {topic.itemCount}</span>
    </button>
  );
}
