# Architecture

## HLD
```
Data Sources (manual log today / Instagram Insights later)
        ↓
DataProvider (Demo | Instagram — same interface)
        ↓
Trend Engine (velocity, acceleration, topics, spikes, opportunities)
        ↓
API route (/api/trend-overview)
        ↓
Frontend (landing → dashboard → creators/businesses)
```
No database, no queue, no worker process. Everything computes on request
from an in-memory array. That's the correct amount of infrastructure for
8 posts and zero users — see "When this needs to change" below.

## Frontend system design
```
app/                one route per surface (landing, dashboard, creators, businesses)
  api/               server-side data boundary — the ONLY place fetch() happens
lib/
  types.ts           the contract every layer agrees on
  trend-engine/       pure functions — no React, no fetch, no DOM. Unit-testable
                      in isolation, reusable if this ever moves to a worker/cron.
  data-providers/     swap point for real vs. demo data. UI code never imports
                      the dataset directly — only ever `getDataProvider()`.
  analytics/          one function every user action funnels through.
components/          presentation only — no data-fetching, no business logic.
```
The rule enforced by this layout: **UI components never compute a trend
score or decide what counts as a spike.** They render what `trend-engine`
already decided. If the scoring logic needs to change, it changes in one
place and every screen updates.

### Server state vs. client state
`fetch` happens client-side per page (`useEffect` + `useState`), not via
Next.js server components streaming data in. That's a deliberate simplicity
trade-off for tonight: real loading/error states are easy to demo, and the
data-provider swap doesn't require thinking about server/client component
boundaries yet. If this needs to scale past a demo, the natural next step is
React Query or Next's server components fetching directly — revisit when
there's a caching or waterfall problem to justify it, not before.

### What changes at 100,000 users, honestly
- Compute cost: trend scoring runs on every request right now. At scale,
  precompute on a schedule (cron/worker) and cache the result — the API
  route already isolates this, so the fix is inside one file.
  Not built tonight because there are 8 posts and 0 users.
- Fan-out: right now everyone hits one Node process. At real scale this is
  a CDN-cached read API in front of a periodically-refreshed cache — again,
  isolated behind `getDataProvider()`.
- None of this is built now. Building it now would be optimizing for a
  scale problem that doesn't exist yet, at the cost of shipping tonight.

## Trend math (Momentum Score, not an Instagram algorithm score)
For each post: `velocity = Δviews / Δhours` over the most recent interval.
`acceleration` compares that to the *previous* interval's velocity.
Both get divided by the creator's follower count, so a small account
breaking out of its own baseline outranks a big account posting its normal
numbers. A ~36-hour recency half-life keeps the board about "now," not a
lifetime leaderboard. This is deliberately simple statistics — the trigger
to reach for ML is when this stops correctly separating real spikes from
noise in practice, not because ML sounds more credible in a pitch.

Full formula and code: `lib/trend-engine/index.ts`.

## Instagram data feasibility (checked before building anything)
- **Basic Display API** — retired Dec 2024.
- **Hashtag Search API** — real, but capped at 30 hashtags/7 days per
  connected account, returns only a snapshot of top/recent media (no
  views-over-time), and requires Meta App Review (`Instagram Public Content
  Access`) — realistically days to weeks.
- **Business Discovery** (peeking at other accounts) — same App Review gate.
- **Scraping** — against ToS; not the architecture regardless of speed.
- **What works today, no review needed:** adding a real creator's Instagram
  Business/Creator account as an "Instagram Tester" on a dev-mode Meta app.
  Their *own* Reels Insights become pullable immediately.

**Conclusion baked into the architecture:** `DataProvider` is an interface
specifically so the honest path — demo data now, one pilot creator's real
account next, hashtag-wide data only after a paying customer justifies the
App Review wait — never requires touching the UI. See
`lib/data-providers/instagram-data-provider.ts` for the exact integration
steps when a pilot is ready.

## AI — where it's planned, and where it's deliberately absent
- **Absent now:** content recommendations, trend explanations, and
  suggested actions are all rule-based (`lib/trend-engine`). No LLM call in
  this build. Reason: the rules are legible, free, instant, and good enough
  to demo — adding an LLM call here tonight would be decoration, not value.
- **Planned, scoped narrowly:** replacing the *text generation* for
  `explanation`/`suggestedAction` with an LLM call once there's a real
  reason (e.g., the rule-based phrasing doesn't generalize past 8 sample
  posts). The scoring math itself (velocity/acceleration) stays
  deterministic — an LLM has no business deciding what "accelerating"
  means; it can only help explain a number a formula already computed.
