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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 font-sans select-none">
      <div className="w-full max-w-md animate-fade-in-up">
        
        {/* Header Block */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 group mb-4">
            <div className="border-2 border-black px-2 py-0.5 bg-black text-white font-black text-xs uppercase tracking-wider leading-none shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              NO
              <br />
              TE
            </div>
            <div className="border-2 border-black px-2 py-0.5 bg-[#f4f1ea] text-black font-black text-xs uppercase tracking-wider leading-none shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              OS
            </div>
          </div>
          <h1 className="text-lg font-black uppercase tracking-tight text-black">Create account</h1>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-550">
            Join the student shared directory
          </p>
        </div>

        {/* Form Card (Brutalist) */}
        <div className="border-2 border-black p-6 sm:p-8 bg-[#e8e3d5] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          {error && (
            <div className="flex items-center gap-2.5 p-3 border-2 border-black bg-red-100 text-red-800 text-xs font-semibold mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border-2 border-black bg-white text-xs font-semibold text-black outline-none focus:bg-[#fcfbf9]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full pl-10 pr-4 py-3 border-2 border-black bg-white text-xs font-semibold text-black outline-none focus:bg-[#fcfbf9]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-wider text-black mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 border-2 border-black bg-white text-xs font-semibold text-black outline-none focus:bg-[#fcfbf9]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black hover:opacity-75 transition-opacity"
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
                          check.met ? "text-green-600" : "text-zinc-400"
                        }`}
                      />
                      <span className={check.met ? "text-green-700" : "text-zinc-550"}>
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
              className="w-full flex items-center justify-center gap-2 py-3 bg-black text-[#f4f1ea] border-2 border-black font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_rgba(210,75,40,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-60"
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
        <p className="text-center text-xs font-bold uppercase tracking-wider text-zinc-550 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-[#d24b28] hover:underline font-black">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
