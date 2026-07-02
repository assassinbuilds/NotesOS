"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full pt-10 pb-6 px-10">
      <div className="mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
          NotesOS
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
          <Link href="/" className={`text-[13px] font-semibold transition-colors ${pathname === "/" ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}>
            Home
          </Link>
          <Link href="/categories" className={`text-[13px] font-semibold transition-colors ${pathname === "/categories" ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}>
            Subjects
          </Link>
          <Link href="/search" className={`text-[13px] font-semibold transition-colors ${pathname === "/search" ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}>
            Explore
          </Link>
          <Link href="/upload" className={`text-[13px] font-semibold transition-colors ${pathname === "/upload" ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"}`}>
            Upload
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center">
          {session?.user ? (
            <Link
              href={`/profile/${session.user.id}`}
              className="flex items-center justify-center rounded-full bg-white px-8 py-3 text-[13px] font-bold text-zinc-900 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              Profile
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center justify-center rounded-full bg-white px-8 py-3 text-[13px] font-bold text-zinc-900 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
