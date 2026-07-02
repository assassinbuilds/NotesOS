"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, MessageCircle, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // On the absolute minimum Botole home page, we want the bottom absolute elements to act as the footer.
  // The global footer would clash with the home page's fullscreen layout.
  if (pathname === "/") {
    return null;
  }

  return (
    <footer className="w-full border-t border-[#e5e5e5] bg-[#f5f5f5] py-16 text-[#666666] font-sans relative z-10">
      <div className="mx-auto w-full max-w-[1400px] px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-6 block text-xl font-bold tracking-tight text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              NotesOS
            </Link>
            <p className="text-[13px] leading-[1.8] text-[#888888] max-w-[250px]">
              The fastest way for students to share, find, and read academic notes. Built for speed and simplicity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-[14px] font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>Platform</h3>
            <ul className="space-y-4 text-[13px] font-medium">
              <li>
                <Link href="/search" className="transition-colors hover:text-[#1a1a1a]">Search Notes</Link>
              </li>
              <li>
                <Link href="/categories" className="transition-colors hover:text-[#1a1a1a]">Browse Subjects</Link>
              </li>
              <li>
                <Link href="/upload" className="transition-colors hover:text-[#1a1a1a]">Upload Material</Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="mb-6 text-[14px] font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>Popular</h3>
            <ul className="space-y-4 text-[13px] font-medium">
              <li>
                <Link href="/search?q=&subject=Computer+Science" className="transition-colors hover:text-[#1a1a1a]">Computer Science</Link>
              </li>
              <li>
                <Link href="/search?q=&subject=Mathematics" className="transition-colors hover:text-[#1a1a1a]">Mathematics</Link>
              </li>
              <li>
                <Link href="/search?q=&subject=Physics" className="transition-colors hover:text-[#1a1a1a]">Physics</Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-6 text-[14px] font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>Connect</h3>
            <ul className="flex items-center gap-5">
              <li>
                <a href="#" className="text-[#888888] transition-colors hover:text-[#1a1a1a]" aria-label="Website">
                  <Globe className="h-5 w-5" />
                </a>
              </li>
              <li>
                <a href="#" className="text-[#888888] transition-colors hover:text-[#1a1a1a]" aria-label="Community">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </li>
              <li>
                <a href="#" className="text-[#888888] transition-colors hover:text-[#1a1a1a]" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[#e5e5e5] pt-8 sm:flex-row">
          <p className="text-[12px] font-medium text-[#888888]">
            &copy; {currentYear} NotesOS. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[12px] font-medium text-[#888888]">
            <Link href="/privacy" className="transition-colors hover:text-[#1a1a1a]">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-[#1a1a1a]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
