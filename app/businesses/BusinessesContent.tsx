"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { TrendOverviewResult } from "@/lib/types";
import { fetchTrendOverview } from "@/lib/api";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { BusinessOpportunityCard } from "@/components/cards/BusinessOpportunityCard";

export function BusinessesContent() {
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
        <p className="text-xs uppercase tracking-widest text-amber-500/80">Business View</p>
        <h1 className="mt-1 font-serif text-3xl text-slate-50">Business Opportunities</h1>
        <p className="mt-1 text-sm text-slate-500">For {query} — trend → audience interest → potential intent → opportunity</p>
      </header>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && data && data.businessOpportunities.length === 0 && <EmptyState query={query} />}

      {!loading && !error && data && data.businessOpportunities.length > 0 && (
        <div className="space-y-4">
          {data.businessOpportunities.map((b) => (
            <BusinessOpportunityCard key={b.sector} item={b} />
          ))}
        </div>
      )}
    </main>
  );
}
