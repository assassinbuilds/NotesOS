import Link from "next/link";
import { prisma } from "@/lib/prisma";
import * as Icons from "lucide-react";

export const dynamic = "force-dynamic";

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
    <div className="relative">

      {/* ===== HERO — bg full-width, content centred ===== */}
      <section
        className="border-b-2 border-black bg-[#f4f1ea] text-black relative font-sans select-none overflow-hidden"
        style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      >
        {/* Hero content — centred inside site-container */}
        <div 
          className="site-container relative z-10 flex flex-col items-center text-center"
          style={{ paddingTop: "3cm", paddingBottom: "3cm" }}
        >
          
          {/* Decorative stickers — positioned relative to the content area so they stay locked near the text */}
          {/* Star sticker */}
          <div className="absolute top-2 left-[4%] lg:left-[12%] hidden sm:block animate-pulse pointer-events-none z-0">
            <svg viewBox="0 0 100 100" className="w-10 h-10 text-[#d24b28]" style={{ transform: "rotate(15deg)" }}>
              <path fill="currentColor" d="M50 0 L55 35 L90 10 L65 45 L100 50 L65 55 L90 90 L55 65 L50 100 L45 65 L10 90 L35 55 L0 50 L35 45 L10 10 L45 35 Z" />
            </svg>
          </div>
          
          {/* Explore Directory pill */}
          <div className="absolute top-4 right-[4%] lg:right-[12%] hidden md:block z-10">
            <Link href="/search" className="inline-flex items-center gap-2 bg-[#e8dbbf] border-2 border-black px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider text-black rotate-[5deg] shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:rotate-0 hover:shadow-none transition-all">
              <span className="w-4 h-4 rounded-full bg-black flex items-center justify-center text-white text-[7px]">▶</span>
              <span>EXPLORE DIRECTORY</span>
            </Link>
          </div>
          
          {/* Leaf sticker */}
          <div className="absolute bottom-[24%] left-[6%] lg:left-[14%] hidden lg:block z-10 hover:scale-110 transition-transform cursor-pointer">
            <div className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center shadow-[3px_3px_0px_rgba(0,0,0,1)] text-lg">🍃</div>
          </div>
          
          {/* Stones stack */}
          <div className="absolute bottom-[24%] right-[6%] lg:right-[14%] hidden lg:flex flex-col items-center gap-0.5 z-0">
            <div className="w-7 h-7 bg-[#b8cfc2] rounded-t-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
            <div className="w-10 h-3 bg-[#e8c6b4] rounded-full border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]" />
            <div className="w-14 h-3.5 bg-[#ccd5b2] rounded-full border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]" />
          </div>

          <h1 className="font-black tracking-tighter uppercase text-black leading-[0.95]">
            <span className="block text-[2.5rem] sm:text-[4rem] lg:text-[5rem] xl:text-[5.5rem]">Find &amp; Share</span>
            <span className="block text-[2.5rem] sm:text-[4rem] lg:text-[5rem] xl:text-[5.5rem]">
              Notes{" "}
              <span
                className="inline-flex items-center justify-center bg-[#a6562b] text-[#f4f1ea] rounded-full border-2 border-black rotate-[-4deg] shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:rotate-0 transition-transform"
                style={{ fontSize: "0.36em", padding: "0.12em 0.6em", verticalAlign: "middle" }}
              >
                STUDY
              </span>{" "}
              Faster
            </span>
            <span className="block text-[2.5rem] sm:text-[4rem] lg:text-[5rem] xl:text-[5.5rem]">Than Ever</span>
          </h1>

          <div className="mt-2">
            <span className="text-[1.2rem] sm:text-[2rem] lg:text-[2.4rem] font-black uppercase tracking-tighter text-[#657a6c] underline decoration-wavy decoration-[#d24b28] underline-offset-4">
              Your First NotesOS
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex items-center -space-x-2">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
              ].map((src, i) => (
                <span key={i} className="w-8 h-8 rounded-full border-2 border-black overflow-hidden block" style={{ zIndex: i }}>
                  <img src={src} alt="student" className="w-full h-full object-cover" />
                </span>
              ))}
            </span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-zinc-500">
              Trusted by students worldwide
            </span>
          </div>

          <p className="mt-4 text-xs sm:text-sm font-medium text-zinc-500 max-w-md leading-relaxed">
            No clutter. No distractions. A fast, brutalist academic directory for students to share and access study material.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/search"
              className="px-6 py-3 bg-black text-[#f4f1ea] font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_rgba(210,75,40,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Explore Platform
            </Link>
            <Link
              href="/upload"
              className="px-6 py-3 bg-[#f4f1ea] text-black font-black text-xs uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Upload Notes
            </Link>
          </div>

          <div className="mt-6 text-[#d24b28] font-bold text-lg animate-bounce">↓</div>
        </div>

        {/* Bottom split — full width backgrounds, centred text via padding */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t-2 border-black">
          <div className="border-b-2 md:border-b-0 md:border-r-2 border-black flex flex-col justify-center bg-[#f4f1ea]">
            <div className="site-container py-14 sm:py-20">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#d24b28] mb-3">— Our Mission</p>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black leading-tight">
                NotesOS is the world's cleanest &amp; simplest notes platform.
              </h2>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-[#eae5db]">
            <div className="site-container py-14 sm:py-20">
              <p className="text-sm font-medium leading-relaxed text-black/70 max-w-md">
                A community-driven directory to browse digital notes, lecture slides, study guides, and past exams. Built for students, by students.
              </p>
              <Link href="/categories" className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black border-b-2 border-black pb-0.5 hover:text-[#d24b28] hover:border-[#d24b28] transition-colors">
                Browse All Subjects <Icons.ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className="border-b-2 border-black bg-black text-[#f4f1ea]">
        <div className="site-container py-12 sm:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 lg:gap-y-0 lg:divide-x-2 lg:divide-[#f4f1ea]/10">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center justify-center text-center px-4">
                <stat.icon className="w-5 h-5 text-[#d24b28] mb-2" />
                <span className="text-4xl font-black tracking-tighter text-white">{stat.value}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#f4f1ea]/40 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RECENT UPLOADS ===== */}
      {recentNotes.length > 0 && (
        <section className="section-padding bg-[#f4f1ea] border-b-2 border-black">
          <div className="site-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#d24b28] mb-1">— Live</p>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">Recent Uploads</h2>
                <p className="mt-1 text-sm text-zinc-500 font-medium">Fresh notes shared by the community</p>
              </div>
              <Link href="/search" className="hidden sm:flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black border-b-2 border-black pb-0.5 hover:text-[#d24b28] hover:border-[#d24b28] transition-colors">
                Explore All <Icons.ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recentNotes.map((note) => {
                const isDrive = note.fileKey === "external";
                return (
                  <div key={note.id} className="group flex flex-col border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200">
                    <div className="flex items-center justify-between px-4 py-3 border-b-2 border-black bg-[#eae5db]">
                      <span className="text-[10px] font-black uppercase tracking-wider text-black truncate mr-2">{note.subject || note.category?.name || "General"}</span>
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border border-black flex-shrink-0 ${isDrive ? "bg-[#f59e0b] text-black" : "bg-black text-white"}`}>
                        {isDrive ? "Drive" : "PDF"}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 p-4">
                      <h3 className="font-black text-sm text-black line-clamp-2 leading-tight mb-2 group-hover:text-[#d24b28] transition-colors">
                        {note.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed flex-1">
                        {note.description || "No description provided."}
                      </p>
                      <div className="mt-4 flex items-center justify-between pt-3 border-t border-black/10">
                        <div className="flex items-center gap-1.5">
                          <Icons.User className="w-3 h-3 text-zinc-400" />
                          <span className="text-[10px] text-zinc-500 font-semibold truncate max-w-[80px]">{note.author.name}</span>
                        </div>
                        <Link href={`/notes/${note.id}`} className="text-[10px] font-black uppercase tracking-wider text-black border-b border-black hover:text-[#d24b28] hover:border-[#d24b28] transition-colors flex items-center gap-0.5">
                          Read <Icons.ChevronRight className="w-3 h-3" />
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
      <section className="section-padding bg-white border-b-2 border-black">
        <div className="site-container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#d24b28] mb-1">— Subjects</p>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">Browse by Category</h2>
              <p className="mt-1 text-sm text-zinc-500 font-medium">Find notes organized by your field of study</p>
            </div>
            <Link
              href="/categories"
              className="hidden sm:flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black border-b-2 border-black pb-0.5 hover:text-[#d24b28] hover:border-[#d24b28] transition-colors"
              id="view-all-categories"
            >
              View all <Icons.ArrowRight className="w-3.5 h-3.5" />
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
                  className="group flex flex-col gap-3 p-5 border-2 border-black bg-[#f4f1ea] shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200"
                  id={`category-${category.slug}`}
                >
                  <div
                    className="w-11 h-11 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform flex-shrink-0"
                    style={{ backgroundColor: `${colorClass}22`, color: colorClass }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-tight text-black leading-tight">{category.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                      {category._count.notes.toLocaleString()} note{category._count.notes !== 1 ? "s" : ""}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed line-clamp-2">{desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="sm:hidden mt-6 text-center">
            <Link href="/categories" className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black border-b-2 border-black pb-0.5">
              View all categories <Icons.ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section-padding bg-[#eae5db] border-b-2 border-black">
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
                className="group flex flex-col gap-4 p-6 border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
              >
                <div className={`w-12 h-12 border-2 border-black bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:scale-105 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
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
      <section className="section-padding bg-black text-[#f4f1ea]">
        <div className="site-container">
          <div className="border-2 border-[#f4f1ea]/20 p-14 sm:p-24 text-center relative overflow-hidden">
            <div className="absolute top-5 left-5 w-10 h-10 border-2 border-[#d24b28] opacity-20 pointer-events-none" />
            <div className="absolute bottom-5 right-5 w-7 h-7 border-2 border-[#d24b28] opacity-20 pointer-events-none" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#d24b28] mb-4">— Get Started</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-white mb-6 leading-tight">
              Ready to Share<br />Your Knowledge?
            </h2>
            <p className="text-[#f4f1ea]/50 text-sm sm:text-base font-medium max-w-lg mx-auto mb-10 leading-relaxed">
              Join thousands of students already sharing and accessing notes. Upload takes less than a minute.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#d24b28] text-white font-black text-sm uppercase tracking-wider border-2 border-[#d24b28] shadow-[4px_4px_0px_rgba(244,241,234,0.25)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                id="cta-upload"
              >
                <Icons.Upload className="w-4 h-4" />
                Upload Notes
              </Link>
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-[#f4f1ea] font-black text-sm uppercase tracking-wider border-2 border-[#f4f1ea]/30 hover:border-[#f4f1ea] transition-all"
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
