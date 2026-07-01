import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
      
      {/* Modern Header Block */}
      <div className="mb-10 p-8 rounded-3xl bg-white border border-black/5 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#d24b28]/5 -mr-5 -mt-5" />
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
          Browse Categories
        </h1>
        <p className="mt-1.5 text-xs font-semibold uppercase text-[#d24b28] tracking-wider">
          Explore notes organized by field of study
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
        {categoriesFromDb.map((cat) => {
          const subtitle = categorySubtitles[cat.slug] || "Study guides";
          const gradient = categoryGradients[cat.slug] || "from-[#d24b28] via-[#e25c28] to-[#ffaa00]";
          const emoji = categoryEmojis[cat.slug] || "📚";

          return (
            <Link
              key={cat.id}
              href={`/search?q=&subject=${encodeURIComponent(cat.name)}`}
              className={`group relative flex flex-col justify-between p-7 rounded-[2rem] bg-gradient-to-br ${gradient} text-white shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden h-[180px]`}
              id={`category-${cat.slug}`}
            >
              {/* Concentric decorative background circles radiating from bottom right */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border border-white/10 pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full border border-white/10 pointer-events-none" />
              <div className="absolute -bottom-28 -right-28 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
              <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />

              {/* Top Text Area */}
              <div className="flex flex-col z-10">
                <h3 className="font-extrabold text-xl sm:text-2xl tracking-tight text-white leading-tight">
                  {cat.name}
                </h3>
                <span className="text-xs font-semibold text-white/80 mt-1 uppercase tracking-wider">
                  {subtitle}
                </span>
              </div>

              {/* Bottom Area: Notes Count Pill */}
              <div className="z-10 mt-auto">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 text-[10px] font-bold uppercase tracking-wider text-white/95 backdrop-blur-sm">
                  {cat._count.notes.toLocaleString()} note{cat._count.notes !== 1 ? "s" : ""}
                </span>
              </div>

              {/* 3D Emoji Sticker */}
              <div className="absolute -bottom-2 -right-2 text-6xl filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.3)] select-none transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:-translate-y-1 group-hover:-translate-x-1">
                {emoji}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

