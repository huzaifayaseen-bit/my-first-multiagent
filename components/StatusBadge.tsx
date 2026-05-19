import clsx from "clsx";
import type { AgentStatus, TaskStatus } from "@/lib/types";

type Status = AgentStatus | TaskStatus;

const map: Record<Status, { label: string; cls: string; dot: string }> = {
  active: {
    label: "Active",
    cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500 animate-pulseDot",
  },
  waiting: {
    label: "Waiting",
    cls: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
    dot: "bg-slate-400",
  },
  completed: {
    label: "Completed",
    cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  failed: {
    label: "Failed",
    cls: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
  },
  in_progress: {
    label: "In Progress",
    cls: "bg-brand-500/15 text-brand-600 dark:text-brand-400",
    dot: "bg-brand-500 animate-pulseDot",
  },
  queued: {
    label: "Queued",
    cls: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
    dot: "bg-slate-400",
  },
};

export default function StatusBadge({ status }: { status: Status }) {
  const meta = map[status];
  return (
    <span className={clsx("chip", meta.cls)}>
      <span className={clsx("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}
