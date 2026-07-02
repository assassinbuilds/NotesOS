"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";

const navLinks = [
  { href: "/categories", label: "Browse" },
  { href: "/search", label: "Search" },
  { href: "/upload", label: "Upload" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group transition-opacity hover:opacity-80" aria-label="NotesOS Home">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-zinc-50 leading-none">NotesOS</span>
              <span className="text-[10px] font-medium text-zinc-500 leading-none mt-1 uppercase tracking-wider">Academic Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm font-medium transition-colors ${
                        isActive ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-100"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="h-4 w-px bg-white/10" aria-hidden="true" />

            {session?.user ? (
              <Link
                href={`/profile/${session.user.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-bold text-white shadow-sm transition-transform hover:scale-105"
                aria-label="Your Profile"
              >
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <Link 
              href="/search" 
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/5 text-zinc-400 transition-colors hover:bg-white/10" 
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/5 bg-white/5 text-zinc-400 transition-colors hover:bg-white/10"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4 text-zinc-50" /> : <Menu className="h-4 w-4 text-zinc-50" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav aria-label="Mobile Navigation" className="border-t border-white/5 py-4 md:hidden animate-in slide-in-from-top-2 duration-200">
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-sm font-medium ${pathname === link.href ? "text-zinc-50" : "text-zinc-400"}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="my-1 h-px w-full bg-white/5" aria-hidden="true" />
              <li>
                {session?.user ? (
                  <Link 
                    href={`/profile/${session.user.id}`} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="block text-sm font-medium text-zinc-50"
                  >
                    My Profile
                  </Link>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="inline-flex w-fit items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md"
                  >
                    Sign In
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
