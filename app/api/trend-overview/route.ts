import { NextRequest, NextResponse } from "next/server";
import { getDataProvider } from "@/lib/data-providers";

const IN_SCOPE_KEYWORDS = ["udupi", "krishna", "janmashtami"];

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    return NextResponse.json({ error: "Missing query parameter 'q'." }, { status: 400 });
  }

  const inScope = IN_SCOPE_KEYWORDS.some((k) => query.toLowerCase().includes(k));
  if (!inScope) {
    // Honest empty state: this demo covers exactly one case study, not an
    // open search over all of Instagram. Returning fabricated results for
    // an arbitrary query would be worse than an empty state.
    return NextResponse.json({
      query,
      generatedAt: new Date().toISOString(),
      sourceType: "demo",
      overallScore: 0,
      topics: [],
      content: [],
      spikes: [],
      opportunities: [],
      creatorOpportunities: [],
      businessOpportunities: [],
      recommendations: [],
      dataQualityNote: "This demo is scoped to the Udupi Krishna Janmashtami case study only.",
    });
  }

  try {
    const provider = getDataProvider();
    const overview = await provider.getTrendOverview(query);
    return NextResponse.json(overview);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
