export type { Agent, FinalOutput, Task, TaskStatus, LogEntry } from "./types";

import type { FinalOutput, LogEntry, Task } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8001";

export interface TaskCreatePayload {
  title: string;
  description: string;
  type: Task["type"];
  subject: string;
  due_date?: string;
}

export interface TaskDetail extends Task {
  logs: LogEntry[];
  final_output: FinalOutput;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText || "API request failed");
  }
  return response.json();
}

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE}/tasks`, { cache: "no-store" });
  return handleResponse<Task[]>(response);
}

export async function fetchTask(taskId: string): Promise<TaskDetail> {
  const response = await fetch(`${API_BASE}/tasks/${taskId}`, { cache: "no-store" });
  return handleResponse<TaskDetail>(response);
}

export async function createTask(payload: TaskCreatePayload): Promise<TaskDetail> {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<TaskDetail>(response);
}
