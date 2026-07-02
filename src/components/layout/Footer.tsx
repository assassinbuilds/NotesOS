import Link from "next/link";
import { BookOpen, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/5 bg-zinc-950 py-12 text-zinc-400">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          
          {/* Brand & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2 group transition-opacity hover:opacity-80" aria-label="NotesOS Home">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-sm">
                <span className="text-sm font-bold text-white">N</span>
              </div>
              <span className="text-sm font-bold text-zinc-50">NotesOS</span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500">
              The fastest way for students to share, find, and read academic notes. Built for speed and simplicity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-50">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search" className="transition-colors hover:text-zinc-50">Search Notes</Link>
              </li>
              <li>
                <Link href="/categories" className="transition-colors hover:text-zinc-50">Browse Subjects</Link>
              </li>
              <li>
                <Link href="/upload" className="transition-colors hover:text-zinc-50">Upload Material</Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-50">Popular</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/search?q=&subject=Computer+Science" className="transition-colors hover:text-zinc-50">Computer Science</Link>
              </li>
              <li>
                <Link href="/search?q=&subject=Mathematics" className="transition-colors hover:text-zinc-50">Mathematics</Link>
              </li>
              <li>
                <Link href="/search?q=&subject=Physics" className="transition-colors hover:text-zinc-50">Physics</Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-50">Connect</h3>
            <ul className="flex items-center gap-4">
              <li>
                <a href="#" className="text-zinc-500 transition-colors hover:text-zinc-50" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-500 transition-colors hover:text-zinc-50" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </li>
              <li>
                <a href="#" className="text-zinc-500 transition-colors hover:text-zinc-50" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-500">
            &copy; {currentYear} NotesOS. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <Link href="/privacy" className="transition-colors hover:text-zinc-50">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-zinc-50">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
