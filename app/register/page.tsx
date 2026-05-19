"use client";

import { Bot, GraduationCap, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-12 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-10 w-10 rounded-xl bg-brand-600 text-white flex items-center justify-center">
              <GraduationCap size={20} />
            </div>
            <span className="font-semibold">MA-UPA</span>
          </div>

          <h2 className="text-2xl font-semibold">Create your account</h2>
          <p className="muted text-sm mt-1">
            Join MA-UPA and let AI agents accelerate your academic work.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium muted">First name</label>
                <div className="relative mt-1">
                  <User
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
                  />
                  <input className="input pl-9" placeholder="Huzaifa" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium muted">Last name</label>
                <input className="input mt-1" placeholder="Ahmed" required />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium muted">University Email</label>
              <div className="relative mt-1">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
                />
                <input
                  type="email"
                  required
                  className="input pl-9"
                  placeholder="you@university.edu"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium muted">Student ID</label>
              <input className="input mt-1" placeholder="e.g. 2026-CS-123" required />
            </div>

            <div>
              <label className="text-xs font-medium muted">Password</label>
              <div className="relative mt-1">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]"
                />
                <input
                  type="password"
                  required
                  className="input pl-9"
                  placeholder="At least 8 characters"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs muted">
              <input type="checkbox" className="accent-brand-600 mt-0.5" required />
              <span>
                I agree to the Terms of Service and the Academic Integrity Policy.
              </span>
            </label>

            <button type="submit" className="btn-primary w-full">
              Create account
            </button>
          </form>

          <p className="text-sm muted text-center mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white relative overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_70%_30%,white,transparent_40%)]" />
        <div className="relative flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Bot size={22} />
          </div>
          <span className="font-semibold">MA-UPA</span>
        </div>
        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Six specialised agents. <br /> One academic workflow.
          </h1>
          <p className="text-white/80 max-w-md">
            From outlining to citation formatting — your AI team handles the
            heavy lifting so you can focus on learning.
          </p>
        </div>
        <p className="relative text-xs text-white/60">© 2026 MA-UPA.</p>
      </div>
    </div>
  );
}
