import Link from "next/link";
import { prisma } from "@/lib/prisma";
import * as Icons from "lucide-react";

export const dynamic = "force-dynamic";

const categorySubtitles: Record<string, string> = {
  "computer-science": "Smart & Code",
  "mathematics": "Equations & Logic",
  "physics": "Quantum & Space",
  "engineering": "Robots & Build",
  "chemistry": "Atoms & Reactions",
  "biology": "Life & DNA",
  "business": "Markets & Strategy",
  "law": "Order & Justice",
};

const categoryGradients: Record<string, string> = {
  "computer-science": "from-indigo-500 via-indigo-600 to-purple-600",
  "mathematics": "from-blue-400 via-blue-500 to-indigo-600",
  "physics": "from-[#ff758c] via-[#ff7e93] to-[#ff7eb3]",
  "engineering": "from-cyan-400 via-sky-500 to-blue-600",
  "chemistry": "from-rose-400 via-red-500 to-orange-500",
  "biology": "from-emerald-400 via-teal-500 to-cyan-600",
  "business": "from-amber-400 via-orange-555 to-red-500",
  "law": "from-slate-500 via-zinc-600 to-neutral-800",
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
  const totalNotes = await prisma.note.count({ where: { status: "PUBLISHED" } });
  const totalUsers = await prisma.user.count();
  const aggregateStats = await prisma.note.aggregate({
    where: { status: "PUBLISHED" },
    _sum: { downloads: true, views: true },
  });
  const totalDownloads = aggregateStats._sum.downloads || 0;
  const totalViews = aggregateStats._sum.views || 0;

  const categoriesFromDb = await prisma.category.findMany({
    take: 8,
    include: { _count: { select: { notes: true } } },
    orderBy: { notes: { _count: "desc" } },
  });

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
    { label: "Notes Shared",    value: `${totalNotes}`,     icon: Icons.FileText },
    { label: "Active Students", value: `${totalUsers}`,     icon: Icons.Users },
    { label: "Downloads",       value: `${totalDownloads}`, icon: Icons.Download },
    { label: "Total Views",     value: `${totalViews}`,     icon: Icons.Eye },
  ];

  const features = [
    { icon: Icons.Zap,       title: "Lightning Fast",           description: "Pages load instantly. Search returns results in milliseconds. No waiting.",                               color: "from-amber-400 to-amber-600" },
    { icon: Icons.Upload,    title: "Upload in Seconds",         description: "Drag, drop, add a title and subject. Your notes are live in under a minute.",                              color: "from-indigo-400 to-indigo-600" },
    { icon: Icons.BookOpen,  title: "Distraction-Free Reading",  description: "Large reading area, zoom controls, dark mode, and fullscreen. Focus on what matters.",                    color: "from-emerald-400 to-emerald-600" },
    { icon: Icons.Search,    title: "Smart Search",              description: "Typo-tolerant search with instant suggestions. Find any note in seconds.",                                color: "from-blue-400 to-blue-600" },
    { icon: Icons.Shield,    title: "Community Moderated",       description: "Quality content maintained by active moderation and community ratings.",                                  color: "from-purple-400 to-purple-600" },
    { icon: Icons.TrendingUp, title: "Always Growing",           description: "New notes added daily across every subject and semester.",                                                 color: "from-rose-400 to-rose-600" },
  ];

  return (
    <div className="relative bg-[#f4f1ea] overflow-hidden">
      
      {/* Decorative background bubbles/blobs */}
      <div className="absolute top-24 left-[8%] w-6 h-6 rounded-full bg-[#d24b28]/10 animate-bubble-float z-0" />
      <div className="absolute top-48 right-[12%] w-4 h-4 rounded-full bg-[#d24b28]/15 animate-bubble-float z-0" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-[5%] w-8 h-8 rounded-full bg-[#d24b28]/8 animate-bubble-float z-0" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-[20%] right-[10%] w-6 h-6 rounded-full bg-[#d24b28]/10 animate-bubble-float z-0" style={{ animationDelay: '4.5s' }} />

      {/* ===== HERO — bg full-width, content centred ===== */}
      <section
        className="relative font-sans select-none overflow-hidden"
        style={{ backgroundImage: "radial-gradient(circle, rgba(210,75,40,0.035) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      >
        {/* Star sticker */}
        <div className="absolute top-8 left-[4%] lg:left-[8%] hidden sm:block animate-pulse pointer-events-none z-0">
          <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#d24b28]/30" style={{ transform: "rotate(15deg)" }}>
            <path fill="currentColor" d="M50 0 L55 35 L90 10 L65 45 L100 50 L65 55 L90 90 L55 65 L50 100 L45 65 L10 90 L35 55 L0 50 L35 45 L10 10 L45 35 Z" />
          </svg>
        </div>

        {/* Upgraded premium graphics sticker */}
        <div className="absolute bottom-[24%] left-[4%] lg:left-[8%] hidden lg:block z-20 hover:scale-110 transition-transform cursor-pointer">
          <div className="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center shadow-sm">
            <Icons.Sparkles className="w-5 h-5 text-[#d24b28]" />
          </div>
        </div>

        {/* Stones stack */}
        <div className="absolute bottom-[24%] right-[4%] lg:right-[8%] hidden lg:flex flex-col items-center gap-0.5 z-0">
          <div className="w-7 h-7 bg-[#b8cfc2]/50 rounded-t-full border border-black/5 shadow-sm" />
          <div className="w-10 h-3 bg-[#e8c6b4]/50 rounded-full border border-black/5 shadow-sm" />
          <div className="w-14 h-3.5 bg-[#ccd5b2]/50 rounded-full border border-black/5 shadow-sm" />
        </div>

        {/* Hero content — centered on mobile, 2-column grid on desktop */}
        <div className="site-container relative z-10 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Text & Actions */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[#d24b28] bg-[#d24b28]/10 px-3.5 py-1.5 rounded-full">
                  Your Academic Hub
                </span>
              </div>

              <h1 className="font-black tracking-tight uppercase text-black leading-none mt-6">
                <span className="block text-[2.5rem] sm:text-[4rem] xl:text-[4.75rem]">Find &amp; Share</span>
                <span className="block text-[2.5rem] sm:text-[4rem] xl:text-[4.75rem] text-[#d24b28]">
                  Notes OS
                </span>
                <span className="block text-[2.5rem] sm:text-[4rem] xl:text-[4.75rem] text-zinc-800">
                  Study Faster
                </span>
              </h1>

              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <span className="inline-flex items-center -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
                  ].map((src, i) => (
                    <span key={i} className="w-8 h-8 rounded-full border border-white overflow-hidden block shadow-sm" style={{ zIndex: i }}>
                      <img src={src} alt="student" className="w-full h-full object-cover" />
                    </span>
                  ))}
                </span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-zinc-550">
                  Trusted by students worldwide
                </span>
              </div>

              <p className="mt-6 text-xs sm:text-sm font-medium text-zinc-500 max-w-md leading-relaxed">
                No clutter. No distractions. A clean, premium academic directory for students to share and access study material.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link
                  href="/search"
                  className="bg-gradient-to-r from-[#d24b28] via-[#e25c28] to-[#ffaa00] hover:from-[#be3e1d] hover:via-[#d24b28] hover:to-[#e69500] hover:scale-[1.02] active:scale-95 text-white rounded-full font-semibold text-base px-10 py-4 inline-flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg duration-200 w-full sm:w-auto"
                >
                  Explore Platform <Icons.ArrowRight className="w-5 h-5 text-white" />
                </Link>
                <Link
                  href="/upload"
                  className="bg-white hover:bg-[#d24b28]/5 border-2 border-[#d24b28] hover:scale-[1.02] active:scale-95 text-[#d24b28] rounded-full font-semibold text-base px-10 py-4 inline-flex items-center justify-center gap-2.5 transition-all shadow-sm duration-200 w-full sm:w-auto"
                >
                  Upload Notes <Icons.Upload className="w-5 h-5 text-[#d24b28]" />
                </Link>
              </div>

              <div className="mt-10 text-[#d24b28] font-bold animate-bounce hidden lg:block">
                <Icons.ChevronDown className="w-5 h-5" />
              </div>
            </div>

            {/* Right Column: 3D Cartoon Illustration */}
            <div className="lg:col-span-5 flex justify-center items-center relative animate-fade-in-up">
              {/* Soft background radial glow */}
              <div className="absolute w-72 h-72 rounded-full bg-[#d24b28]/5 filter blur-3xl pointer-events-none" />
              <img 
                src="/students.png" 
                alt="Students studying 3D illustration" 
                className="w-full max-w-[380px] sm:max-w-[420px] lg:max-w-full object-contain mix-blend-multiply select-none pointer-events-none animate-bubble-float z-10"
              />
            </div>

          </div>
        </div>

        {/* Floating Mission & Stats Card */}
        <div className="site-container mt-4 pb-16 relative z-10">
          <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden">
            {/* Top Half: Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 md:p-12">
              <div className="flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#d24b28] mb-3">— Our Mission</p>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black leading-tight">
                  NotesOS is the world's cleanest &amp; simplest notes platform.
                </h2>
              </div>
              <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-zinc-100 md:pl-10 pt-6 md:pt-0">
                <p className="text-sm font-medium leading-relaxed text-zinc-550 max-w-md">
                  A community-driven directory to browse digital notes, lecture slides, study guides, and past exams. Built for students, by students.
                </p>
                <Link href="/categories" className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black hover:text-[#d24b28] transition-colors w-fit">
                  Browse All Subjects <Icons.ArrowRight className="w-3.5 h-3.5 text-[#d24b28]" />
                </Link>
              </div>
            </div>

            {/* Bottom Half: Stats Strip */}
            <div className="bg-black text-[#f4f1ea] p-8 sm:p-10 border-t border-zinc-900">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 lg:gap-y-0 lg:divide-x lg:divide-zinc-800">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center justify-center text-center px-4">
                    <stat.icon className="w-5 h-5 text-[#d24b28] mb-2" />
                    <span className="text-3xl sm:text-4xl font-black tracking-tighter text-white">{stat.value}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#f4f1ea]/40 mt-1">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SIMPLE WORKFLOW SECTION ===== */}
      <section className="section-padding bg-[#f4f1ea] border-t border-black/5">
        <div className="site-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Workflow Steps */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#d24b28] mb-3">— How it works</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-black mb-3">Simple Process!</h2>
              <p className="text-xs sm:text-sm text-zinc-500 font-medium max-w-xl mb-8 leading-relaxed">
                We make it incredibly easy to find, share, and study notes. No clutter, no distractions. Here is how you can get started:
              </p>

              <div className="relative pl-16 space-y-8 text-left max-w-xl">
                {/* Dotted connecting line aligned perfectly at 28px center */}
                <div className="absolute left-[28px] top-5 bottom-5 w-px border-l-2 border-dashed border-[#d24b28]/30 z-0" />
                
                {/* Step 1 */}
                <div className="relative flex items-start gap-4 z-10">
                  <span className="absolute -left-14 w-10 h-10 rounded-full bg-[#d24b28] text-white flex items-center justify-center text-xs font-black shadow-sm">1</span>
                  <div className="pl-2 pt-1.5">
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-black">Find Notes</h3>
                    <p className="text-[11px] font-semibold text-zinc-550 mt-1 leading-relaxed">
                      Search notes by subject, semester, or university to access study material instantly.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative flex items-start gap-4 z-10">
                  <span className="absolute -left-14 w-10 h-10 rounded-full bg-[#d24b28] text-white flex items-center justify-center text-xs font-black shadow-sm">2</span>
                  <div className="pl-2 pt-1.5">
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-black">Read Instantly</h3>
                    <p className="text-[11px] font-semibold text-zinc-550 mt-1 leading-relaxed">
                      Open documents in our high-performance, clutter-free online PDF viewer.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex items-start gap-4 z-10">
                  <span className="absolute -left-14 w-10 h-10 rounded-full bg-[#d24b28] text-white flex items-center justify-center text-xs font-black shadow-sm">3</span>
                  <div className="pl-2 pt-1.5">
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-black">Share Material</h3>
                    <p className="text-[11px] font-semibold text-zinc-550 mt-1 leading-relaxed">
                      Upload your own lecture notes or study guides in seconds to help the community.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative flex items-start gap-4 z-10">
                  <span className="absolute -left-14 w-10 h-10 rounded-full bg-[#d24b28] text-white flex items-center justify-center text-xs font-black shadow-sm">4</span>
                  <div className="pl-2 pt-1.5">
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-black">Grow Profile</h3>
                    <p className="text-[11px] font-semibold text-zinc-550 mt-1 leading-relaxed">
                      Build your academic presence, track your downloads, and earn recognition.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons with clean margins */}
              <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
                <Link
                  href="/search"
                  className="bg-gradient-to-r from-[#d24b28] via-[#e25c28] to-[#ffaa00] hover:from-[#be3e1d] hover:via-[#d24b28] hover:to-[#e69500] hover:scale-[1.02] active:scale-95 text-white rounded-full font-semibold text-base px-10 py-4 inline-flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg duration-200 w-full sm:w-auto"
                >
                  Get Started <Icons.ArrowRight className="w-5 h-5 text-white" />
                </Link>
                <Link
                  href="/categories"
                  className="bg-white hover:bg-[#d24b28]/5 border-2 border-[#d24b28] hover:scale-[1.02] active:scale-95 text-[#d24b28] rounded-full font-semibold text-base px-10 py-4 inline-flex items-center justify-center gap-2.5 transition-all shadow-sm duration-200 w-full sm:w-auto"
                >
                  Browse Subjects <Icons.ArrowRight className="w-5 h-5 text-[#d24b28]" />
                </Link>
              </div>
            </div>

            {/* Right Column: 3D Workflow Illustration - Completely Static */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <img 
                src="/workflow.png" 
                alt="Student studying in armchair 3D illustration" 
                className="w-full max-w-[360px] sm:max-w-[400px] lg:max-w-full object-contain mix-blend-multiply select-none pointer-events-none z-10"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ===== RECENT UPLOADS ===== */}
      {recentNotes.length > 0 && (
        <section className="section-padding bg-[#f4f1ea]">
          <div className="site-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#d24b28] mb-1">— Live</p>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">Recent Uploads</h2>
                <p className="mt-1 text-sm text-zinc-500 font-medium">Fresh notes shared by the community</p>
              </div>
              <Link href="/search" className="hidden sm:flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black border-b border-transparent hover:text-[#d24b28] transition-colors">
                Explore All <Icons.ArrowRight className="w-3.5 h-3.5 text-[#d24b28]" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentNotes.map((note) => {
                const isDrive = note.fileKey === "external";
                return (
                  <div key={note.id} className="group flex flex-col modern-card overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 bg-[#eae5db]/30">
                      <span className="text-[10px] font-black uppercase tracking-wider text-black truncate mr-2">{note.subject || note.category?.name || "General"}</span>
                      <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full ${isDrive ? "bg-amber-100 text-amber-800" : "bg-[#d24b28]/10 text-[#d24b28]"}`}>
                        {isDrive ? "Drive" : "PDF"}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="font-black text-sm text-black line-clamp-2 leading-tight mb-2 group-hover:text-[#d24b28] transition-colors">
                        {note.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed flex-1">
                        {note.description || "No description provided."}
                      </p>
                      <div className="mt-4 flex items-center justify-between pt-3.5 border-t border-zinc-100">
                        <div className="flex items-center gap-1.5">
                          <Icons.User className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="text-[10px] text-zinc-500 font-semibold truncate max-w-[80px]">{note.author.name}</span>
                        </div>
                        <Link href={`/notes/${note.id}`} className="text-[10px] font-bold uppercase tracking-wider text-[#d24b28] hover:text-[#be3e1d] transition-colors flex items-center gap-0.5">
                          Read <Icons.ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== CATEGORIES ===== */}
      <section className="section-padding bg-white rounded-t-[3rem] relative z-10">
        <div className="site-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#d24b28] bg-[#d24b28]/10 px-3.5 py-1.5 rounded-full mb-4 inline-block">
                Subjects
              </span>
              <h2 className="font-oswald font-black text-4xl sm:text-6xl tracking-tighter uppercase leading-[0.95] text-black">
                Browse by Category. <br />
                <span className="text-[#d24b28] italic font-medium">Infinite knowledge.</span>
              </h2>
            </div>
            <Link
              href="/categories"
              className="hidden sm:flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black border-b border-transparent hover:text-[#d24b28] transition-colors font-oswald"
              id="view-all-categories"
            >
              View all <Icons.ArrowRight className="w-3.5 h-3.5 text-[#d24b28]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {categoriesFromDb.map((category) => {
              const subtitle = categorySubtitles[category.slug] || "Study guides";
              const gradient = categoryGradients[category.slug] || "from-[#d24b28] via-[#e25c28] to-[#ffaa00]";
              const emoji = categoryEmojis[category.slug] || "📚";
              return (
                <Link
                  key={category.id}
                  href={`/search?q=&subject=${encodeURIComponent(category.name)}`}
                  className={`group relative flex flex-col justify-between p-6 rounded-[2rem] bg-gradient-to-br ${gradient} text-white shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden h-[180px]`}
                  id={`category-${category.slug}`}
                >
                  {/* Concentric decorative background circles radiating from bottom right */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border border-white/10 pointer-events-none" />
                  <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full border border-white/10 pointer-events-none" />
                  <div className="absolute -bottom-28 -right-28 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
                  <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />

                  {/* Top Text Area */}
                  <div className="flex flex-col z-10">
                    <h3 className="font-oswald font-bold text-xl uppercase tracking-tighter text-white leading-none">
                      {category.name}
                    </h3>
                    <span className="font-oswald text-[10px] font-semibold text-white/80 mt-1 uppercase tracking-wider">
                      {subtitle}
                    </span>
                  </div>

                  {/* Bottom Area: Notes Count Pill */}
                  <div className="z-10 mt-auto">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-[9px] font-bold uppercase tracking-wider text-white/95 backdrop-blur-sm">
                      {category._count.notes.toLocaleString()} note{category._count.notes !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* 3D Emoji Sticker */}
                  <div className="absolute -bottom-2 -right-2 text-5xl filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.3)] select-none transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:-translate-y-1 group-hover:-translate-x-1">
                    {emoji}
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="sm:hidden mt-8 text-center">
            <Link href="/categories" className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black border-b border-transparent font-oswald">
              View all categories <Icons.ArrowRight className="w-3.5 h-3.5 text-[#d24b28]" />
            </Link>
          </div>
        </div>

        {/* Repeating Banner Ticker at Bottom of Categories Section */}
        <div className="w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden bg-white border-t border-b border-black/5 py-5 mt-16 select-none">
          <div className="animate-scroll-ticker flex gap-12 text-black">
            {Array(8).fill(null).map((_, i) => (
              <div key={i} className="ticker-item flex items-center gap-12 text-sm sm:text-base font-bold uppercase tracking-wider">
                <span>Create Notes</span> <span className="text-[#d24b28]">🧡</span>
                <span>Grow Knowledge</span> <span className="text-[#d24b28]">📈</span>
                <span>Earn Points</span> <span className="text-[#d24b28]">🎯</span>
                <span>Study Smarter</span> <span className="text-[#d24b28]">🧠</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section-padding bg-[#f4f1ea]">
        <div className="site-container">
          <div className="text-center mb-14">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#d24b28] mb-2">— Why NotesOS</p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-3">Built for Speed &amp; Simplicity</h2>
            <p className="text-sm text-zinc-500 font-medium max-w-md mx-auto">
              Every feature is designed to make finding, uploading, and reading notes faster.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group flex flex-col gap-4 p-6 modern-card"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-black mb-1.5">{feature.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section-padding bg-[#f4f1ea] pb-20">
        <div className="site-container">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#d24b28] to-[#b43c1e] text-white rounded-3xl p-12 sm:p-20 text-center shadow-lg">
            {/* Floating background bubbles */}
            <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/5 animate-bubble-float pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-white/5 animate-bubble-float pointer-events-none" style={{ animationDelay: '1.5s' }} />

            <p className="text-[10px] font-black uppercase tracking-widest text-[#fcd34d] mb-4">— Get Started</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-6 leading-tight">
              Ready to Share<br />Your Knowledge?
            </h2>
            <p className="text-white/80 text-sm sm:text-base font-medium max-w-lg mx-auto mb-10 leading-relaxed">
              Join thousands of students already sharing and accessing notes. Upload takes less than a minute.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#d24b28] font-bold text-sm uppercase tracking-wider rounded-full shadow-md hover:bg-zinc-50 hover:scale-[1.02] transition-all"
                id="cta-upload"
              >
                <Icons.Upload className="w-4 h-4" />
                Upload Notes
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-white font-bold text-sm uppercase tracking-wider rounded-full border border-white/30 hover:border-white transition-all"
                id="cta-browse"
              >
                Browse Notes
                <Icons.ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
