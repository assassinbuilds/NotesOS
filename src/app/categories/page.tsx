import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CategoryImage from "@/components/CategoryImage";
import { ArrowRight, BookOpen, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

const categorySubtitles: Record<string, string> = {
  "computer-science": "Code & Algorithms",
  "mathematics": "Logic & Formulas",
  "physics": "Matter & Quantum",
  "engineering": "Design & Systems",
  "chemistry": "Reactions & Elements",
  "biology": "Genetics & Systems",
  "business": "Finance & Strategy",
  "law": "Justice & Statutes",
};

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

export default async function CategoriesPage() {
  const categoriesFromDb = await prisma.category.findMany({
    include: {
      _count: {
        select: { notes: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const totalNotes = categoriesFromDb.reduce((sum, cat) => sum + cat._count.notes, 0);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50 selection:bg-purple-500/30">
      
      {/* Ambient background glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-1/2 top-[-10%] -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-purple-600/20 blur-[100px]" 
      />

      {/* Hero Section */}
      <section aria-labelledby="categories-heading" className="relative z-10 pt-16 pb-12 sm:pt-20 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[11px] font-medium tracking-wide uppercase">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="text-zinc-500 hover:text-zinc-300 transition-colors">Home</Link>
            </li>
            <li aria-hidden="true" className="text-zinc-700">/</li>
            <li aria-current="page" className="text-zinc-400">Categories</li>
          </ol>
        </nav>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in slide-in-from-bottom-4 duration-500">
          <div>
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs text-purple-400">
              Academic Library
            </span>
            <h1 id="categories-heading" className="mb-4 text-4xl sm:text-5xl font-extrabold tracking-tight leading-none text-zinc-50">
              Browse <span className="text-gradient">Subjects</span>
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-zinc-400">
              Explore {categoriesFromDb.length} core subject domains with over {totalNotes} notes published by verified contributors.
            </p>
          </div>

          {/* Statistics Summary */}
          <div className="flex shrink-0 gap-3">
            <div className="flex min-w-[90px] flex-col items-center rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 text-center backdrop-blur-md">
              <BookOpen className="mb-1 h-4 w-4 text-purple-400" aria-hidden="true" />
              <span className="text-xl font-extrabold text-zinc-50">{categoriesFromDb.length}</span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Domains</span>
            </div>
            <div className="flex min-w-[90px] flex-col items-center rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 text-center backdrop-blur-md">
              <FileText className="mb-1 h-4 w-4 text-purple-400" aria-hidden="true" />
              <span className="text-xl font-extrabold text-zinc-50">{totalNotes}</span>
              <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Total Notes</span>
            </div>
          </div>
        </header>
      </section>

      {/* Categories Grid */}
      <section aria-label="Available Categories" className="relative z-10 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoriesFromDb.map((cat) => {
            const subtitle = categorySubtitles[cat.slug] || "Study Material";
            const gradient = categoryGradients[cat.slug] || "from-purple-600 to-pink-600";
            const emoji = categoryEmojis[cat.slug] || "📚";

            return (
              <li key={cat.id}>
                <Link
                  href={`/search?q=&subject=${encodeURIComponent(cat.name)}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(168,85,247,0.15)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                  aria-label={`Browse ${cat.name} (${cat._count.notes} notes)`}
                >
                  {/* Decorative Gradient Header */}
                  <div className={`relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br ${gradient}`}>
                    <div aria-hidden="true" className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full border border-white/20" />
                    <div aria-hidden="true" className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full border border-white/20" />
                    <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                      <CategoryImage src={`/categories/${cat.slug}.png`} alt={`${cat.name} illustration`} fallbackEmoji={emoji} />
                    </div>
                  </div>

                  {/* Category Details */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-extrabold text-zinc-50 transition-colors group-hover:text-purple-400">
                          {cat.name}
                        </h2>
                        <span className="mt-0.5 block text-xs font-medium text-zinc-500">{subtitle}</span>
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/[0.02] transition-all group-hover:border-purple-500/20 group-hover:bg-purple-500/10">
                        <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-purple-400" aria-hidden="true" />
                      </div>
                    </div>
                    
                    <div className="mt-4 border-t border-white/5 pt-3">
                      <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-400">
                        {cat._count.notes} note{cat._count.notes !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Infinite Scrolling Banner */}
      <aside aria-label="Feature highlights" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-white/5 bg-black/40 py-4 backdrop-blur-md">
        <div className="flex animate-scroll-ticker gap-10 whitespace-nowrap text-zinc-50" aria-hidden="true">
          {Array(8).fill(null).map((_, i) => (
            <div key={i} className="flex items-center gap-10 text-[13px] font-semibold uppercase tracking-wider">
              <span className="text-zinc-300">Browse Notes</span> 
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              <span className="text-zinc-300">Upload Instantly</span> 
              <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
              <span className="text-zinc-300">Study Smarter</span> 
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
              <span className="text-zinc-300">100% Free Catalog</span>
              <span className="h-1.5 w-1.5 rounded-full bg-pink-500" />
            </div>
          ))}
        </div>
      </aside>

      {/* CTA Section */}
      <section aria-labelledby="cta-heading" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/60 to-pink-900/40 p-10 text-center text-zinc-50 backdrop-blur-md sm:p-16">
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/20 blur-[100px]" />

          <h2 id="cta-heading" className="mb-4 text-3xl sm:text-4xl font-extrabold">
            Share Your Academic Notes
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-zinc-300">
            Help the community by sharing your lecture notes, summaries, and revision guides. It takes less than a minute.
          </p>
          <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link 
              href="/upload" 
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Upload Notes
            </Link>
            <Link 
              href="/search" 
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              Search Catalog <ArrowRight className="h-4 w-4 text-purple-400" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
