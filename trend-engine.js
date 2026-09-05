// trend-engine.js — LOGIC LAYER
//
// Deliberately NOT "rank by total views." A reel with 100k views that has
// gone flat is less interesting right now than one that just went 900 -> 46k
// in 18 hours. This module scores "is this accelerating, right now, faster
// than this account's own size would predict" — nothing fancier than that.
// No ML. If simple stats stop being good enough, that's the trigger to
// reach for something heavier — not before.

function intervalVelocities(snapshots) {
  const velocities = [];
  for (let i = 1; i < snapshots.length; i++) {
    const dHours = snapshots[i].hour - snapshots[i - 1].hour;
    const dViews = snapshots[i].views - snapshots[i - 1].views;
    velocities.push(dHours > 0 ? dViews / dHours : 0);
  }
  return velocities;
}

function recencyWeight(postedAt) {
  const ageHours = (Date.now() - new Date(postedAt).getTime()) / 36e5;
  // Half-life of ~36 hours: a post from right now is worth 1x, a post from
  // 36 hours ago is worth ~0.5x, purely because "what's happening now" is
  // the product's job — not a judgment on the content's quality.
  return Math.pow(0.5, Math.max(ageHours, 0) / 36);
}

function scoreReel(reel) {
  const velocities = intervalVelocities(reel.snapshots);
  const latestVelocity = velocities[velocities.length - 1] || 0;
  const priorVelocity = velocities[velocities.length - 2] || 0;
  const acceleration = latestVelocity - priorVelocity;

  const totalViews = reel.snapshots[reel.snapshots.length - 1].views;
  const normalizedVelocity = latestVelocity / Math.max(reel.followers, 1);
  const reachRatio = totalViews / Math.max(reel.followers, 1);

  // If it's still speeding up, boost the score; if it's slowing down, damp it.
  // Clamped so one weird divide-by-tiny-number can't blow up the ranking.
  let accelerationMultiplier = 1;
  if (priorVelocity > 0) {
    accelerationMultiplier = Math.min(Math.max(latestVelocity / priorVelocity, 0.4), 2.5);
  } else if (latestVelocity > 0) {
    accelerationMultiplier = 1.8; // went from ~0 to something: brand new spike
  }

  const weight = recencyWeight(reel.postedAt);
  const trendScore = normalizedVelocity * accelerationMultiplier * weight * 1000;

  let status = "steady";
  if (priorVelocity === 0 && latestVelocity > 0) status = "new spike";
  else if (acceleration > priorVelocity * 0.15) status = "accelerating";
  else if (acceleration < -priorVelocity * 0.15) status = "cooling";

  return {
    ...reel,
    totalViews,
    latestVelocity: Math.round(latestVelocity),
    acceleration: Math.round(acceleration),
    normalizedVelocity,
    reachRatio,
    status,
    trendScore,
  };
}

function rankReels(reels) {
  return reels.map(scoreReel).sort((a, b) => b.trendScore - a.trendScore);
}

function explainTrend(scored) {
  const reachMultiple = scored.reachRatio.toFixed(1);
  const parts = [];

  if (scored.status === "new spike") {
    parts.push(`Went from near-zero to ${scored.latestVelocity.toLocaleString()} views/hr in its latest window — a fresh spike, not a slow burn.`);
  } else if (scored.status === "accelerating") {
    parts.push(`Still speeding up: velocity rose from the prior window to ${scored.latestVelocity.toLocaleString()} views/hr now.`);
  } else if (scored.status === "cooling") {
    parts.push(`Was moving faster before — velocity has dropped to ${scored.latestVelocity.toLocaleString()} views/hr and is decelerating.`);
  } else {
    parts.push(`Growing at a steady ${scored.latestVelocity.toLocaleString()} views/hr, no sharp acceleration either way.`);
  }

  if (scored.reachRatio > 1.5) {
    parts.push(`It's reached ${reachMultiple}x this account's follower count — a sign it's traveling beyond ${scored.creator}'s own audience (hashtag/Explore pickup), not just being seen by existing followers.`);
  } else {
    parts.push(`Reach is still mostly within ${scored.creator}'s own follower base (${reachMultiple}x followers) — hasn't broken out via hashtags/Explore yet.`);
  }

  return parts.join(" ");
}

function recommendAction(scored) {
  const text = (scored.caption + " " + scored.hashtags.join(" ")).toLowerCase();
  if (scored.status === "cooling") {
    return "Let it ride — don't clone it now. Log what worked (hook, timing, topic) for the next similar moment instead of chasing a fading spike.";
  }
  if (text.includes("kid") || text.includes("baby") || text.includes("cute")) {
    return "Family/kids-in-costume content is the accelerant here. A business angle: partner with a local costume/prop rental or photographer and offer a simple 'dress your child as Krishna' package tied to this weekend.";
  }
  if (text.includes("recipe") || text.includes("sweet") || text.includes("payasa") || text.includes("food")) {
    return "Food content is spiking. A business angle: a small home-kitchen or catering account could post a same-day 'order this today' story with a simple prepaid-slot link, riding the recipe reel's audience while it's still hot.";
  }
  if (text.includes("temple") || text.includes("mutt") || text.includes("crowd") || text.includes("timelapse")) {
    return "Devotional/temple footage is what's traveling furthest beyond the poster's own audience. A business angle: local hospitality (homestays, prasadam delivery, parking/darshan-queue info) can piggyback with a helpful, non-salesy reply or duet.";
  }
  if (text.includes("dahi") || text.includes("handi") || text.includes("dance") || text.includes("event")) {
    return "Live-event content is accelerating. Post short vertical clips from tonight's event within the hour — same-day event footage is outperforming anything posted more than a day ago in this set.";
  }
  return "Still early — worth a similar angle today while it's accelerating, rather than a generic Janmashtami post.";
}

// Exposed for the UI layer and for future unit tests.
window.TrendEngine = { scoreReel, rankReels, explainTrend, recommendAction };
