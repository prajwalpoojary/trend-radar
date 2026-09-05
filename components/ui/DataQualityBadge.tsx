import type { DataQuality } from "@/lib/types";

const LABEL: Record<DataQuality, string> = {
  observed: "Observed",
  derived: "Derived",
  estimated: "Demo / Estimated",
};

const STYLE: Record<DataQuality, string> = {
  observed: "bg-emerald-900/40 text-emerald-300 border-emerald-700/50",
  derived: "bg-sky-900/40 text-sky-300 border-sky-700/50",
  estimated: "bg-amber-900/40 text-amber-300 border-amber-700/50",
};

export function DataQualityBadge({ quality }: { quality: DataQuality }) {
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium ${STYLE[quality]}`}>
      {LABEL[quality]}
    </span>
  );
}
