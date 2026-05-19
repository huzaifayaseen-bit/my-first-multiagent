"use client";

import StatusBadge from "@/components/StatusBadge";
import { fetchTasks, Task } from "@/lib/api";
import { ArrowUpRight, Filter, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const statusFilters = ["all", "in_progress", "completed", "failed", "queued"] as const;

export default function HistoryPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchTasks()
      .then((data) => {
        if (!active) return;
        setTasks(data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Unable to load tasks.");
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesQ =
        !q ||
        t.title.toLowerCase().includes(q.toLowerCase()) ||
        t.subject.toLowerCase().includes(q.toLowerCase()) ||
        t.type.toLowerCase().includes(q.toLowerCase());
      const matchesS = status === "all" || t.status === status;
      return matchesQ && matchesS;
    });
  }, [q, status, tasks]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Task History</h1>
          <p className="muted text-sm mt-1">
            Browse, filter and re-open all your previous tasks.
          </p>
        </div>
      </div>

      {loading && (
        <div className="card p-6 text-sm muted">Loading archived tasks...</div>
      )}

      {error && (
        <div className="card p-6 text-sm text-rose-600">
          Error loading task history: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Filters */}
          <div className="card p-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title, subject, type…"
                className="input pl-9"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Filter size={14} className="muted" />
              {statusFilters.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={
                    "px-3 py-1.5 rounded-full border transition " +
                    (status === s
                      ? "bg-brand-600 text-white border-brand-600"
                      : "border-[rgb(var(--border))] hover:bg-black/5 dark:hover:bg-white/5")
                  }
                >
                  {s === "all" ? "All" : s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black/5 dark:bg-white/5 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium muted">Task</th>
                    <th className="text-left px-5 py-3 font-medium muted">Type</th>
                    <th className="text-left px-5 py-3 font-medium muted">Subject</th>
                    <th className="text-left px-5 py-3 font-medium muted">Created</th>
                    <th className="text-left px-5 py-3 font-medium muted">Progress</th>
                    <th className="text-left px-5 py-3 font-medium muted">Status</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr
                      key={t.id}
                      className="border-t border-[rgb(var(--border))] hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-3 font-medium max-w-xs truncate">{t.title}</td>
                      <td className="px-5 py-3 muted">{t.type}</td>
                      <td className="px-5 py-3 muted">{t.subject}</td>
                      <td className="px-5 py-3 muted">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 w-40">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 rounded-full bg-[rgb(var(--border))]">
                            <div
                              className={
                                t.status === "failed"
                                  ? "h-full rounded-full bg-rose-500"
                                  : t.status === "completed"
                                  ? "h-full rounded-full bg-emerald-500"
                                  : "h-full rounded-full bg-brand-600"
                              }
                              style={{ width: `${t.progress}%` }}
                            />
                          </div>
                          <span className="text-xs muted">{t.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          href={
                            t.status === "completed"
                              ? `/tasks/${t.id}/output`
                              : `/tasks/${t.id}/logs`
                          }
                          className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline"
                        >
                          Open <ArrowUpRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center muted text-sm">
                        No tasks match your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
