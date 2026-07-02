"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="fixed top-6 left-0 right-0 z-50 w-full px-6">
      <div className="mx-auto max-w-[1300px] rounded-full border border-white/30 bg-white/40 backdrop-blur-lg px-8 py-3.5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
        
        {/* Brand Logo */}
        <Link href="/" className="text-lg font-black tracking-tight text-zinc-950" style={{ fontFamily: "'Outfit', sans-serif" }}>
          NotesOS
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
          <Link href="/" className={`text-[12.5px] font-bold transition-colors ${pathname === "/" ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-950"}`}>
            Home
          </Link>
          <Link href="/categories" className={`text-[12.5px] font-bold transition-colors ${pathname === "/categories" ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-950"}`}>
            Subjects
          </Link>
          <Link href="/search" className={`text-[12.5px] font-bold transition-colors ${pathname === "/search" ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-950"}`}>
            Explore
          </Link>
          <Link href="/upload" className={`text-[12.5px] font-bold transition-colors ${pathname === "/upload" ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-950"}`}>
            Upload
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center">
          {session?.user ? (
            <Link
              href={`/profile/${session.user.id}`}
              className="flex items-center justify-center rounded-full bg-zinc-950 px-6 py-2 text-[12px] font-bold text-white transition-all hover:bg-zinc-800 shadow-sm"
            >
              Profile
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center justify-center rounded-full bg-zinc-950 px-6 py-2 text-[12px] font-bold text-white transition-all hover:bg-zinc-800 shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
