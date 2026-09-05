# Trend Radar — v2 (working product, demo mode)

Momentum, spike detection, and opportunity signals for social content — first
case study: **Udupi Krishna Janmashtami**. Built for creators and local
businesses to answer three questions: what's happening, why, and what to do
about it.

This is the actual product shell (Next.js/TypeScript/Tailwind), not the
single-file HTML proof from v1. Same trend math, real routing, real
loading/error/empty states, and a documented boundary for plugging in live
Instagram data later.

## Quickstart
```bash
npm install
npm run dev     # http://localhost:3000
```
No environment variables or API keys are required to run in demo mode
(the default).

## What's real vs. demo right now
- **Real:** the trend-scoring math (`lib/trend-engine`), the app architecture,
  the UI, the API route, the data-provider abstraction.
- **Demo:** the underlying 8 posts (`lib/data-providers/demo-dataset.ts`) —
  manually logged for this case study, not pulled from a live Instagram feed.
  See `ARCHITECTURE.md` for exactly why, and what's required to change that.

Every number in the UI is labeled **Observed**, **Derived**, or **Demo /
Estimated** — see `DataQualityBadge`. Nothing claims to be live Instagram
analytics.

## Structure
```
app/
  page.tsx                  landing page (search: "What are you tracking?")
  dashboard/                 overview: score, momentum, topics, content, spikes, opportunities, recommendations
  creators/                  Creator View — Create Now / Emerging / Saturated / Business Opportunity
  businesses/                 Business View — trend → audience interest → opportunity chains
  api/trend-overview/        the only place pages fetch data from

lib/
  types.ts                   shared contracts (ContentItem, ScoredContent, Opportunity, ...)
  trend-engine/               pure scoring/derivation functions (no React, no I/O — testable standalone)
  data-providers/             DemoDataProvider (active) + InstagramDataProvider (documented stub)
  api/                        thin client fetch wrapper
  analytics/                  track() event stub (search, trend_opened, opportunity_opened, recommendation_viewed, cta_clicked)

components/
  charts/  MomentumChart (inline SVG, no charting library)
  cards/   ContentCard, TopicPill, SpikeAlert, OpportunityCard, CreatorOpportunityCard, BusinessOpportunityCard, RecommendationCard
  ui/      DataQualityBadge, StatusPill, LoadingState/ErrorState/EmptyState
  navigation/ NavBar
```

## Data sources
See `ARCHITECTURE.md` → "Instagram data feasibility" for the full investigation.
Short version: no legitimate API today gives real-time trend data across
*other people's* Reels without weeks of Meta App Review. What *is* available
immediately is a pilot creator's own Reels Insights, once they connect their
account as a tester. `lib/data-providers/instagram-data-provider.ts`
documents exactly how to wire that in — no other file needs to change.

## Limitations (stated plainly, not hidden)
- 8 sample posts, one case study, one language of hashtags.
- Momentum score is a deliberately simple statistical formula, not ML —
  see `ARCHITECTURE.md` for the reasoning and when that would need to change.
- Search is scoped to Udupi/Krishna/Janmashtami keywords; anything else
  correctly returns an empty state rather than fabricated results.
- No auth, no persistence, no real analytics sink — all out of scope for v1
  by design (see priority order in the build brief).
- Content recommendations are rule-based, not LLM-generated, on purpose —
  see `PRODUCT.md` for where AI is planned to add real value vs. decoration.

## Roadmap (not committed, just the honest next steps)
1. Get 3–5 real creators/businesses to react to this — see outreach plan.
2. If one will connect their account as an Instagram tester, replace
   `DemoDataProvider` with a real `InstagramDataProvider` implementation for
   *their* account only. No UI changes required.
3. Only pursue Hashtag Search API + App Review once a paying customer makes
   the multi-week wait worth it.
4. Replace the rule-based recommendation text with an LLM call once there's
   evidence the rules aren't good enough on their own.
