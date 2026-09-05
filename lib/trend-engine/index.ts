import type {
  ContentItem,
  ScoredContent,
  Snapshot,
  MomentumStatus,
  Topic,
  SpikeEvent,
  Opportunity,
  CreatorOpportunity,
  BusinessOpportunity,
  ContentRecommendation,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// WHY THIS EXISTS: ranking by total views rewards big accounts and old posts.
// "Trending" should mean accelerating relative to what this account normally
// gets, right now — not "has accumulated the most views ever." Everything
// below is deliberately simple statistics, not ML. The trigger to reach for
// something heavier is when this stops correctly separating real spikes from
// noise in practice — not before, and not because ML sounds more impressive.
// ---------------------------------------------------------------------------

function intervalVelocities(snapshots: Snapshot[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < snapshots.length; i++) {
    const dHours = snapshots[i].hour - snapshots[i - 1].hour;
    const dViews = snapshots[i].views - snapshots[i - 1].views;
    out.push(dHours > 0 ? dViews / dHours : 0);
  }
  return out;
}

function recencyWeight(postedAt: string, now: number): number {
  const ageHours = (now - new Date(postedAt).getTime()) / 36e5;
  // ~36 hour half-life: a post from right now is worth 1x, one from 36h ago
  // is worth ~0.5x. This is a product choice ("what's happening now" is the
  // job), not a claim about content quality.
  return Math.pow(0.5, Math.max(ageHours, 0) / 36);
}

export function scoreContent(item: ContentItem, now: number = Date.now()): ScoredContent {
  const velocities = intervalVelocities(item.snapshots);
  const latestVelocity = velocities[velocities.length - 1] ?? 0;
  const priorVelocity = velocities[velocities.length - 2] ?? 0;
  const acceleration = latestVelocity - priorVelocity;

  const totalViews = item.snapshots[item.snapshots.length - 1]?.views ?? 0;
  const normalizedVelocity = latestVelocity / Math.max(item.followers, 1);
  const reachRatio = totalViews / Math.max(item.followers, 1);

  let accelerationMultiplier = 1;
  if (priorVelocity > 0) {
    accelerationMultiplier = Math.min(Math.max(latestVelocity / priorVelocity, 0.4), 2.5);
  } else if (latestVelocity > 0) {
    accelerationMultiplier = 1.8;
  }

  const weight = recencyWeight(item.postedAt, now);
  const momentumScore = Math.round(normalizedVelocity * accelerationMultiplier * weight * 1000 * 10) / 10;

  let status: MomentumStatus = "steady";
  if (priorVelocity === 0 && latestVelocity > 0) status = "new-spike";
  else if (acceleration > priorVelocity * 0.15) status = "accelerating";
  else if (acceleration < -priorVelocity * 0.15) status = "cooling";

  return {
    ...item,
    totalViews,
    latestVelocity: Math.round(latestVelocity),
    acceleration: Math.round(acceleration),
    reachRatio,
    momentumScore,
    status,
    explanation: explainMomentum(item.creator, status, latestVelocity, reachRatio),
    suggestedAction: suggestAction(item, status),
  };
}

export function scoreAll(items: ContentItem[], now: number = Date.now()): ScoredContent[] {
  return items.map((i) => scoreContent(i, now)).sort((a, b) => b.momentumScore - a.momentumScore);
}

function explainMomentum(creator: string, status: MomentumStatus, velocity: number, reachRatio: number): string {
  const parts: string[] = [];
  if (status === "new-spike") {
    parts.push(`Went from near-zero to ${Math.round(velocity).toLocaleString()} views/hr in its latest window — a fresh spike.`);
  } else if (status === "accelerating") {
    parts.push(`Still speeding up: ${Math.round(velocity).toLocaleString()} views/hr now, faster than the prior window.`);
  } else if (status === "cooling") {
    parts.push(`Slowing down — velocity has dropped to ${Math.round(velocity).toLocaleString()} views/hr.`);
  } else {
    parts.push(`Steady at ${Math.round(velocity).toLocaleString()} views/hr, no sharp change either way.`);
  }
  if (reachRatio > 1.5) {
    parts.push(`Reached ${reachRatio.toFixed(1)}x ${creator}'s follower count — traveling beyond their own audience.`);
  } else {
    parts.push(`Still mostly within ${creator}'s own follower base (${reachRatio.toFixed(1)}x).`);
  }
  return parts.join(" ");
}

function suggestAction(item: ContentItem, status: MomentumStatus): string {
  if (status === "cooling") {
    return "Let it ride — don't clone it now. Log what worked for the next similar moment instead of chasing a fading spike.";
  }
  const text = (item.caption + " " + item.hashtags.join(" ")).toLowerCase();
  if (/kid|baby|cute/.test(text)) {
    return "Family/kids content is the accelerant. A costume rental or photographer tie-in could ride this directly.";
  }
  if (/recipe|sweet|payasa|food/.test(text)) {
    return "Food content is spiking — a same-day 'order this today' offer from a local kitchen could ride this audience while it's hot.";
  }
  if (/temple|mutt|crowd|timelapse/.test(text)) {
    return "Devotional footage is traveling furthest beyond the poster's own audience — hospitality (stays, prasadam, darshan info) can piggyback usefully here.";
  }
  if (/dahi|handi|dance|event/.test(text)) {
    return "Live-event content is accelerating — same-day clips are outperforming anything posted a day ago in this set.";
  }
  return "Worth a similar angle today while it's still accelerating.";
}

export function buildTopics(scored: ScoredContent[]): Topic[] {
  const byTag = new Map<string, ScoredContent[]>();
  for (const item of scored) {
    for (const tag of item.hashtags) {
      const key = tag.replace(/^#/, "");
      if (!byTag.has(key)) byTag.set(key, []);
      byTag.get(key)!.push(item);
    }
  }
  const topics: Topic[] = [];
  for (const [name, items] of byTag) {
    const avg = items.reduce((s, i) => s + i.momentumScore, 0) / items.length;
    const statuses = items.map((i) => i.status);
    let status: MomentumStatus = "steady";
    if (statuses.includes("new-spike")) status = "new-spike";
    else if (statuses.includes("accelerating")) status = "accelerating";
    else if (statuses.every((s) => s === "cooling")) status = "cooling";
    topics.push({ name, itemCount: items.length, avgMomentumScore: Math.round(avg * 10) / 10, status });
  }
  return topics.sort((a, b) => b.avgMomentumScore - a.avgMomentumScore);
}

export function detectSpikes(scored: ScoredContent[]): SpikeEvent[] {
  return scored
    .filter((i) => i.status === "new-spike" || i.status === "accelerating")
    .map((i) => {
      const snaps = i.snapshots;
      const baseline = snaps[snaps.length - 2]?.views ?? snaps[0].views;
      const current = snaps[snaps.length - 1].views;
      const percentChange = baseline > 0 ? Math.round(((current - baseline) / baseline) * 100) : 100;
      return {
        contentId: i.id,
        creator: i.creator,
        baseline,
        current,
        percentChange,
        windowHours: snaps[snaps.length - 1].hour - (snaps[snaps.length - 2]?.hour ?? 0),
      };
    })
    .sort((a, b) => b.percentChange - a.percentChange);
}

export function deriveOpportunities(scored: ScoredContent[], topics: Topic[]): Opportunity[] {
  const out: Opportunity[] = [];
  const risingTopic = topics.find((t) => t.status === "accelerating" || t.status === "new-spike");
  if (risingTopic) {
    out.push({
      id: `opp-content-${risingTopic.name}`,
      kind: "content",
      title: `#${risingTopic.name} is accelerating`,
      whatIsHappening: `${risingTopic.itemCount} tracked post(s) under #${risingTopic.name} are showing rising momentum, avg score ${risingTopic.avgMomentumScore}.`,
      whyItMatters: "Rising momentum this early usually means the topic hasn't peaked — there's still room for a new post to catch the same wave.",
      possibleAction: `Create content on the #${risingTopic.name} angle today rather than a generic post — timing is most of the advantage here.`,
      relatedTopic: risingTopic.name,
      urgency: risingTopic.status === "new-spike" ? "high" : "medium",
      confidence: scored.length >= 5 ? "medium" : "low",
    });
  }
  const foodOrTravel = scored.find((i) => /food|recipe|travel|temple|stay/i.test(i.caption));
  if (foodOrTravel) {
    out.push({
      id: `opp-business-${foodOrTravel.id}`,
      kind: "business",
      title: "Local hospitality/food intent detected",
      whatIsHappening: `Content like "${foodOrTravel.caption}" is drawing attention tied to a real-world event window.`,
      whyItMatters: "Attention around a place-based devotional event tends to convert to short-term local demand (food, stays, travel), not just views.",
      possibleAction: "A local business could publish a directly relevant, non-salesy offer timed to this event window.",
      relatedTopic: foodOrTravel.hashtags[0]?.replace("#", "") ?? "general",
      urgency: "medium",
      confidence: "low",
    });
  }
  return out;
}

export function deriveCreatorOpportunities(scored: ScoredContent[]): CreatorOpportunity[] {
  return scored.slice(0, 4).map((i) => {
    let category: CreatorOpportunity["category"] = "emerging";
    if (i.status === "new-spike") category = "create-now";
    else if (i.status === "cooling") category = "saturated";
    else if (/food|temple|travel|stay/i.test(i.caption)) category = "business-opportunity";
    return {
      category,
      topic: i.caption,
      reasoning: i.explanation,
    };
  });
}

export function deriveBusinessOpportunities(scored: ScoredContent[]): BusinessOpportunity[] {
  const hasTravelTemple = scored.some((i) => /temple|travel|tour/i.test(i.caption));
  const hasFood = scored.some((i) => /food|recipe|sweet/i.test(i.caption));
  const out: BusinessOpportunity[] = [];
  if (hasTravelTemple) {
    out.push({
      sector: "Hospitality & travel",
      trendChain: ["Janmashtami event attention", "Temple/travel content views", "Visitor interest in coastal Karnataka", "Homestay/hotel booking intent"],
      reasoning: "Temple and travel-tagged content is present and moving — a plausible, unconfirmed path from attention to local visitor intent.",
      confidence: "low",
    });
  }
  if (hasFood) {
    out.push({
      sector: "Food & catering",
      trendChain: ["Festival recipe content", "Home-cook interest", "Time-pressured buyers", "Same-day order intent"],
      reasoning: "Recipe content performs well around this festival; a same-day ordering option is a reasonable but untested wedge.",
      confidence: "low",
    });
  }
  return out;
}

export function deriveRecommendations(scored: ScoredContent[], topics: Topic[]): ContentRecommendation[] {
  return topics.slice(0, 4).map((t) => {
    const sample = scored.find((i) => i.hashtags.some((h) => h.replace("#", "") === t.name));
    const urgency: ContentRecommendation["urgency"] = t.status === "new-spike" ? "high" : t.status === "accelerating" ? "medium" : "low";
    return {
      idea: `A post on the #${t.name} angle, similar in format to "${sample?.caption ?? t.name}"`,
      reason: `#${t.name} has ${t.itemCount} tracked post(s) with avg momentum score ${t.avgMomentumScore}, status "${t.status}".`,
      relatedTrend: t.name,
      urgency,
      targetAudience: sample && sample.followers < 20000 ? "Small/local accounts — this is where the spike originated" : "General festival audience",
    };
  });
}

export function overallScoreFrom(scored: ScoredContent[]): number {
  if (scored.length === 0) return 0;
  const top = scored[0].momentumScore;
  // Compressed to a 0-100 "how much is genuinely happening right now" read,
  // not a claim about any single post's quality. Capped just under 100 so a
  // strong spike reads as "very high" rather than a suspicious flat 100.
  return Math.max(1, Math.min(96, Math.round(12 + Math.log10(top + 1) * 25)));
}
