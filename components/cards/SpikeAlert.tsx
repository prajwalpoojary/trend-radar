import type { SpikeEvent } from "@/lib/types";

export function SpikeAlert({ spike }: { spike: SpikeEvent }) {
  return (
    <div className="rounded-lg border border-amber-800/50 bg-amber-950/20 p-4">
      <p className="text-sm font-medium text-amber-300">Momentum spike detected — {spike.creator}</p>
      <p className="mt-1 text-sm text-slate-400">
        Activity increased {spike.percentChange}% over the last {spike.windowHours}h window compared with the previous one.
      </p>
      <div className="mt-3 flex gap-6 text-xs text-slate-500">
        <div>
          <div className="text-slate-300">{spike.baseline.toLocaleString("en-IN")}</div>
          <div>baseline views</div>
        </div>
        <div>
          <div className="text-slate-300">{spike.current.toLocaleString("en-IN")}</div>
          <div>current views</div>
        </div>
        <div>
          <div className="text-emerald-400">+{spike.percentChange}%</div>
          <div>change</div>
        </div>
      </div>
    </div>
  );
}
