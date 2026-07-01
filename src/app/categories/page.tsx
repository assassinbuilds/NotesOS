import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CategoryImage from "@/components/CategoryImage";

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
  "business": "from-amber-400 via-orange-500 to-red-550",
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

  return (
    <div className="site-container py-10 sm:py-16 font-sans select-none animate-fade-in">
      
      {/* Modern High-Impact Header Block */}
      <div className="mb-14 py-4 relative overflow-hidden flex flex-col items-start">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#ff5a36] bg-[#ff5a36]/10 px-3.5 py-1.5 rounded-full mb-5">
          Academic Directory
        </span>
        <h1 className="font-oswald font-black text-5xl sm:text-7xl tracking-tighter uppercase leading-[0.95] text-white">
          Browse Categories. <br />
          <span className="text-[#ff5a36] italic font-medium">Infinite knowledge.</span>
        </h1>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
        {categoriesFromDb.map((cat) => {
          const subtitle = categorySubtitles[cat.slug] || "Study guides";
          const gradient = categoryGradients[cat.slug] || "from-[#ff5a36] via-[#ff7c5d] to-[#ffb800]";
          const emoji = categoryEmojis[cat.slug] || "📚";

          return (
            <Link
              key={cat.id}
              href={`/search?q=&subject=${encodeURIComponent(cat.name)}`}
              className={`group relative flex flex-col justify-between p-6 rounded-[2.5rem] bg-gradient-to-br ${gradient} text-white shadow-md hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[#ff5a36]/5 hover:-translate-y-2 border border-white/10 hover:border-white/20 transition-all duration-300 h-[290px] overflow-hidden`}
              id={`category-${cat.slug}`}
            >
              {/* Concentric decorative background circles */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full border border-white/5 pointer-events-none" />
              <div className="absolute -bottom-28 -right-28 w-64 h-64 rounded-full border border-white/5 pointer-events-none" />

              {/* Top Text Area - ABOVE the image */}
              <div className="flex flex-col items-center text-center z-10 pt-1">
                <h3 className="font-oswald font-black text-xl sm:text-2xl uppercase tracking-tighter text-white leading-none">
                  {cat.name}
                </h3>
              </div>

              {/* Middle Area: Pop-out illustration */}
              <div className="my-auto py-2 z-10 flex justify-center items-center">
                <CategoryImage 
                  src={`/categories/${cat.slug}.png`} 
                  alt={cat.name} 
                  fallbackEmoji={emoji} 
                />
              </div>

              {/* Bottom Text Area - BELOW the image */}
              <div className="flex flex-col items-center text-center gap-1 z-10">
                <span className="font-oswald text-xs font-semibold text-white/80 mt-0.5 uppercase tracking-wider leading-none">
                  {subtitle}
                </span>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-white/15 text-[9px] font-bold uppercase tracking-wider text-white/95 backdrop-blur-sm mt-1.5">
                  {cat._count.notes.toLocaleString()} note{cat._count.notes !== 1 ? "s" : ""}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Repeating Banner Ticker at Bottom */}
      <div className="w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] overflow-hidden bg-[#151516] border-t border-b border-white/5 py-5 mt-20 select-none">
        <div className="animate-scroll-ticker flex gap-12 text-white">
          {Array(8).fill(null).map((_, i) => (
            <div key={i} className="ticker-item flex items-center gap-12 text-sm sm:text-base font-bold uppercase tracking-wider">
              <span>Create Notes</span> <span className="text-[#ff5a36]">🧡</span>
              <span>Grow Knowledge</span> <span className="text-[#ff5a36]">📈</span>
              <span>Earn Points</span> <span className="text-[#ff5a36]">🎯</span>
              <span>Study Smarter</span> <span className="text-[#ff5a36]">🧠</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}


