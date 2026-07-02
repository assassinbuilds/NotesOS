import Link from "next/link";
import Image from "next/image";
import { Play, Mouse, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categoriesFromDb = await prisma.category.findMany({
    take: 3,
    orderBy: { notes: { _count: "desc" } },
  });

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f5f5f5] flex flex-col justify-center font-sans">
      
      {/* Background White Circle */}
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white shadow-[0_0_100px_rgba(0,0,0,0.02)]" 
        aria-hidden="true" 
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center mt-12">
        
        {/* Left Column: Typography & CTA */}
        <div className="flex flex-col justify-center pr-10">
          <h1 
            className="text-[5.5rem] font-medium leading-[1.05] tracking-tight text-[#1a1a1a]" 
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Academic<br />
            Notes<br />
            Directory
          </h1>
          <p className="mt-8 max-w-[280px] text-[13px] leading-[1.8] text-[#666666] font-medium">
            The platform is simple without excess details and you can find notes pleasantly,
            like reading out of a clean physical notebook.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link 
              href="/search" 
              className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-8 py-3.5 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5 shadow-lg shadow-black/10"
            >
              Start Now
            </Link>
            <button 
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform hover:scale-105"
              aria-label="Watch video"
            >
              <Play className="h-4 w-4 fill-current text-zinc-900 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Center Column: Product Image */}
        <div className="flex justify-center relative items-center min-h-[600px]">
          <div className="relative w-full max-w-[320px] aspect-[1/2]">
            <Image
              src="/hero-product.png"
              alt="Minimalist Black Notebook"
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-contain drop-shadow-2xl mix-blend-multiply"
              priority
            />
          </div>
        </div>

        {/* Right Column: Features / Categories List */}
        <div className="flex flex-col justify-center pl-10">
          <div className="flex flex-col divide-y divide-[#e5e5e5]">
            {categoriesFromDb.length > 0 ? (
              categoriesFromDb.map((cat) => (
                <div key={cat.id} className="py-6 first:pt-0 last:pb-0 group cursor-pointer">
                  <h3 className="text-[17px] font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-[12px] leading-[1.6] text-[#888888] max-w-[220px]">
                    We provide high-quality {cat.name.toLowerCase()} material. Explore our curated selection.
                  </p>
                </div>
              ))
            ) : (
              <>
                <div className="py-6 first:pt-0 last:pb-0">
                  <h3 className="text-[17px] font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>Computer Science</h3>
                  <p className="mt-2 text-[12px] leading-[1.6] text-[#888888] max-w-[220px]">
                    We provide high-quality computer science material. Explore our curated selection.
                  </p>
                </div>
                <div className="py-6 first:pt-0 last:pb-0">
                  <h3 className="text-[17px] font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>Mathematics</h3>
                  <p className="mt-2 text-[12px] leading-[1.6] text-[#888888] max-w-[220px]">
                    We provide high-quality mathematics material. Explore our curated selection.
                  </p>
                </div>
                <div className="py-6 first:pt-0 last:pb-0">
                  <h3 className="text-[17px] font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>Physics</h3>
                  <p className="mt-2 text-[12px] leading-[1.6] text-[#888888] max-w-[220px]">
                    We provide high-quality physics material. Explore our curated selection.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Footer Area */}
      <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-6 items-center justify-center rounded-full border-2 border-zinc-300">
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" />
          </div>
          <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">Scroll Down</span>
        </div>
        
        <p className="text-[12px] font-medium text-[#666666] text-center max-w-[400px]">
          Lightweight and compact NOTES DIRECTORY lets you study effortlessly. 
          Made of high quality verified student contributions.
        </p>

        <Link href="/categories" className="flex items-center gap-3 group">
          <div className="flex flex-col text-right">
            <span className="text-[12px] font-semibold text-[#1a1a1a]">Discover</span>
            <span className="text-[12px] font-semibold text-[#1a1a1a]">More</span>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-900 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

    </div>
  );
}
