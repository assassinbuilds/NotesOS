"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 font-sans select-none text-white bg-[#0b0b0c]">
      <div className="w-full max-w-md animate-fade-in-up">
        
        {/* Header Block */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 group mb-4">
            <div className="border border-white/10 px-2 py-0.5 bg-[#ff5a36] text-white font-black text-xs uppercase tracking-wider leading-none">
              NO
              <br />
              TE
            </div>
            <div className="border border-white/10 px-2 py-0.5 bg-[#151516] text-white font-black text-xs uppercase tracking-wider leading-none">
              OS
            </div>
          </div>
          <h1 className="text-lg font-black uppercase tracking-tight text-white">Welcome back</h1>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Access your student shared directory
          </p>
        </div>

        {/* Form Card */}
        <div className="border border-white/5 p-6 sm:p-8 bg-[#151516] rounded-3xl shadow-sm">
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 border border-red-900/50 bg-red-955/30 text-red-400 text-xs font-semibold mb-6 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-450" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-[#1b1b1c] text-xs font-semibold text-white outline-none focus:border-[#ff5a36] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  Password
                </label>
                <Link href="#" className="text-[10px] font-black uppercase text-[#ff5a36] hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-455" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-white/10 bg-[#1b1b1c] text-xs font-semibold text-white outline-none focus:border-[#ff5a36] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-450 hover:text-white transition-opacity"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#ff5a36] hover:bg-[#ff7b5d] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-60 shadow-[0_8px_16px_-4px_rgba(255,90,54,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0"
              id="login-submit"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-xs font-bold uppercase tracking-wider text-zinc-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#ff5a36] hover:underline font-black">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
