import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white text-black mt-auto shadow-sm">
      <div className="site-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3 group" id="logo-link">
              <div className="w-8 h-8 rounded-lg bg-[#d24b28] text-white flex items-center justify-center font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
                N
              </div>
              <span className="font-black text-sm tracking-tight uppercase text-black">
                Notes<span className="text-[#d24b28]">OS</span>
              </span>
            </Link>
            <p className="text-xs font-semibold text-zinc-500 leading-relaxed max-w-[200px]">
              The fastest academic directory. Study smarter.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Platform</h4>
            <ul className="space-y-2">
              {[
                { href: "/categories", label: "Browse Notes" },
                { href: "/upload", label: "Upload Notes" },
                { href: "/search", label: "Search Directory" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs font-medium text-zinc-650 hover:text-[#d24b28] hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Subjects</h4>
            <ul className="space-y-2">
              {["Computer Science", "Mathematics", "Physics", "Engineering"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/categories?q=${encodeURIComponent(cat)}`}
                    className="text-xs font-medium text-zinc-650 hover:text-[#d24b28] hover:underline"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-black mb-3">Support</h4>
            <ul className="space-y-2">
              {[
                { href: "#", label: "Help Center" },
                { href: "#", label: "Report Issue" },
                { href: "#", label: "Contact Directory" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs font-medium text-zinc-650 hover:text-[#d24b28] hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-450">
            © {new Date().getFullYear()} NotesOS. Built for students.
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-450 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-[#d24b28] fill-[#d24b28]" /> for education
          </p>
        </div>
      </div>
    </footer>
  );
}
