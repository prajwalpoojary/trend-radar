# Product

## Customer
- **Primary (initial):** small/independent Instagram creators posting
  Janmashtami-adjacent content who are getting attention but don't have a
  system for deciding what to post next.
- **Secondary:** local hospitality/food businesses in coastal Karnataka who
  could act on the same signals commercially.
- **Not yet a customer, just audience:** general public interested in
  Janmashtami/Udupi content. Don't build for this group yet.

## Problem
Creators can see their own post's numbers, but not whether those numbers
mean "this is actually breaking out" versus "this is normal for my
account." They also can't easily see what's accelerating *around* their
niche while it's still early enough to act on.

## Value proposition (hypothesis, not validated)
"We tell you what's actually accelerating right now — not just what has the
most views — and what you could reasonably do about it before the moment
passes."

## MVP scope
**Must have (built):** momentum/velocity scoring normalized by account size,
spike detection, topic aggregation, opportunity + recommendation surfaces,
demo/real data separation, honest empty state for out-of-scope queries.

**Useful later:** a real pilot creator's connected account data, saved
searches, notifications when a new spike crosses a threshold.

**Nice to have:** LLM-generated explanations/recommendations, multi-topic
tracking, comparison across creators.

**Explicitly not now:** auth, persistent accounts, billing, hashtag-wide
live search, any ML model. Building these before a paying customer exists
would be optimizing for a scale/sophistication problem this product doesn't
have yet.

## Assumptions this product is currently resting on
- Creators can articulate the difference between "I got views" and "I don't
  know if I should post something similar again" — unconfirmed.
- Follower-normalized velocity is a better proxy for "worth acting on" than
  raw views, for this audience — directionally reasoned, not tested.
- At least one local creator/business will find the opportunity/business
  view compelling enough to want deeper access — unconfirmed, this is the
  riskiest one.

## Future direction
Validate with real conversations and a real pilot account before adding
anything on the "not now" list. See ARCHITECTURE.md's roadmap section for
the technical sequencing that mirrors this.
