"use client";

import { Bot, Eye, EyeOff, GraduationCap, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy: just navigate
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_30%_20%,white,transparent_40%)]" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Bot size={22} />
            </div>
            <span className="font-semibold">MA-UPA</span>
          </div>
        </div>
        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Your AI team for every university project.
          </h1>
          <p className="text-white/80 max-w-md">
            Planner, Research, Writer, Reviewer, Formatter and Summary agents
            collaborate to deliver polished academic work.
          </p>
          <div className="flex gap-2">
            {["Planner", "Research", "Writer", "Reviewer", "Formatter", "Summary"].map(
              (a) => (
                <span
                  key={a}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/10 border border-white/20"
                >
                  {a}
                </span>
              )
            )}
          </div>
        </div>
        <p className="relative text-xs text-white/60">© 2026 MA-UPA. All rights reserved.</p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
              <GraduationCap size={20} />
            </div>
            <span className="font-semibold">MA-UPA</span>
          </div>

          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="muted text-sm mt-1">
            Sign in to manage your multi-agent tasks.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-medium muted">Email</label>
              <div className="relative mt-1">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
                />
                <input
                  type="email"
                  required
                  defaultValue="student@university.edu"
                  className="input pl-9"
                  placeholder="you@university.edu"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium muted">Password</label>
              <div className="relative mt-1">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
                />
                <input
                  type={show ? "text" : "password"}
                  required
                  defaultValue="demopassword"
                  className="input pl-9 pr-9"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 muted">
                <input type="checkbox" className="accent-brand-600" /> Remember me
              </label>
              <a className="text-brand-600 hover:underline" href="#">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn-primary w-full">
              Sign in
            </button>
          </form>

          <p className="text-sm muted text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand-600 hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
