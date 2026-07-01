import Link from "next/link";
import { prisma } from "@/lib/prisma";
import * as Icons from "lucide-react";

export const dynamic = "force-dynamic";

// Maps seeded category slugs to standard descriptions
const categoryDescriptions: Record<string, string> = {
  "computer-science": "Data structures, algorithms, programming, databases, OS",
  "mathematics": "Calculus, algebra, statistics, discrete math",
  "physics": "Mechanics, thermodynamics, optics, quantum physics",
  "engineering": "Mechanical, civil, electrical engineering fundamentals",
  "chemistry": "Organic, inorganic, physical chemistry",
  "biology": "Cell biology, genetics, ecology, microbiology",
  "business": "Management, marketing, finance, accounting",
  "law": "Constitutional, criminal, civil, corporate law",
};

export default async function HomePage() {
  // 1. Fetch live count stats
  const totalNotes = await prisma.note.count({ where: { status: "PUBLISHED" } });
  const totalUsers = await prisma.user.count();
  const aggregateStats = await prisma.note.aggregate({
    where: { status: "PUBLISHED" },
    _sum: { downloads: true, views: true },
  });
  
  const totalDownloads = aggregateStats._sum.downloads || 0;
  const totalViews = aggregateStats._sum.views || 0;

  // 2. Fetch top categories based on note counts
  const categoriesFromDb = await prisma.category.findMany({
    take: 8,
    include: {
      _count: {
        select: { notes: true },
      },
    },
    orderBy: {
      notes: {
        _count: "desc",
      },
    },
  });

  // 3. Fetch 4 most recent note uploads
  const recentNotes = await prisma.note.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: {
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  const stats = [
    { label: "Notes Shared", value: totalNotes > 0 ? `${totalNotes}` : "0", icon: Icons.FileText },
    { label: "Active Students", value: totalUsers > 0 ? `${totalUsers}` : "0", icon: Icons.Users },
    { label: "Downloads", value: totalDownloads > 0 ? `${totalDownloads}` : "0", icon: Icons.Download },
    { label: "Total Views", value: totalViews > 0 ? `${totalViews}` : "0", icon: Icons.Eye },
  ];

  const features = [
    {
      icon: Icons.Zap,
      title: "Lightning Fast",
      description: "Pages load instantly. Search returns results in milliseconds. No waiting.",
      color: "from-accent-400 to-accent-600",
    },
    {
      icon: Icons.Upload,
      title: "Upload in Seconds",
      description: "Drag, drop, add a title and subject. Your notes are live in under a minute.",
      color: "from-primary-400 to-primary-600",
    },
    {
      icon: Icons.BookOpen,
      title: "Distraction-Free Reading",
      description: "Large reading area, zoom controls, dark mode, and fullscreen. Focus on what matters.",
      color: "from-emerald-400 to-emerald-600",
    },
    {
      icon: Icons.Search,
      title: "Smart Search",
      description: "Typo-tolerant search with instant suggestions. Find any note in seconds.",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: Icons.Shield,
      title: "Community Moderated",
      description: "Quality content maintained by active moderation and community ratings.",
      color: "from-purple-400 to-purple-600",
    },
    {
      icon: Icons.TrendingUp,
      title: "Always Growing",
      description: "New notes added daily across every subject and semester.",
      color: "from-rose-400 to-rose-600",
    },
  ];

  return (
    <div className="relative">
      {/* OKTO-inspired Hero */}
      <section className="border-b-2 border-black bg-[#f4f1ea] text-black relative font-sans select-none overflow-hidden">
        {/* Decorative Grid borders */}
        <div className="absolute inset-0 pointer-events-none flex justify-center z-0">
          <div className="w-full max-w-6xl border-x-2 border-black/10 h-full hidden lg:block" />
        </div>

        {/* OKTO Header Bar */}
        <div className="border-b-2 border-black bg-[#f4f1ea]">
          <div className="max-w-6xl mx-auto px-6 sm:px-12 relative z-10">
            <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-1">
            <div className="border-2 border-black px-2 py-1.5 bg-black text-white font-black text-xs uppercase tracking-widest leading-none shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              NO
              <br />
              TE
            </div>
            <div className="border-2 border-black px-2 py-1.5 bg-[#f4f1ea] text-black font-black text-xs uppercase tracking-widest leading-none shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              OS
            </div>
          </div>

          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-[11px] font-black uppercase tracking-wider text-black w-max">
            <Link href="/search" className="hover:underline">Browse Notes</Link>
            <Link href="/categories" className="hover:underline">Categories</Link>
            <Link href="/upload" className="hover:underline">Upload</Link>
            <span className="text-zinc-400">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] tracking-normal font-bold lowercase text-zinc-600">{totalUsers} Active Students</span>
            </div>
          </div>

          <div>
            <Link 
              href="/upload" 
              className="px-5 py-2.5 bg-black text-white border-2 border-black font-black text-xs uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_rgba(210,75,40,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center"
            >
              Share Notes
            </Link>
          </div>
          </div>
        </div>
        </div>

        {/* Main Brutalist Hero Area */}
        <div className="max-w-6xl mx-auto px-6 sm:px-12 pt-16 pb-20 sm:pt-24 sm:pb-28 relative z-10">
          
          {/* Glowing/Decorative Stickers */}
          {/* Star polygon */}
          <div className="absolute top-10 left-[8%] hidden sm:block animate-pulse">
            <svg viewBox="0 0 100 100" className="w-14 h-14 text-[#d24b28]" style={{ transform: 'rotate(15deg)' }}>
              <path fill="currentColor" d="M50 0 L55 35 L90 10 L65 45 L100 50 L65 55 L90 90 L55 65 L50 100 L45 65 L10 90 L35 55 L0 50 L35 45 L10 10 L45 35 Z" />
            </svg>
          </div>

          {/* Leaf Sticker */}
          <div className="absolute bottom-16 left-[6%] hidden sm:block hover:scale-110 transition-transform">
            <div className="w-11 h-11 rounded-full border-2 border-black bg-white flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,1)] text-lg">
              🍃
            </div>
          </div>

          {/* Stack of stones bottom-right */}
          <div className="absolute bottom-16 right-[8%] hidden lg:flex flex-col items-center">
            <div className="w-8 h-8 bg-[#b8cfc2] rounded-t-full border-2 border-black transform translate-y-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
            <div className="w-12 h-4.5 bg-[#e8c6b4] rounded-full border-2 border-black transform translate-y-0.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
            <div className="w-16 h-5.5 bg-[#ccd5b2] rounded-full border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]" />
          </div>

          {/* Watch Showreel Sticker */}
          <div className="absolute top-12 right-[12%] hidden md:block">
            <Link href="/search" className="inline-flex items-center gap-2 bg-[#e8dbbf] border-2 border-black px-4.5 py-2 rounded-full text-[10px] font-black tracking-wider text-black rotate-[5deg] shadow-[3.5px_3.5px_0px_0px_rgba(0,0,0,1)] hover:rotate-0 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
              <span className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white text-[8px]">▶</span>
              <span>EXPLORE DIRECTORY</span>
            </Link>
          </div>

          <div className="text-center max-w-5xl mx-auto flex flex-col items-center">
            {/* Title Block */}
            <h1 className="text-[2.6rem] sm:text-[4.5rem] lg:text-[5.5rem] font-black tracking-tighter leading-[1.02] text-black uppercase max-w-4xl text-center">
              Find & Share
              <br />
              Notes{" "}
              {/* Slanted "STUDY" pill inside text */}
              <span className="inline-flex items-center justify-center bg-[#a6562b] text-[#f4f1ea] px-5 py-1 rounded-full text-sm sm:text-lg font-black tracking-widest uppercase border-2 border-black rotate-[-4deg] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:rotate-0 transition-transform mx-2 sm:mx-3">
                STUDY
              </span>{" "}
              Faster
              <br />
              Than Ever,{" "}
              {/* Avatars group inside text */}
              <span className="inline-flex items-center -space-x-3 mx-2 align-middle">
                <span className="w-8 h-8 rounded-full border-2 border-black bg-[#bcd4c4] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="student" className="w-full h-full object-cover" />
                </span>
                <span className="w-8 h-8 rounded-full border-2 border-black bg-[#dcb1a1] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="student" className="w-full h-full object-cover" />
                </span>
                <span className="w-8 h-8 rounded-full border-2 border-black bg-[#b1d4dc] overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="student" className="w-full h-full object-cover" />
                </span>
              </span>
              <br />
              <span className="text-[#657a6c] underline decoration-wavy decoration-[#d24b28] underline-offset-4">
                your first notesos
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-8 text-xs sm:text-sm font-semibold tracking-wide uppercase text-zinc-600 max-w-xl mx-auto leading-relaxed">
              No clutter. No distractions. Just a fast, brutalist academic directory for students to share and access study material.
            </p>

            {/* Explore Button */}
            <div className="mt-10 relative flex flex-col items-center">
              <Link 
                href="/search" 
                className="px-8 py-3.5 bg-[#f4f1ea] border-2 border-black text-black font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                Explore Platform
              </Link>
              <div className="mt-3 text-[#d24b28] font-bold text-lg animate-bounce">
                ↓
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Brutalist Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t-2 border-black bg-[#f4f1ea]">
          <div className="p-8 sm:p-10 border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black leading-tight">
              NotesOS is the world's cleanest & simplest notes platform.
            </h2>
          </div>
          <div className="p-8 sm:p-10 flex flex-col justify-center bg-[#eae5db]">
            <p className="text-xs sm:text-sm font-medium leading-relaxed text-black/80 max-w-md">
              A community-driven directory to browse digital notes, lecture slides, study guides, and past exams to boost your academic prep.
            </p>
          </div>
        </div>
      </section>

      {/* ===== RECENT UPLOADS SECTION ===== */}
      {recentNotes.length > 0 && (
        <section className="py-12 sm:py-16 border-y" style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
          <div className="max-w-6xl mx-auto px-6 sm:px-12">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Recent Uploads</h2>
                <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">Fresh notes shared by users in real time</p>
              </div>
              <Link href="/search" className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Explore All <Icons.ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentNotes.map((note) => {
                const isDrive = note.fileKey === "external";
                return (
                  <div key={note.id} className="group relative flex flex-col p-5 rounded-2xl border bg-card-bg hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300" style={{ borderColor: "var(--card-border)" }}>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
                        {note.subject}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isDrive ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300" : "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"}`}>
                        {isDrive ? "Drive Link" : "PDF"}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-surface-900 dark:text-surface-100 line-clamp-1 group-hover:text-primary-600 transition-colors mb-1">
                      {note.title}
                    </h3>
                    <p className="text-xs text-surface-400 line-clamp-2 mb-4 leading-relaxed h-8">
                      {note.description || "No description provided."}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--card-border)" }}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Icons.User className="w-3.5 h-3.5 text-surface-400 flex-shrink-0" />
                        <span className="text-xs text-surface-500 truncate font-medium">{note.author.name}</span>
                      </div>
                      <Link href={`/notes/${note.id}`} className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center gap-0.5">
                        Read <Icons.ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Browse by Category
              </h2>
              <p className="mt-2 text-surface-500 dark:text-surface-400">
                Find notes organized by your field of study
              </p>
            </div>
            <Link
              href="/categories"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary-600 
                dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              id="view-all-categories"
            >
              View all
              <Icons.ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
            {categoriesFromDb.map((category) => {
              const IconComp = (Icons as any)[category.icon || ""] || Icons.BookOpen;
              const colorClass = category.color || "#4f46e5";
              const desc = categoryDescriptions[category.slug] || `${category.name} lecture notes`;

              return (
                <Link
                  key={category.id}
                  href={`/categories?q=${encodeURIComponent(category.name)}`}
                  className="group flex flex-col items-start gap-3 p-5 rounded-2xl border
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                  style={{
                    background: "var(--card-bg)",
                    borderColor: "var(--card-border)",
                  }}
                  id={`category-${category.slug}`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center
                      shadow-sm group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${colorClass}15`, color: colorClass }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-surface-900 dark:text-surface-100 
                      group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-surface-400 mt-0.5">
                      {category._count.notes.toLocaleString()} note{category._count.notes !== 1 ? "s" : ""}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="sm:hidden mt-6 text-center">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 
                dark:text-primary-400"
            >
              View all categories
              <Icons.ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-16 sm:py-20" style={{ background: "var(--muted-bg)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Built for Speed & Simplicity
            </h2>
            <p className="text-surface-500 dark:text-surface-400">
              Every feature is designed to make finding, uploading, and reading notes faster.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border transition-all duration-300 
                  hover:-translate-y-1 hover:shadow-card-hover"
                style={{
                  background: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                }}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} 
                  flex items-center justify-center shadow-sm mb-4
                  group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-surface-900 dark:text-surface-100">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 
            p-8 sm:p-12 lg:p-16 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 
              bg-accent-500/10 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Ready to Share Your Knowledge?
              </h2>
              <p className="text-primary-200 text-base sm:text-lg max-w-xl mx-auto mb-8">
                Join thousands of students who are already sharing and accessing notes. 
                Upload takes less than a minute.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl
                    bg-white text-primary-700 font-semibold text-base
                    hover:bg-primary-50 shadow-lg hover:shadow-xl
                    transition-all duration-200 hover:-translate-y-0.5"
                  id="cta-upload"
                >
                  <Icons.Upload className="w-5 h-5" />
                  Upload Notes
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl
                    bg-white/10 text-white font-semibold text-base border border-white/20
                    hover:bg-white/20 transition-all duration-200"
                  id="cta-browse"
                >
                  Browse Notes
                  <Icons.ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
