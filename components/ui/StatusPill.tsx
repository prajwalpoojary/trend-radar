import type { MomentumStatus } from "@/lib/types";

const LABEL: Record<MomentumStatus, string> = {
  "new-spike": "New spike",
  accelerating: "Accelerating",
  steady: "Steady",
  cooling: "Cooling",
};

const STYLE: Record<MomentumStatus, string> = {
  "new-spike": "bg-amber-900/40 text-amber-300",
  accelerating: "bg-emerald-900/40 text-emerald-300",
  steady: "bg-slate-800 text-slate-400",
  cooling: "bg-rose-950/50 text-rose-300",
};

export function StatusPill({ status }: { status: MomentumStatus }) {
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STYLE[status]}`}>{LABEL[status]}</span>;
}
