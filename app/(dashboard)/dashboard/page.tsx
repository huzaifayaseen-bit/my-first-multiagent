"use client";

import AgentCard from "@/components/AgentCard";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { fetchTasks, Task } from "@/lib/api";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  ListChecks,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
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

  const activeTask = tasks.find((t) => t.status === "in_progress") ?? tasks[0];
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const failedCount = tasks.filter((t) => t.status === "failed").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, Huzaifa 👋</h1>
          <p className="muted text-sm mt-1">
            Here&apos;s what your AI agents are working on today.
          </p>
        </div>
        <Link href="/tasks/new" className="btn-primary">
          <PlusCircle size={16} /> New Task
        </Link>
      </div>

      {loading && (
        <div className="card p-6 text-sm muted">
          Loading tasks from the academic assistant...
        </div>
      )}

      {error && (
        <div className="card p-6 text-sm text-rose-600">
          Error loading tasks: {error}
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="card p-6 text-sm muted">
          No tasks found yet. Create a new task to start the assistant pipeline.
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <>
          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Tasks" value={tasks.length} icon={ListChecks} tone="brand" />
            <StatCard
              label="In Progress"
              value={inProgressCount}
              icon={Activity}
              tone="amber"
              hint="Live agents running"
            />
            <StatCard
              label="Completed"
              value={completedCount}
              icon={CheckCircle2}
              tone="emerald"
            />
            <StatCard label="Failed" value={failedCount} icon={Clock} tone="rose" />
          </div>

          {/* Active task + agents */}
          <section className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div>
                  <p className="text-xs muted uppercase tracking-wide">Currently Active</p>
                  <h2 className="text-lg font-semibold mt-1">{activeTask.title}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={activeTask.status} />
                    <span className="text-xs muted">{activeTask.subject}</span>
                  </div>
                </div>
                <Link href={`/tasks/${activeTask.id}/logs`} className="btn-ghost text-sm">
                  View Logs <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-xs muted mb-1.5">
                  <span>Overall progress</span>
                  <span>{activeTask.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[rgb(var(--border))]">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${activeTask.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {activeTask.agents.map((a) => (
                  <AgentCard key={a.id} agent={a} />
                ))}
              </div>
            </div>

            {/* Recent tasks */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Tasks</h3>
                <Link href="/history" className="text-xs text-brand-600 hover:underline">
                  See all
                </Link>
              </div>
              <ul className="space-y-3">
                {tasks.slice(0, 5).map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/tasks/${t.id}/logs`}
                      className="flex items-start justify-between gap-3 rounded-lg p-3 hover:bg-black/5 dark:hover:bg-white/5 transition border border-transparent hover:border-[rgb(var(--border))]"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{t.title}</p>
                        <p className="text-xs muted mt-0.5">
                          {t.type} • {t.subject}
                        </p>
                      </div>
                      <StatusBadge status={t.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
