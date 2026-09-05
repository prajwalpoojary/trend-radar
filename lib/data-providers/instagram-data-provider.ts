import type { DataProvider, TrendOverviewResult } from "@/lib/types";

/**
 * Real data path — intentionally NOT implemented tonight.
 *
 * Why: Instagram's Basic Display API is dead (Dec 2024). The Hashtag Search
 * API can do arbitrary-hashtag lookups, but only after Meta App Review
 * (Instagram Public Content Access), capped at 30 hashtags/7 days per
 * connected account, and returns a snapshot of top/recent media — not a
 * views time-series, so it can't feed this same velocity/acceleration math
 * without repeated polling of your own building.
 *
 * What DOES work without App Review: adding a real creator's Instagram
 * Business/Creator account as an "Instagram Tester" on this app in
 * Development Mode. That account's OWN Reels Insights (reach, impressions,
 * plays) become pullable immediately. That's the realistic first real
 * integration — one pilot creator's own account, not the open hashtag feed.
 *
 * When that pilot exists, implement `getTrendOverview` here by:
 *   1. Exchanging the tester's long-lived access token (server-side only).
 *   2. Calling GET /{ig-media-id}/insights for their recent Reels.
 *   3. Mapping the response into ContentItem[] (see demo-dataset.ts for the shape).
 *   4. Running the same `lib/trend-engine` functions — no UI or scoring code changes.
 */
export class InstagramDataProvider implements DataProvider {
  async getTrendOverview(_query: string): Promise<TrendOverviewResult> {
    throw new Error(
      "InstagramDataProvider is not implemented yet. It requires a connected Instagram " +
        "Business/Creator tester account (own-account Insights) or Meta App Review " +
        "(hashtag search, multi-week). See lib/data-providers/instagram-data-provider.ts for the plan."
    );
  }
}
