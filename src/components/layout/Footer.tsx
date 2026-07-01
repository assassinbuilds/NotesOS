import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-2 border-black bg-[#f4f1ea] text-black mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-1 mb-3 group" id="logo-link">
              <div className="border-2 border-black px-1.5 py-0.5 bg-black text-white font-black text-[10px] uppercase tracking-wider leading-none shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] transition-transform group-hover:-translate-y-0.5">
                NO
                <br />
                TE
              </div>
              <div className="border-2 border-black px-1.5 py-0.5 bg-[#f4f1ea] text-black font-black text-[10px] uppercase tracking-wider leading-none shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] transition-transform group-hover:-translate-y-0.5">
                OS
              </div>
            </Link>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600 leading-relaxed">
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
                    className="text-xs font-semibold text-zinc-650 hover:text-black hover:underline"
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
                    className="text-xs font-semibold text-zinc-650 hover:text-black hover:underline"
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
                    className="text-xs font-semibold text-zinc-650 hover:text-black hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            © {new Date().getFullYear()} NotesOS. Built for students.
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-[#d24b28] fill-[#d24b28]" /> for education
          </p>
        </div>
      </div>
    </footer>
  );
}
