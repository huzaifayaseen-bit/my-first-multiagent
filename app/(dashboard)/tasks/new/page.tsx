"use client";

import {
  Brain,
  ClipboardList,
  FileText,
  PenLine,
  Rocket,
  ScrollText,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createTask } from "@/lib/api";

const types = ["Assignment", "Project Proposal", "Report", "Documentation"] as const;
const subjects = [
  "Artificial Intelligence",
  "Database Systems",
  "Operating Systems",
  "Cloud Computing",
  "Software Engineering",
  "Internet of Things",
  "Machine Learning",
  "Computer Networks",
];
const tones = ["Academic", "Formal", "Concise", "Detailed"];
const lengths = ["Short (500 words)", "Medium (1500 words)", "Long (2500+ words)"];

const agentChips = [
  { icon: ClipboardList, label: "Planner" },
  { icon: Brain, label: "Research" },
  { icon: PenLine, label: "Writer" },
  { icon: ScrollText, label: "Reviewer" },
  { icon: FileText, label: "Formatter" },
  { icon: Sparkles, label: "Summary" },
];

export default function NewTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState<typeof types[number]>(types[0]);
  const [subject, setSubject] = useState(subjects[0]);
  const [description, setDescription] = useState(
    "Write a research report on AI ethics in higher education, focusing on academic integrity, bias, and student data privacy. Include real-world case studies and at least 10 academic references."
  );
  const [tone, setTone] = useState(tones[0]);
  const [length, setLength] = useState(lengths[1]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const task = await createTask({
        title,
        description,
        type,
        subject,
      });
      router.push(task.status === "completed" ? `/tasks/${task.id}/output` : `/tasks/${task.id}/logs`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start task.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create a new task</h1>
        <p className="muted text-sm mt-1">
          Describe your work and let the agents collaborate on it.
        </p>
      </div>

      <div className="card p-5 flex flex-wrap items-center gap-2 bg-brand-500/5 border-brand-500/20">
        <Wand2 size={18} className="text-brand-600" />
        <p className="text-sm">Six agents will activate sequentially:</p>
        <div className="flex flex-wrap gap-1.5 ml-1">
          {agentChips.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="chip bg-[rgb(var(--bg))] border border-[rgb(var(--border))]"
            >
              <Icon size={12} /> {label}
            </span>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {error && <div className="text-sm text-rose-600">{error}</div>}

        <div>
          <label className="text-xs font-medium muted">Task Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input mt-1"
            placeholder="e.g. AI Ethics in Higher Education — Research Report"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium muted">Task Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof types[number])}
              required
              className="input mt-1"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium muted">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="input mt-1"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium muted">Description / Prompt</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="input mt-1 resize-none"
            placeholder="Describe the goal, scope, target audience, and any constraints…"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium muted">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="input mt-1"
            >
              {tones.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium muted">Length</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="input mt-1"
            >
              {lengths.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium muted">Reference files (optional)</label>
          <div className="mt-1 border-2 border-dashed border-[rgb(var(--border))] rounded-lg p-6 text-center hover:border-brand-500/50 transition cursor-pointer">
            <p className="text-sm">Drag &amp; drop or click to upload PDFs, DOCX</p>
            <p className="text-xs muted mt-1">Max 25 MB per file</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[rgb(var(--border))]">
          <button type="button" className="btn-ghost" onClick={() => router.back()}>
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn-primary">
            <Rocket size={16} />
            {submitting ? "Dispatching to agents…" : "Start Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
