export function LoadingState() {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <div className="h-24 animate-pulse rounded-lg bg-slate-900/60" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-lg bg-slate-900/60" />
        ))}
      </div>
      <p className="text-sm text-slate-500">Scoring signals…</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-rose-900/60 bg-rose-950/30 p-6">
      <p className="text-sm font-medium text-rose-300">Couldn&apos;t load trend data</p>
      <p className="mt-1 text-sm text-rose-200/80">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 rounded-md border border-rose-800 px-3 py-1.5 text-sm text-rose-200 hover:bg-rose-900/40"
      >
        Try again
      </button>
    </div>
  );
}

export function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-8 text-center">
      <p className="text-sm font-medium text-slate-300">No tracked signals for &quot;{query}&quot;</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        This demo is scoped to one case study so the numbers stay honest — it isn&apos;t a live search
        over all of Instagram yet. Try the case study this proof was built around:
      </p>
      <a
        href="/dashboard?q=Udupi%20Krishna%20Janmashtami"
        className="mt-4 inline-block rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-slate-950 hover:bg-amber-400"
      >
        Try &quot;Udupi Krishna Janmashtami&quot;
      </a>
    </div>
  );
}
