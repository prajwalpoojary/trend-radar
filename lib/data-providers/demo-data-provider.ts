import type { DataProvider, TrendOverviewResult } from "@/lib/types";
import { JANMASHTAMI_DEMO_DATA } from "@/lib/data-providers/demo-dataset";
import {
  scoreAll,
  buildTopics,
  detectSpikes,
  deriveOpportunities,
  deriveCreatorOpportunities,
  deriveBusinessOpportunities,
  deriveRecommendations,
  overallScoreFrom,
} from "@/lib/trend-engine";

export class DemoDataProvider implements DataProvider {
  async getTrendOverview(query: string): Promise<TrendOverviewResult> {
    // Simulated latency so the loading state is real, not decorative.
    await new Promise((r) => setTimeout(r, 350));

    const scored = scoreAll(JANMASHTAMI_DEMO_DATA);
    const topics = buildTopics(scored);
    const spikes = detectSpikes(scored);
    const opportunities = deriveOpportunities(scored, topics);
    const creatorOpportunities = deriveCreatorOpportunities(scored);
    const businessOpportunities = deriveBusinessOpportunities(scored);
    const recommendations = deriveRecommendations(scored, topics);

    return {
      query,
      generatedAt: new Date().toISOString(),
      sourceType: "demo",
      overallScore: overallScoreFrom(scored),
      topics,
      content: scored,
      spikes,
      opportunities,
      creatorOpportunities,
      businessOpportunities,
      recommendations,
      dataQualityNote:
        "Demo mode: 8 manually-logged sample posts, not a live Instagram feed. Numbers are internally consistent (the math is real) but the underlying posts are sample data, clearly separate from anything pulled from a real account.",
    };
  }
}
