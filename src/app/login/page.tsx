"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { BookOpen, Mail, Lock, LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";

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
          <h1 className="text-lg font-black uppercase tracking-tight text-black">Welcome back</h1>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-zinc-550">
            Access your student shared directory
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
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-4 py-3 border-2 border-black bg-white text-xs font-semibold text-black outline-none focus:bg-[#fcfbf9]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-wider text-black">
                  Password
                </label>
                <Link href="#" className="text-[10px] font-black uppercase text-[#d24b28] hover:underline">
                  Forgot?
                </Link>
              </div>
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-black text-[#f4f1ea] border-2 border-black font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_rgba(210,75,40,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-60"
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
        <p className="text-center text-xs font-bold uppercase tracking-wider text-zinc-550 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#d24b28] hover:underline font-black">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
