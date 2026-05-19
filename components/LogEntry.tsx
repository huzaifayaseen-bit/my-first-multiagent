import clsx from "clsx";
import type { LogEntry as Entry } from "@/lib/types";

const levelMap = {
  info: "text-brand-500",
  success: "text-emerald-500",
  warning: "text-amber-500",
  error: "text-rose-500",
};

export default function LogEntryRow({ log }: { log: Entry }) {
  const time = new Date(log.timestamp).toLocaleTimeString();
  return (
    <div className="flex gap-3 px-4 py-2.5 border-b border-[rgb(var(--border))] last:border-b-0 hover:bg-black/5 dark:hover:bg-white/5 transition">
      <span className="text-xs muted w-20 shrink-0 font-mono">{time}</span>
      <span
        className={clsx(
          "text-xs font-semibold uppercase w-20 shrink-0",
          levelMap[log.level]
        )}
      >
        {log.level}
      </span>
      <span className="text-xs font-medium w-36 shrink-0 muted">{log.agent}</span>
      <span className="text-sm flex-1">{log.message}</span>
    </div>
  );
}
