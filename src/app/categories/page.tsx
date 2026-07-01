import Link from "next/link";
import { prisma } from "@/lib/prisma";
import * as Icons from "lucide-react";

export const dynamic = "force-dynamic";

// Maps seeded category slugs to standard descriptions
const descriptions: Record<string, string> = {
  "computer-science": "Data structures, algorithms, programming, databases, OS",
  "mathematics": "Calculus, algebra, statistics, discrete math",
  "physics": "Mechanics, thermodynamics, optics, quantum physics",
  "engineering": "Mechanical, civil, electrical engineering fundamentals",
  "chemistry": "Organic, inorganic, physical chemistry",
  "biology": "Cell biology, genetics, ecology, microbiology",
  "business": "Management, marketing, finance, accounting",
  "law": "Constitutional, criminal, civil, corporate law",
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 font-sans select-none">
      
      {/* Brutalist Header Block */}
      <div className="mb-10 p-6 border-2 border-black bg-[#e8e3d5] shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)] animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
          Browse Categories
        </h1>
        <p className="mt-1.5 text-xs font-semibold uppercase text-zinc-650">
          Explore notes organized by field of study
        </p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
        {categoriesFromDb.map((cat) => {
          const IconComp = (Icons as any)[cat.icon || ""] || Icons.BookOpen;
          const desc = descriptions[cat.slug] || `Lecture notes and study guides for ${cat.name}`;

          return (
            <Link
              key={cat.id}
              href={`/search?q=&subject=${encodeURIComponent(cat.name)}`}
              className="group flex items-start gap-4 p-5 border-2 border-black bg-[#f4f1ea] shadow-[3.5px_3.5px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              id={`category-${cat.slug}`}
            >
              {/* Brutalist Icon Box */}
              <div className="w-12 h-12 border-2 border-black bg-black text-[#f4f1ea] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
                <IconComp className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-tight text-black group-hover:text-[#d24b28] transition-colors">
                    {cat.name}
                  </h3>
                  <Icons.ArrowRight className="w-3.5 h-3.5 text-black transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-[10px] font-semibold text-zinc-650 mt-1 line-clamp-2 leading-relaxed">
                  {desc}
                </p>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#d24b28] mt-2">
                  {cat._count.notes.toLocaleString()} note{cat._count.notes !== 1 ? "s" : ""} shared
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
