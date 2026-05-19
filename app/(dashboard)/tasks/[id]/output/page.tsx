"use client";

import StatusBadge from "@/components/StatusBadge";
import { fetchTask, TaskDetail } from "@/lib/api";
import {
  ArrowLeft,
  BookMarked,
  Copy,
  Download,
  FileText,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function FinalOutputPage({ params }: { params: { id: string } }) {
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
      setError(err instanceof Error ? err.message : "Failed to load output.");
      setTask(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const output = task?.final_output;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={task ? `/tasks/${task.id}/logs` : "/dashboard"}
            className="inline-flex items-center gap-1.5 text-xs muted hover:text-brand-600"
          >
            <ArrowLeft size={14} /> Back to Logs
          </Link>
          <div className="mt-3">
            <h1 className="text-2xl font-semibold">
              {loading ? "Loading final output…" : error ? "Output unavailable" : task?.title}
            </h1>
            {task && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <StatusBadge status={task.status} />
                <span className="text-xs muted">{task.subject}</span>
                <span className="text-xs muted">• {output?.wordCount ?? 0} words</span>
                <span className="text-xs muted">
                  • Generated {output ? new Date(output.generatedAt).toLocaleString() : "-"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn-ghost" disabled={loading || !!error}>
            <Copy size={14} /> Copy
          </button>
          <button className="btn-ghost" disabled={loading || !!error}>
            <Share2 size={14} /> Share
          </button>
          <button className="btn-primary" disabled={loading || !!error}>
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      {loading && (
        <div className="card p-6 text-sm muted">Loading final output from the academic assistant…</div>
      )}

      {error && (
        <div className="card p-6 text-sm text-rose-600">{error}</div>
      )}

      {!loading && !error && output && task && (
        <>
          <div className="card p-6 bg-gradient-to-br from-brand-500/5 to-transparent border-brand-500/20">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-brand-600" />
              <h3 className="font-semibold">Executive Summary</h3>
            </div>
            <p className="text-sm leading-relaxed">{output.summary}</p>
          </div>

          <div className="card p-6 lg:p-8 space-y-6">
            <h3 className="font-semibold text-lg">Document Contents</h3>
            {output.sections.map((s) => (
              <article key={s.heading}>
                <h4 className="font-semibold mb-1.5">{s.heading}</h4>
                <p className="text-sm muted leading-relaxed">{s.content}</p>
              </article>
            ))}
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookMarked size={16} className="text-brand-600" />
              <h3 className="font-semibold">References</h3>
            </div>
            <ol className="space-y-2 list-decimal list-inside text-sm muted">
              {output.references.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
