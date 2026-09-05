"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { TrendOverviewResult, CreatorOpportunityCategory } from "@/lib/types";
import { fetchTrendOverview } from "@/lib/api";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { CreatorOpportunityCard } from "@/components/cards/CreatorOpportunityCard";

const COLUMNS: { key: CreatorOpportunityCategory; label: string }[] = [
  { key: "create-now", label: "Create now" },
  { key: "emerging", label: "Emerging" },
  { key: "saturated", label: "Saturated" },
  { key: "business-opportunity", label: "Business opportunity" },
];

export function CreatorsContent() {
  const query = useSearchParams().get("q") ?? "Udupi Krishna Janmashtami";
  const [data, setData] = useState<TrendOverviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchTrendOverview(query).then(setData).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [query]);

  useEffect(load, [load]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-amber-500/80">Creator View</p>
        <h1 className="mt-1 font-serif text-3xl text-slate-50">Creator Opportunities</h1>
        <p className="mt-1 text-sm text-slate-500">For {query}</p>
      </header>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && data && data.creatorOpportunities.length === 0 && <EmptyState query={query} />}

      {!loading && !error && data && data.creatorOpportunities.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {COLUMNS.map((col) => {
            const items = data.creatorOpportunities.filter((c) => c.category === col.key);
            if (items.length === 0) return null;
            return (
              <div key={col.key}>
                <h2 className="mb-3 text-sm font-medium text-slate-400">{col.label}</h2>
                <div className="space-y-2.5">
                  {items.map((item, i) => (
                    <CreatorOpportunityCard key={i} item={item} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
