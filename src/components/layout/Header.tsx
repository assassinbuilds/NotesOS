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
    <header className="sticky top-0 z-50 border-b-2 border-black bg-[#f4f1ea] text-black">
      <div className="site-container">
        <div className="flex items-center justify-between py-5 relative">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0 group flex-shrink-0" id="logo-link">
            <div className="border-2 border-black px-3 py-2 bg-black text-white font-black text-[16px] uppercase tracking-widest leading-none shadow-[3px_3px_0px_rgba(210,75,40,1)] group-hover:shadow-none group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
              NO
              <br />
              TE
            </div>
            <div className="border-t-2 border-r-2 border-b-2 border-black px-3 py-2 bg-[#f4f1ea] text-black font-black text-[16px] uppercase tracking-widest leading-none shadow-[3px_3px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
              OS
            </div>
          </Link>

          {/* Desktop Centred Search */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-full max-w-[500px]">
            <form action="/search" method="GET" className="w-full relative group">
              <input
                type="text"
                name="q"
                placeholder="Search notes, topics, semesters..."
                className="w-full border-2 border-black bg-white text-sm text-black placeholder-zinc-400 outline-none focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all py-3"
                style={{ paddingLeft: "44px", paddingRight: "16px" }}
                id="header-search-input"
                autoComplete="off"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-black transition-colors" />
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
                  className={`text-[13px] font-black uppercase tracking-widest transition-all pb-0.5 border-b-2 ${
                    isActive
                      ? "text-[#d24b28] border-[#d24b28]"
                      : "text-black border-transparent hover:border-black"
                  }`}
                  id={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="w-px h-5 bg-black/20" />

            {session?.user ? (
              <Link
                href={`/profile/${session.user.id}`}
                className="flex items-center justify-center w-10 h-10 border-2 border-black bg-black text-[#f4f1ea] text-sm font-black shadow-[2px_2px_0px_rgba(210,75,40,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                id="nav-profile"
              >
                {session.user.name?.[0]?.toUpperCase() || "U"}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 bg-black text-[#f4f1ea] border-2 border-black font-black text-[12px] uppercase tracking-widest shadow-[3px_3px_0px_rgba(210,75,40,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
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
