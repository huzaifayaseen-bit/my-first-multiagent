"use client";

import clsx from "clsx";
import { fetchTasks } from "@/lib/api";
import type { Task } from "@/lib/api";
import {
  Bot,
  History,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type SidebarLink = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  disabled?: boolean;
};

const staticLinks: SidebarLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks/new", label: "Create Task", icon: PlusCircle },
  { href: "/history", label: "Task History", icon: History },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    let active = true;

    fetchTasks()
      .then((data) => {
        if (!active) return;
        setTasks(data);
      })
      .catch(() => {
        if (!active) return;
        setTasks([]);
      })
      .finally(() => {
        if (!active) return;
        setLoadingTasks(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedTaskId = useMemo(() => {
    const routeTaskId = pathname.match(/^\/tasks\/([^/]+)/)?.[1];
    if (routeTaskId && routeTaskId !== "new") return routeTaskId;

    const selectedTask =
      tasks.find((task) => task.status === "in_progress") ?? tasks[0];
    return selectedTask?.id;
  }, [pathname, tasks]);

  const links: SidebarLink[] = [
    ...staticLinks.slice(0, 2),
    {
      href: selectedTaskId ? `/tasks/${selectedTaskId}/logs` : "/dashboard",
      label: "Agent Logs",
      icon: Bot,
      disabled: !selectedTaskId,
    },
    staticLinks[2],
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/50 z-30 lg:hidden transition",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside
        className={clsx(
          "fixed lg:static z-40 top-0 left-0 h-full w-[280px] max-w-[280px] shrink-0",
          "flex flex-col bg-[rgb(var(--bg-elev))] border-r border-[rgb(var(--border))]",
          "transform transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-[rgb(var(--border))]">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
              M
            </div>
            <div className="leading-tight">
              <p className="font-semibold text-sm">MA-UPA</p>
              <p className="text-[10px] muted">Multi-Agent Assistant</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden btn-ghost !p-1.5">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          <nav className="px-3 py-4 space-y-2 overflow-y-auto">
            {links.map(({ href, label, icon: Icon, disabled }) => {
              const active =
                href === "/dashboard" || href === "/tasks/new"
                  ? pathname === href
                  : label === "Agent Logs"
                    ? pathname.startsWith("/tasks/") && pathname.endsWith("/logs")
                    : pathname === href;
              const content = (
                <>
                  <Icon size={18} />
                  <span className="flex min-w-0 flex-col">
                    <span>{label}</span>
                    {label === "Agent Logs" && !loadingTasks && !selectedTaskId && (
                      <span className="text-[10px] font-normal opacity-70">
                        No task selected
                      </span>
                    )}
                  </span>
                </>
              );
              const className = clsx(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition w-full",
                disabled && "cursor-default",
                active
                  ? "bg-brand-600 text-white"
                  : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              );

              if (disabled) {
                return (
                  <div key={href} className={className} aria-disabled="true">
                    {content}
                  </div>
                );
              }

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={className}
                >
                  {content}
                </Link>
              );
            })}
          </nav>

          <div className="px-3 pb-4 border-t border-[rgb(var(--border))]">
            <div className="card rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
              <p className="text-xs font-semibold">Need help?</p>
              <p className="text-[11px] muted mt-1">
                View agent docs and prompt tips.
              </p>
            </div>
            <Link
              href="/login"
              className="mt-3 flex items-center gap-2 text-sm muted hover:text-rose-500 px-3 py-2"
            >
              <LogOut size={16} /> Logout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
