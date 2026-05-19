export type AgentStatus = "active" | "waiting" | "completed" | "failed";

export type AgentName =
  | "Planner Agent"
  | "Research Agent"
  | "Writer Agent"
  | "Reviewer Agent"
  | "Formatter Agent"
  | "Summary Agent";

export interface Agent {
  id: string;
  name: AgentName;
  description: string;
  status: AgentStatus;
  progress: number; // 0-100
  startedAt?: string;
  finishedAt?: string;
}

export type TaskStatus = "in_progress" | "completed" | "failed" | "queued";

export interface Task {
  id: string;
  title: string;
  type: "Assignment" | "Project Proposal" | "Report" | "Documentation";
  subject: string;
  createdAt: string;
  status: TaskStatus;
  progress: number;
  agents: Agent[];
  description: string;
}

export interface LogEntry {
  id: string;
  taskId: string;
  agent: AgentName | "System";
  level: "info" | "success" | "warning" | "error";
  message: string;
  timestamp: string;
}

export interface FinalOutput {
  taskId: string;
  title: string;
  summary: string;
  sections: { heading: string; content: string }[];
  references: string[];
  wordCount: number;
  generatedAt: string;
}
