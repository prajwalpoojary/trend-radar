"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import type { TrendOverviewResult } from "@/lib/types";
import { fetchTrendOverview } from "@/lib/api";
import { track } from "@/lib/analytics";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/States";
import { MomentumChart } from "@/components/charts/MomentumChart";
import { TopicPill } from "@/components/cards/TopicPill";
import { ContentCard } from "@/components/cards/ContentCard";
import { SpikeAlert } from "@/components/cards/SpikeAlert";
import { OpportunityCard } from "@/components/cards/OpportunityCard";
import { RecommendationCard } from "@/components/cards/RecommendationCard";
import { StatusPill } from "@/components/ui/StatusPill";

export function DashboardContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "Udupi Krishna Janmashtami";

  const [data, setData] = useState<TrendOverviewResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchTrendOverview(query)
      .then((res) => {
        setData(res);
        setSelectedId(res.content[0]?.id ?? null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(() => {
    track({ name: "search", query });
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const filteredContent = useMemo(() => {
    if (!data) return [];
    if (!activeTopic) return data.content;
    return data.content.filter((c) => c.hashtags.some((h) => h.replace("#", "") === activeTopic));
  }, [data, activeTopic]);

  const momentumPoints = useMemo(() => {
    if (!data || data.content.length === 0) return [];
    const hours = [...new Set(data.content.flatMap((c) => c.snapshots.map((s) => s.hour)))].sort((a, b) => a - b);
    return hours.map((hour) => ({
      hour,
      value: data.content.reduce((sum, c) => sum + (c.snapshots.find((s) => s.hour === hour)?.views ?? 0), 0),
    }));
  }, [data]);

  const selected = data?.content.find((c) => c.id === selectedId) ?? null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-amber-500/80">Trend Intelligence</p>
        <h1 className="mt-1 font-serif text-3xl text-slate-50">{query}</h1>
      </header>

      {loading && <LoadingState />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && data && data.content.length === 0 && <EmptyState query={query} />}

      {!loading && !error && data && data.content.length > 0 && (
        <div className="space-y-10">
          {/* TREND SCORE + MOMENTUM */}
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-[160px_1fr]">
            <div className="flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <div className="font-serif text-5xl text-amber-400">{data.overallScore}</div>
              <div className="mt-1 text-xs text-slate-500">/ 100 trend score</div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <p className="mb-3 text-sm text-slate-400">Momentum — combined activity across tracked posts</p>
              <MomentumChart points={momentumPoints} label="Combined view activity over time" />
            </div>
          </section>

          {/* TRENDING TOPICS */}
          <section>
            <h2 className="mb-3 text-sm font-medium text-slate-400">Trending topics</h2>
            <div className="flex flex-wrap gap-2">
              {data.topics.map((t) => (
                <TopicPill
                  key={t.name}
                  topic={t}
                  active={activeTopic === t.name}
                  onClick={() => {
                    const next = activeTopic === t.name ? null : t.name;
                    setActiveTopic(next);
                    if (next) track({ name: "trend_opened", topic: next });
                  }}
                />
              ))}
            </div>
          </section>

          {/* SPIKE DETECTION */}
          {data.spikes.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-slate-400">Spike detection</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {data.spikes.slice(0, 2).map((s) => (
                  <SpikeAlert key={s.contentId} spike={s} />
                ))}
              </div>
            </section>
          )}

          {/* TRENDING CONTENT + DETAIL */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="mb-3 text-sm font-medium text-slate-400">Trending content</h2>
              <div className="space-y-2.5">
                {filteredContent.map((item, i) => (
                  <ContentCard key={item.id} item={item} rank={i + 1} onOpen={() => setSelectedId(item.id)} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-3 text-sm font-medium text-slate-400">Why it's ranked here</h2>
              {selected ? (
                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-100">{selected.creator}</p>
                    <StatusPill status={selected.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-400">&quot;{selected.caption}&quot;</p>
                  <p className="mt-4 text-sm text-slate-300">{selected.explanation}</p>
                  <div className="mt-4 rounded-md border border-amber-800/40 bg-amber-950/20 p-3">
                    <p className="text-xs text-amber-400">Suggested next move</p>
                    <p className="mt-1 text-sm text-slate-200">{selected.suggestedAction}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600">Select a post to see the reasoning.</p>
              )}
            </div>
          </section>

          {/* OPPORTUNITY */}
          {data.opportunities.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-slate-400">Opportunity</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {data.opportunities.map((o) => (
                  <div key={o.id} onClick={() => track({ name: "opportunity_opened", opportunityId: o.id })}>
                    <OpportunityCard opportunity={o} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CONTENT INTELLIGENCE */}
          {data.recommendations.length > 0 && (
            <section>
              <h2 className="mb-1 text-sm font-medium text-slate-400">What should you create next?</h2>
              <p className="mb-3 text-xs text-slate-600">Deterministic, rule-based for now — see README for where an LLM plugs in.</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {data.recommendations.map((r) => (
                  <div key={r.idea} onClick={() => track({ name: "recommendation_viewed", idea: r.idea })}>
                    <RecommendationCard item={r} />
                  </div>
                ))}
              </div>
            </section>
          )}

          <footer className="border-t border-slate-800 pt-6 text-xs text-slate-600">{data.dataQualityNote}</footer>
        </div>
      )}
    </main>
  );
}
