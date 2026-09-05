"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@/lib/analytics";

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("Udupi Krishna Janmashtami");

  function explore() {
    if (!query.trim()) return;
    track({ name: "search", query });
    router.push(`/dashboard?q=${encodeURIComponent(query)}`);
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="mb-4 text-xs uppercase tracking-widest text-amber-500/80">Demo mode · sample data, not a live Instagram feed</p>
      <h1 className="font-serif text-4xl leading-tight text-slate-50 sm:text-5xl">
        See attention before everyone else does.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-slate-400">
        Discover emerging content trends, understand their momentum, and identify what to act on next —
        starting with one real case study: Udupi Krishna Janmashtami.
      </p>

      <div className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && explore()}
          placeholder="What are you tracking?"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
        />
        <button
          onClick={() => {
            track({ name: "cta_clicked", cta: "explore_trends" });
            explore();
          }}
          className="rounded-lg bg-amber-500 px-6 py-3 font-medium text-slate-950 hover:bg-amber-400"
        >
          Explore Trends
        </button>
      </div>

      <button
        onClick={() => {
          track({ name: "cta_clicked", cta: "for_creators_and_businesses" });
          router.push("/creators?q=" + encodeURIComponent(query));
        }}
        className="mt-4 text-sm text-slate-500 underline underline-offset-4 hover:text-slate-300"
      >
        For Creators &amp; Businesses
      </button>

      <p className="mx-auto mt-16 max-w-md text-xs text-slate-600">
        Rankings here are a momentum score — velocity and acceleration normalized by account size — not
        an Instagram algorithm score, and not a guarantee of anything. See the dashboard footer for the
        full data-quality note.
      </p>
    </main>
  );
}
