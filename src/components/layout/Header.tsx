"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Search,
  Upload,
  BookOpen,
  Menu,
  X,
  LayoutGrid,
} from "lucide-react";
import { useSession } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home", icon: BookOpen },
  { href: "/categories", label: "Browse", icon: LayoutGrid },
  { href: "/upload", label: "Upload", icon: Upload },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0b0b0c]/90 backdrop-blur-md text-white shadow-sm">
      {/* Full-width bg, centred content */}
      <div className="site-container">
        <div className="flex items-center justify-between py-5 relative">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0" id="logo-link">
            <div className="w-10 h-10 rounded-xl bg-[#ff5a36] text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="font-black text-lg tracking-tight uppercase text-white">
              Notes<span className="text-[#ff5a36]">OS</span>
            </span>
          </Link>

          {/* Desktop Centred Search */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-full max-w-[500px]">
            <form action="/search" method="GET" className="w-full relative group">
              <input
                type="text"
                name="q"
                placeholder="Search notes, topics, semesters..."
                className="w-full modern-input py-2.5 text-sm text-white placeholder-zinc-500 focus:bg-[#1b1b1c]"
                style={{ paddingLeft: "44px", paddingRight: "16px" }}
                id="header-search-input"
                autoComplete="off"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-[#ff5a36] transition-colors" />
            </form>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 flex-shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-bold uppercase tracking-wider transition-all pb-1.5 border-b-2 ${
                    isActive
                      ? "text-[#ff5a36] border-[#ff5a36]"
                      : "text-zinc-400 border-transparent hover:text-white hover:border-zinc-500"
                  }`}
                  id={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="w-px h-5 bg-white/10" />

            {session?.user ? (
              <Link
                href={`/profile/${session.user.id}`}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#0b0b0c] text-sm font-bold shadow-sm hover:scale-105 transition-transform"
                id="nav-profile"
              >
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="modern-btn-primary px-6 py-2.5 text-xs uppercase tracking-wider"
                id="nav-login"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/search"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 shadow-sm hover:bg-white/10 transition-colors"
              id="mobile-search"
            >
              <Search className="w-4 h-4 text-white" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 shadow-sm hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-white" />
              ) : (
                <Menu className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-5 bg-[#0b0b0c] animate-slide-down">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-xs font-bold uppercase tracking-wider pb-0.5 border-b-2 w-fit ${
                      isActive ? "text-[#ff5a36] border-[#ff5a36]" : "text-white border-transparent"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="h-px bg-white/10 my-1" />
              {session?.user ? (
                <Link
                  href={`/profile/${session.user.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-white"
                >
                  <span className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold shadow-sm">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  My Profile
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="modern-btn-primary px-6 py-3 text-[13px] uppercase tracking-widest text-center w-fit"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
