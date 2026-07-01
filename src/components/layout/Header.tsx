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
  User,
  LogIn,
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

  // If we are on the Home Page, we already render a beautiful custom hero nav.
  // We can render a simplified global navigation for other pages or use it everywhere.
  // To keep navigation consistent and clean, we'll style the global Header with premium neo-brutalist.
  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-[#f4f1ea] text-black">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 relative">
        <div className="flex items-center justify-between py-4">
          
          {/* Logo - NO TE OS Box */}
          <Link href="/" className="flex items-center gap-1 group" id="logo-link">
            <div className="border-2 border-black px-2 py-1.5 bg-black text-white font-black text-xs uppercase tracking-widest leading-none shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-transform group-hover:-translate-y-0.5">
              NO
              <br />
              TE
            </div>
            <div className="border-2 border-black px-2 py-1.5 bg-[#f4f1ea] text-black font-black text-xs uppercase tracking-widest leading-none shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-transform group-hover:-translate-y-0.5">
              OS
            </div>
          </Link>

          {/* Desktop Search Bar (Brutalist style) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-full max-w-[400px]">
            <form action="/search" method="GET" className="w-full relative">
              <input
                type="text"
                name="q"
                placeholder="Search notes, topics, semesters..."
                className="w-full pl-10 pr-3 py-1.5 rounded-none border-2 border-black bg-white text-xs text-black placeholder-zinc-550 outline-none focus:bg-[#fcfbf9] transition-all"
                id="header-search-input"
                autoComplete="off"
                style={{ paddingLeft: '32px' }}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-650" />
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[10px] font-black uppercase tracking-wider transition-all hover:underline ${
                    isActive ? "text-[#d24b28] underline" : "text-black"
                  }`}
                  id={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="w-0.5 h-4 bg-black/30 mx-1" />

            {session?.user ? (
              <Link
                href={`/profile/${session.user.id}`}
                className="flex items-center justify-center w-7 h-7 rounded-none border-2 border-black bg-black text-[#f4f1ea] text-xs font-black shadow-[1.5px_1.5px_0px_rgba(210,75,40,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                id="nav-profile"
              >
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 bg-black text-white border-2 border-black font-black text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(210,75,40,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center"
                id="nav-login"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Actions */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/search"
              className="flex items-center justify-center w-8 h-8 border-2 border-black bg-white hover:bg-zinc-50"
              id="mobile-search"
            >
              <Search className="w-3.5 h-3.5 text-black" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center w-8 h-8 border-2 border-black bg-white hover:bg-zinc-50"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? (
                <X className="w-3.5 h-3.5 text-black" />
              ) : (
                <Menu className="w-3.5 h-3.5 text-black" />
              )}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu (Brutalist style) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-black py-4 bg-[#f4f1ea] animate-slide-down">
            <nav className="flex flex-col gap-3.5 px-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-[10px] font-black uppercase tracking-wider ${
                      isActive ? "text-[#d24b28] underline" : "text-black"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="h-[2px] bg-black/10 my-1" />
              {session?.user ? (
                <Link
                  href={`/profile/${session.user.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-black"
                >
                  <span className="w-6 h-6 rounded-none border-2 border-black bg-black text-[#f4f1ea] flex items-center justify-center text-[10px] font-black">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  My Profile
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 bg-black text-white border-2 border-black font-black text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_rgba(210,75,40,1)] text-center"
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
