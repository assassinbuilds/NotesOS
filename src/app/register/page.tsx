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
          <h1 className="text-lg font-black uppercase tracking-tight text-white">Create account</h1>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Join the student shared directory
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
              <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-450" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-[#1b1b1c] text-xs font-semibold text-white outline-none focus:border-[#ff5a36] transition-colors"
                />
              </div>
            </div>

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
                  placeholder="you@university.edu"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-[#1b1b1c] text-xs font-semibold text-white outline-none focus:border-[#ff5a36] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-450" />
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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-455 hover:text-white transition-opacity"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password strength */}
              {password.length > 0 && (
                <div className="mt-3 space-y-1 animate-fade-in">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                      <Check
                        className={`w-3.5 h-3.5 transition-colors ${
                          check.met ? "text-emerald-500" : "text-zinc-500"
                        }`}
                      />
                      <span className={check.met ? "text-emerald-450" : "text-zinc-500"}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#ff5a36] hover:bg-[#ff7b5d] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-60 shadow-[0_8px_16px_-4px_rgba(255,90,54,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0"
              id="register-submit"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs font-bold uppercase tracking-wider text-zinc-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#ff5a36] hover:underline font-black">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
