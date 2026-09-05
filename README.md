# Trend Radar — v1 proof (Udupi Krishna Janmashtami)

## What this is
A local, no-build, static dashboard that ranks Instagram Reels by **velocity and
acceleration**, normalized by the poster's follower count, instead of raw view
count. Fed with 8 manually-logged Reels for this demo. Purpose: something
concrete to show while doing creator/business outreach today — not a finished
product.

## Run it
No install needed.
```
open index.html          # macOS
xdg-open index.html      # Linux
# or just double-click it
```
For a URL you can share (recommended for outreach — some people won't open a
local file):
```
git init
git add .
git commit -m "v1: trend radar proof, dummy data"
git branch -M main
git remote add origin https://github.com/<your-username>/trend-radar.git
git push -u origin main
```
Then turn on **GitHub Pages** (repo → Settings → Pages → Deploy from branch →
`main` → `/root`). You'll get a live `https://<your-username>.github.io/trend-radar/`
link in a couple of minutes — that's what you send people, not a screenshot.

## Why the data is manual, not scraped or API-pulled — the feasibility check
Checked before building anything else, because this decides whether the whole
product is possible:

- **Instagram Basic Display API** — dead since Dec 2024. Not an option.
- **Instagram Graph API / Hashtag Search** — real, but capped at **30 unique
  hashtags per rolling 7 days per connected Business account**, returns only a
  snapshot of top/recent media (no historical view-count time series, no
  guaranteed play counts), and requires **Meta App Review** for the
  `Instagram Public Content Access` feature — realistically days to weeks to
  get approved, not available tonight.
- **Business Discovery** (peeking at another Business/Creator account's basic
  metrics) — also gated behind the same App Review.
- **Scraping public Reels** — against Instagram's ToS. Not the architecture,
  regardless of how many other tools quietly do it.
- **What *is* available immediately, legitimately**: an Instagram Business/
  Creator account can be added as an **Instagram Tester** on a Meta app in
  Development Mode — no App Review needed — and that account's *own* Reels
  Insights (reach, impressions, plays) become pullable via API right away.

**Conclusion:** you cannot legitimately get real-time trend data across
*other people's* Reels today without waiting on Meta's review process. You
*can* get a pilot creator's own performance data immediately, the moment they
agree to connect their account as a tester. That's why the honest v1 is:
manual/curated market-context data (what this demo uses) + a real pilot
creator's own connected Insights, not a scraper pretending to be real-time
market-wide intelligence.

## The math, in plain terms
For each Reel: `velocity = Δviews / Δhours` between the two most recent
snapshots. `acceleration` compares that to the *previous* interval's velocity
— is it speeding up or slowing down. Both get divided by the creator's
follower count, so a 6,500-follower account gaining 4,000 views/hr ranks
above a 210,000-follower account gaining the same raw number — the second
one hasn't actually broken out of its baseline. A recency half-life (~36
hours) keeps the board about "what's happening now," not a lifetime
leaderboard. No ML — this is deliberately simple; only reach for something
heavier if this stops being good enough in practice.

## Next real step (not tonight)
1. Talk to 3–5 people first — see the outreach note in chat.
2. If even one Janmashtami-adjacent creator/business will connect their
   Instagram Business account as a tester, replace `data.js` with a real
   `fetch()` to `graph.instagram.com` for *their* Reels insights — same
   `trend-engine.js`, same UI, real numbers for that one account.
3. Only chase the Hashtag Search API / App Review once a paying customer
   makes it worth the multi-week wait — not before.
