import clsx from "clsx";
import { Check, Loader2, X } from "lucide-react";
import type { Agent } from "@/lib/types";

export default function TaskTimeline({ agents }: { agents: Agent[] }) {
  return (
    <ol className="relative border-l-2 border-dashed border-[rgb(var(--border))] ml-3 space-y-6">
      {agents.map((a) => {
        const color =
          a.status === "completed"
            ? "bg-emerald-500 text-white"
            : a.status === "active"
            ? "bg-brand-600 text-white"
            : a.status === "failed"
            ? "bg-rose-500 text-white"
            : "bg-[rgb(var(--border))] text-[rgb(var(--muted))]";

        return (
          <li key={a.id} className="ml-6">
            <span
              className={clsx(
                "absolute -left-[14px] flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-[rgb(var(--bg))]",
                color
              )}
            >
              {a.status === "completed" ? (
                <Check size={14} />
              ) : a.status === "failed" ? (
                <X size={14} />
              ) : a.status === "active" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-medium text-sm">{a.name}</h4>
              <span className="text-xs muted">• {a.progress}%</span>
            </div>
            <p className="text-xs muted mt-0.5">{a.description}</p>
          </li>
        );
      })}
    </ol>
  );
}
