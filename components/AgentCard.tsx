import {
  Brain,
  ClipboardList,
  FileText,
  PenLine,
  ScrollText,
  Sparkles,
} from "lucide-react";
import type { Agent } from "@/lib/types";
import StatusBadge from "./StatusBadge";

const iconMap = {
  "Planner Agent": ClipboardList,
  "Research Agent": Brain,
  "Writer Agent": PenLine,
  "Reviewer Agent": ScrollText,
  "Formatter Agent": FileText,
  "Summary Agent": Sparkles,
} as const;

export default function AgentCard({ agent }: { agent: Agent }) {
  const Icon = iconMap[agent.name];

  return (
    <div className="card p-5 flex flex-col gap-4 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{agent.name}</h3>
            <p className="text-xs muted line-clamp-2 max-w-[220px]">
              {agent.description}
            </p>
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      <div>
        <div className="flex items-center justify-between text-xs muted mb-1.5">
          <span>Progress</span>
          <span>{agent.progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[rgb(var(--border))] overflow-hidden">
          <div
            className={
              agent.status === "failed"
                ? "h-full bg-rose-500"
                : agent.status === "completed"
                ? "h-full bg-emerald-500"
                : "h-full bg-brand-500"
            }
            style={{ width: `${agent.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
