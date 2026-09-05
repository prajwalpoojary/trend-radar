// Every number in this app is one of three kinds. The UI is required to
// label which kind it's showing — this is the "technical honesty" boundary
// from the brief, enforced in the type system rather than left as a promise.
export type DataQuality = "observed" | "derived" | "estimated";
// observed  = logged directly from a public post (views/likes/comments as shown)
// derived   = computed from observed numbers (velocity, momentum score, reach ratio)
// estimated = demo/sample filler used only because live data isn't connected yet

export type SourceType = "demo" | "instagram";

export interface Snapshot {
  hour: number;
  views: number;
  likes: number;
  comments: number;
}

export interface ContentItem {
  id: string;
  creator: string;
  followers: number;
  caption: string;
  hashtags: string[];
  postedAt: string;
  snapshots: Snapshot[];
  sourceType: SourceType;
}

export type MomentumStatus = "new-spike" | "accelerating" | "steady" | "cooling";

export interface ScoredContent extends ContentItem {
  totalViews: number;
  latestVelocity: number;
  acceleration: number;
  reachRatio: number;
  momentumScore: number;
  status: MomentumStatus;
  explanation: string;
  suggestedAction: string;
}

export interface Topic {
  name: string;
  itemCount: number;
  avgMomentumScore: number;
  status: MomentumStatus;
}

export interface SpikeEvent {
  contentId: string;
  creator: string;
  baseline: number;
  current: number;
  percentChange: number;
  windowHours: number;
}

export type Urgency = "low" | "medium" | "high";

export interface Opportunity {
  id: string;
  kind: "content" | "business";
  title: string;
  whatIsHappening: string;
  whyItMatters: string;
  possibleAction: string;
  relatedTopic: string;
  urgency: Urgency;
  confidence: "low" | "medium" | "high";
}

export type CreatorOpportunityCategory = "create-now" | "emerging" | "saturated" | "business-opportunity";

export interface CreatorOpportunity {
  category: CreatorOpportunityCategory;
  topic: string;
  reasoning: string;
}

export interface BusinessOpportunity {
  sector: string;
  trendChain: string[];
  reasoning: string;
  confidence: "low" | "medium" | "high";
}

export interface ContentRecommendation {
  idea: string;
  reason: string;
  relatedTrend: string;
  urgency: Urgency;
  targetAudience: string;
}

export interface TrendOverviewResult {
  query: string;
  generatedAt: string;
  sourceType: SourceType;
  overallScore: number;
  topics: Topic[];
  content: ScoredContent[];
  spikes: SpikeEvent[];
  opportunities: Opportunity[];
  creatorOpportunities: CreatorOpportunity[];
  businessOpportunities: BusinessOpportunity[];
  recommendations: ContentRecommendation[];
  dataQualityNote: string;
}

export interface DataProvider {
  getTrendOverview(query: string): Promise<TrendOverviewResult>;
}
