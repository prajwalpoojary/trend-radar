export type AnalyticsEvent =
  | { name: "search"; query: string }
  | { name: "trend_opened"; topic: string }
  | { name: "opportunity_opened"; opportunityId: string }
  | { name: "recommendation_viewed"; idea: string }
  | { name: "cta_clicked"; cta: string };

// Intentionally trivial: console + in-memory only. The point tonight is
// having the event boundary in the right place (every user action funnels
// through one function), not picking an analytics vendor. Swap the body for
// PostHog/GA/Amplitude later without touching any call site.
export function track(event: AnalyticsEvent) {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log("[analytics]", event.name, event);
  }
}
