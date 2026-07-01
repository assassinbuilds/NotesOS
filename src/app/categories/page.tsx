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
    <div className="site-container py-10 sm:py-16 font-sans select-none">
      
      {/* Modern Header Block */}
      <div className="mb-10 p-8 rounded-3xl bg-white border border-black/5 shadow-sm animate-fade-in relative overflow-hidden">
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
          const IconComp = (Icons as any)[cat.icon || ""] || Icons.BookOpen;
          const desc = descriptions[cat.slug] || `Lecture notes and study guides for ${cat.name}`;
          const colorClass = cat.color || "#4f46e5";

          return (
            <Link
              key={cat.id}
              href={`/search?q=&subject=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col justify-between p-6 rounded-2xl bg-white border border-black/5 shadow-sm hover:border-[#d24b28]/10 hover:shadow-md hover:scale-[1.01] transition-all duration-300"
              id={`category-${cat.slug}`}
            >
              <div>
                {/* Modern Icon Box */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform flex-shrink-0"
                  style={{ backgroundColor: `${colorClass}15`, color: colorClass }}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-black uppercase tracking-tight text-black group-hover:text-[#d24b28] transition-colors leading-tight">
                      {cat.name}
                    </h3>
                    <Icons.ArrowRight className="w-4 h-4 text-black group-hover:text-[#d24b28] transition-transform group-hover:translate-x-1 flex-shrink-0" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#d24b28] mt-0.5">
                    {cat._count.notes.toLocaleString()} note{cat._count.notes !== 1 ? "s" : ""} shared
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed font-semibold mt-2.5 line-clamp-2">
                    {desc}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
