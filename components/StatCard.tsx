import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "brand" | "emerald" | "amber" | "rose";
}

const toneMap = {
  brand: "bg-brand-500/10 text-brand-600 dark:text-brand-400",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
};

export default function StatCard({ label, value, hint, icon: Icon, tone = "brand" }: Props) {
  return (
    <div className="card p-5 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs muted uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {hint && <p className="text-xs muted mt-1">{hint}</p>}
      </div>
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${toneMap[tone]}`}>
        <Icon size={20} />
      </div>
    </div>
  );
}
