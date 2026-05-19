# Multi-Agent University Project Assistant — Frontend

A Next.js (App Router) + TypeScript + Tailwind CSS frontend for a multi-agent university
assistant. Students submit a task (assignment, proposal, report, documentation) and the
system orchestrates several AI agents: **Planner → Research → Writer → Reviewer → Formatter → Summary**.

> Frontend only. All data is dummy / mocked. No backend integration yet.

## Pages

- `/login` — Login
- `/register` — Register
- `/dashboard` — Overview, stats, agents
- `/tasks/new` — Create new task
- `/tasks/[id]/logs` — Agent activity logs (live-style)
- `/tasks/[id]/output` — Final output
- `/history` — Task history

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000
