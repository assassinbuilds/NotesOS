import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  FileText, Users, Download, Eye,
  Upload, BookOpen, ChevronRight, Check, RefreshCw, ArrowRight
} from "lucide-react";

export const dynamic = "force-dynamic";

const categoryGradients: Record<string, string> = {
  "computer-science": "from-purple-600 to-indigo-600",
  "mathematics": "from-blue-600 to-purple-600",
  "physics": "from-pink-600 to-purple-600",
  "engineering": "from-cyan-600 to-blue-600",
  "chemistry": "from-rose-600 to-pink-600",
  "biology": "from-emerald-600 to-teal-600",
  "business": "from-amber-600 to-orange-600",
  "law": "from-slate-600 to-zinc-700",
};

const categoryEmojis: Record<string, string> = {
  "computer-science": "💻",
  "mathematics": "🧮",
  "physics": "⚛️",
  "engineering": "⚙️",
  "chemistry": "🧪",
  "biology": "🧬",
  "business": "📈",
  "law": "⚖️",
};

export default async function HomePage() {
  const [totalNotes, totalUsers, aggregateStats, categoriesFromDb, recentNotes] = await Promise.all([
    prisma.note.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count(),
    prisma.note.aggregate({
      where: { status: "PUBLISHED" },
      _sum: { downloads: true, views: true },
    }),
    prisma.category.findMany({
      take: 8,
      include: { _count: { select: { notes: true } } },
      orderBy: { notes: { _count: "desc" } },
    }),
    prisma.note.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
    })
  ]);

  const totalDownloads = aggregateStats._sum.downloads || 0;
  const totalViews = aggregateStats._sum.views || 0;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50 selection:bg-purple-500/30">
      
      {/* Decorative ambient glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-1/2 top-[-10%] -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-purple-600/20 blur-[100px]" 
      />

      {/* ===== HERO SECTION ===== */}
      <section aria-labelledby="hero-heading" className="relative z-10 w-full pt-20 pb-16 md:pt-28 md:pb-20 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
        {/* Main Headline */}
        <h1 id="hero-heading" className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          <span className="text-gradient">Unlimited Academic</span>
          <br />
          <span className="text-zinc-50 block mt-2">Notes Directory</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-zinc-400 text-base sm:text-lg md:text-xl font-normal leading-relaxed mb-8">
          Access study guides, lecture notes, and textbook solutions. 
          All in one simple, hyper-fast interface built by students, for students.
        </p>

        {/* Value Proposition Pills */}
        <ul aria-label="Key Benefits" className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-10">
          {[
            "100% Free platform",
            "No paywalls or contracts",
            "Direct PDF downloads"
          ].map((benefit, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-zinc-300 bg-white/[0.02] border border-white/10 rounded-full px-5 py-2 backdrop-blur-md">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20" aria-hidden="true">
                <Check className="h-3 w-3 text-purple-400" />
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mb-20">
          <Link 
            href="/search" 
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Explore Study Guides
          </Link>
        </div>

        {/* Social Proof */}
        <div className="border-t border-white/5 pt-8">
          <h2 className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase mb-6">
            Trusted by students at
          </h2>
          <ul aria-label="Universities" className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-50 grayscale">
            {["MIT", "STANFORD", "HARVARD", "OXFORD", "CALTECH"].map((uni) => (
              <li key={uni} className="text-lg font-bold tracking-wider text-zinc-300">{uni}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===== TIMELINE SECTION ===== */}
      <section aria-labelledby="timeline-heading" className="relative z-10 border-t border-white/5 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          <header className="text-center mb-16">
            <h2 id="timeline-heading" className="text-xs font-bold tracking-[0.2em] text-purple-500 uppercase mb-3">
              A Step-by-Step Approach
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-zinc-50">
              Learning, without the hassle
            </p>
          </header>

          <div className="relative mx-auto max-w-3xl">
            {/* Center Timeline Line */}
            <div aria-hidden="true" className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />

            {/* Step 1 */}
            <article className="relative mb-16 flex flex-col items-center gap-8 md:flex-row md:gap-0">
              <div className="flex w-full justify-center md:w-1/2 md:justify-end md:pr-12">
                {/* Mockup Card */}
                <div aria-hidden="true" className="flex aspect-[4/3] w-full max-w-[280px] flex-col justify-between rounded-xl border border-white/10 bg-zinc-900/80 p-4 shadow-lg backdrop-blur-md">
                  <div className="flex gap-2 border-b border-white/10 pb-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="space-y-2 py-4">
                    <div className="h-2 w-3/4 rounded bg-white/10" />
                    <div className="h-2 w-1/2 rounded bg-white/5" />
                  </div>
                  <div className="flex h-6 w-full items-center justify-center rounded border border-purple-500/30 bg-purple-500/10 text-[10px] font-bold text-purple-300">
                    Find Notes
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">1</div>
              </div>
              <div className="w-full text-center md:w-1/2 md:pl-12 md:text-left">
                <h3 className="mb-2 text-lg font-bold text-zinc-50">Search Catalog</h3>
                <p className="mx-auto max-w-sm text-sm leading-relaxed text-zinc-400 md:mx-0">
                  Search through thousands of notes by subject, semester, or college keyword. Discover high-quality materials instantly.
                </p>
              </div>
            </article>

            {/* Step 2 */}
            <article className="relative mb-16 flex flex-col-reverse items-center gap-8 md:flex-row md:gap-0">
              <div className="flex w-full flex-col items-center text-center md:w-1/2 md:items-end md:pr-12 md:text-right">
                <h3 className="mb-2 text-lg font-bold text-zinc-50">Read Instantly</h3>
                <p className="mx-auto max-w-sm text-sm leading-relaxed text-zinc-400 md:mx-0">
                  Open documents within our built-in clutter-free viewer. Control zoom levels, go fullscreen, and focus on studying.
                </p>
              </div>
              <div aria-hidden="true" className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">2</div>
              </div>
              <div className="flex w-full justify-center md:w-1/2 md:justify-start md:pl-12">
                {/* Mockup Card */}
                <div aria-hidden="true" className="flex aspect-[4/3] w-full max-w-[280px] flex-col justify-between rounded-xl border border-white/10 bg-zinc-900/80 p-4 shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] text-zinc-500">Document Reader</span>
                    <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] text-zinc-300">PDF</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center gap-2">
                    <BookOpen className="h-8 w-8 text-purple-400 opacity-80" />
                  </div>
                  <div className="flex h-6 w-full items-center justify-center rounded border border-white/10 bg-white/5 text-[10px] font-semibold text-zinc-400">
                    Fullscreen
                  </div>
                </div>
              </div>
            </article>

            {/* Step 3 */}
            <article className="relative mb-16 flex flex-col items-center gap-8 md:flex-row md:gap-0">
              <div className="flex w-full justify-center md:w-1/2 md:justify-end md:pr-12">
                {/* Mockup Card */}
                <div aria-hidden="true" className="flex aspect-[4/3] w-full max-w-[280px] flex-col justify-between rounded-xl border border-white/10 bg-zinc-900/80 p-4 shadow-lg backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-medium text-zinc-500">Uploader</span>
                    <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-bold text-purple-400">DRAG</span>
                  </div>
                  <div className="my-2 flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10">
                    <Upload className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex h-6 w-full items-center justify-center rounded bg-gradient-to-r from-purple-600 to-pink-600 text-[10px] font-bold text-white">
                    Submit File
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">3</div>
              </div>
              <div className="w-full text-center md:w-1/2 md:pl-12 md:text-left">
                <h3 className="mb-2 text-lg font-bold text-zinc-50">Share & Upload</h3>
                <p className="mx-auto max-w-sm text-sm leading-relaxed text-zinc-400 md:mx-0">
                  Drag and drop files to list them. Help other students succeed by contributing your notes.
                </p>
              </div>
            </article>

            {/* Step 4 (End) */}
            <article className="relative pt-8 text-center flex flex-col items-center">
              <div aria-hidden="true" className="absolute left-1/2 top-0 flex -translate-x-1/2 items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]">4</div>
              </div>
              <div className="pt-16 max-w-sm">
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-400">
                  <RefreshCw className="h-3.5 w-3.5 text-purple-400" /> Simplifying Study
                </span>
                <h3 className="mb-2 text-lg font-bold text-zinc-50">Direct & Clean</h3>
                <p className="text-sm leading-relaxed text-zinc-400">
                  We guarantee direct document downloads without annoying ads, redirect links, or hidden subscriptions.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ===== PLATFORM STATS ===== */}
      <section aria-label="Platform Statistics" className="border-t border-white/5 bg-white/[0.01] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Notes Available", value: totalNotes, icon: FileText },
              { label: "Active Scholars", value: totalUsers, icon: Users },
              { label: "Total Downloads", value: totalDownloads, icon: Download },
              { label: "Total Views", value: totalViews, icon: Eye },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center backdrop-blur-md">
                <stat.icon className="mb-2 h-6 w-6 text-purple-400" aria-hidden="true" />
                <span className="text-3xl font-extrabold tracking-tight text-zinc-50">{stat.value}</span>
                <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section aria-labelledby="categories-heading" className="border-t border-white/5 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 id="categories-heading" className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-500">
                Subjects
              </h2>
              <p className="text-3xl font-extrabold text-zinc-50">Browse by Category</p>
            </div>
            <Link 
              href="/categories" 
              className="group flex items-center gap-1.5 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-50"
            >
              View all subjects 
              <ArrowRight className="h-4 w-4 text-purple-400 transition-transform group-hover:translate-x-1" />
            </Link>
          </header>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoriesFromDb.map((category) => {
              const gradient = categoryGradients[category.slug] || "from-purple-600 to-pink-600";
              const emoji = categoryEmojis[category.slug] || "📚";
              return (
                <Link
                  key={category.id}
                  href={`/search?q=&subject=${encodeURIComponent(category.name)}`}
                  className={`group relative flex h-40 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 shadow-lg transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950`}
                  aria-label={`Browse ${category.name} notes (${category._count.notes} total)`}
                >
                  {/* Decorative Elements */}
                  <div aria-hidden="true" className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full border border-white/20" />
                  <div aria-hidden="true" className="absolute -bottom-14 -right-14 h-36 w-36 rounded-full border border-white/20" />

                  <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-extrabold leading-tight text-white">{category.name}</h3>
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                      {category._count.notes} note{category._count.notes !== 1 ? "s" : ""}
                    </span>
                    <span className="text-3xl opacity-70 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100" aria-hidden="true">
                      {emoji}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== RECENT UPLOADS ===== */}
      {recentNotes.length > 0 && (
        <section aria-labelledby="recent-heading" className="border-t border-white/5 py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950">
          <div className="max-w-6xl mx-auto">
            <header className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 id="recent-heading" className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-purple-500">
                  Latest Contributions
                </h2>
                <p className="text-3xl font-extrabold text-zinc-50">Recent Uploads</p>
              </div>
              <Link 
                href="/search" 
                className="group flex items-center gap-1.5 text-sm font-semibold text-zinc-400 transition-colors hover:text-zinc-50"
              >
                View all uploads 
                <ArrowRight className="h-4 w-4 text-purple-400 transition-transform group-hover:translate-x-1" />
              </Link>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {recentNotes.map((note) => {
                const isDrive = note.fileKey === "external";
                return (
                  <Link 
                    key={note.id} 
                    href={`/notes/${note.id}`} 
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.01] px-4 py-3">
                      <span className="max-w-[120px] truncate text-[10px] font-bold text-zinc-400">
                        {note.subject || note.category?.name || "General"}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                        isDrive ? "border-amber-500/20 bg-amber-500/10 text-amber-400" 
                        : "border-purple-500/20 bg-purple-500/10 text-purple-400"
                      }`}>
                        {isDrive ? "Drive" : "PDF"}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-zinc-50 transition-colors group-hover:text-purple-400">
                        {note.title}
                      </h3>
                      <p className="mb-4 flex-grow line-clamp-2 text-xs leading-relaxed text-zinc-500">
                        {note.description || "No description provided."}
                      </p>
                      <footer className="mt-auto flex items-center justify-between border-t border-white/5 pt-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 text-[9px] font-bold text-zinc-50" aria-hidden="true">
                            {note.author.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span className="max-w-[80px] truncate text-[10px] text-zinc-400">{note.author.name}</span>
                        </div>
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-purple-400 transition-transform group-hover:translate-x-1">
                          Read <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </footer>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== BOTTOM CTA ===== */}
      <section aria-labelledby="cta-heading" className="border-t border-white/5 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/60 to-pink-900/40 p-10 text-center text-zinc-50 backdrop-blur-md sm:p-16">
            
            {/* Ambient decorative glow */}
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[100px]" />

            <div className="relative z-10">
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                Get Started
              </span>
              <h2 id="cta-heading" className="mb-4 text-3xl sm:text-4xl font-extrabold tracking-tight">
                Ready to Share Your Knowledge?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-zinc-300">
                Join thousands of students already uploading and reading academic papers globally.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link 
                  href="/upload" 
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                >
                  <Upload className="h-4 w-4" aria-hidden="true" /> Upload Study Material
                </Link>
                <Link 
                  href="/categories" 
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-900"
                >
                  Browse Directory <ArrowRight className="h-4 w-4 text-purple-400" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
