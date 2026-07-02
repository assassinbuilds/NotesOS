"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, UserPlus, Eye, EyeOff, AlertCircle, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
      } else {
        router.push("/login?registered=true");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12 text-zinc-50 selection:bg-purple-500/30">
      
      {/* Decorative ambient glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/10 blur-[100px]" 
      />

      <main className="relative z-10 w-full max-w-sm animate-in zoom-in-95 duration-500">

        {/* Header */}
        <header className="mb-6 text-center">
          <div className="group mb-4 flex items-center justify-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <span className="text-sm font-bold text-white">N</span>
            </div>
            <span className="text-sm font-bold text-white">NotesOS</span>
          </div>
          <h1 className="text-xl font-extrabold text-white">Create account</h1>
          <p className="mt-1 text-xs text-zinc-500">Join the student community</p>
        </header>

        {/* Form Card */}
        <section aria-label="Registration form" className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-md sm:p-8">
          {error && (
            <div role="alert" className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden="true" />
                <input
                  id="name" 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-full border border-white/10 bg-zinc-900/50 py-3 pl-11 pr-4 text-xs text-zinc-50 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden="true" />
                <input
                  id="email" 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full rounded-full border border-white/10 bg-zinc-900/50 py-3 pl-11 pr-4 text-xs text-zinc-50 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-full border border-white/10 bg-zinc-900/50 py-3 pl-11 pr-11 text-xs text-zinc-50 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded text-zinc-500 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>

              {/* Password checks */}
              {password.length > 0 && (
                <ul className="mt-2.5 space-y-1.5 pl-1 animate-in fade-in duration-300" aria-label="Password requirements">
                  {passwordChecks.map((check) => (
                    <li key={check.label} className="flex items-center gap-2 text-[10px] font-medium">
                      <Check className={`h-3.5 w-3.5 ${check.met ? "text-emerald-500" : "text-zinc-600"}`} aria-hidden="true" />
                      <span className={check.met ? "text-emerald-400" : "text-zinc-500"}>{check.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit" 
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-transform disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:scale-105 hover:enabled:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
              id="register-submit"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
              ) : (
                <>
                  <UserPlus className="h-4 w-4" aria-hidden="true" /> Create Account
                </>
              )}
            </button>
          </form>
        </section>

        <p className="mt-5 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-purple-400 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded">Sign In</Link>
        </p>
      </main>
    </div>
  );
}
