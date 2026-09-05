import type { TrendOverviewResult } from "@/lib/types";

export async function fetchTrendOverview(query: string): Promise<TrendOverviewResult> {
  const res = await fetch(`/api/trend-overview?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}
