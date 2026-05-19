"use client";

import LogEntryRow from "@/components/LogEntry";
import StatusBadge from "@/components/StatusBadge";
import TaskTimeline from "@/components/TaskTimeline";
import { fetchTask, TaskDetail } from "@/lib/api";
import { ArrowLeft, Download, FileCheck2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function TaskLogsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTask = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTask(id);
      setTask(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load task.");
      setTask(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const taskLogs = task?.logs ?? [];
  const hasOutput = task?.status === "completed";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs muted hover:text-brand-600"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold mt-2">
            {loading ? "Loading task…" : error ? "Task not found" : task?.title}
          </h1>
          {task && (
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <StatusBadge status={task.status} />
              <span className="text-xs muted">{task.type}</span>
              <span className="text-xs muted">• {task.subject}</span>
              <span className="text-xs muted">
                • {new Date(task.createdAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={loadTask} className="btn-ghost" disabled={loading}>
            <RefreshCw size={14} /> Refresh
          </button>
          {task && hasOutput && (
            <Link href={`/tasks/${task.id}/output`} className="btn-primary">
              <FileCheck2 size={14} /> View Final Output
            </Link>
          )}
        </div>
      </div>

      {loading && (
        <div className="card p-6 text-sm muted">Loading logs for this task…</div>
      )}

      {error && (
        <div className="card p-6 text-sm text-rose-600">{error}</div>
      )}

      {!loading && !error && task && (
        <>
          {/* Progress */}
          <div className="card p-5">
            <div className="flex justify-between text-xs muted mb-1.5">
              <span>Overall progress</span>
              <span>{task.progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[rgb(var(--border))]">
              <div
                className={
                  task.status === "failed"
                    ? "h-full rounded-full bg-rose-500"
                    : task.status === "completed"
                    ? "h-full rounded-full bg-emerald-500"
                    : "h-full rounded-full bg-brand-600"
                }
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Timeline */}
            <div className="card p-6 lg:col-span-1">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold">Agent Pipeline</h3>
                <span className="text-xs muted">{task.agents.length} agents</span>
              </div>
              <TaskTimeline agents={task.agents} />
            </div>

            {/* Logs */}
            <div className="card lg:col-span-2 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[rgb(var(--border))]">
                <div>
                  <h3 className="font-semibold">Live Agent Logs</h3>
                  <p className="text-xs muted mt-0.5">
                    Streaming events from all six agents.
                  </p>
                </div>
                <button className="btn-ghost text-xs">
                  <Download size={14} /> Export
                </button>
              </div>

              <div className="max-h-[520px] overflow-y-auto">
                {taskLogs.length === 0 ? (
                  <div className="p-8 text-center muted text-sm">
                    No logs yet — agents have not started for this task.
                  </div>
                ) : (
                  taskLogs.map((l) => <LogEntryRow key={l.id} log={l} />)
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card p-6">
            <h3 className="font-semibold mb-2">Task Description</h3>
            <p className="text-sm muted leading-relaxed">{task.description}</p>
          </div>
        </>
      )}
    </div>
  );
}
