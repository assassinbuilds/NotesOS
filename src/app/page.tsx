import Link from "next/link";
import Image from "next/image";
import { 
  Play, Mouse, ArrowRight, Check, Search, BookOpen, 
  Download, ArrowUpRight, GraduationCap, Clock, Award, ChevronDown 
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categoriesFromDb = await prisma.category.findMany({
    take: 3,
    orderBy: { notes: { _count: "desc" } },
  });

  return (
    <div className="w-full bg-[#f5f5f5] text-[#1a1a1a] font-sans selection:bg-zinc-200">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden border-b border-[#e5e5e5] pt-24 pb-20">
        
        {/* Background White Circle */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white shadow-[0_0_100px_rgba(0,0,0,0.02)] pointer-events-none" 
          aria-hidden="true" 
        />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
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
                  <Link 
                    href={`/search?subject=${encodeURIComponent(cat.name)}`}
                    key={cat.id} 
                    className="py-6 first:pt-0 last:pb-0 group cursor-pointer block"
                  >
                    <h3 className="text-[17px] font-semibold text-[#1a1a1a] flex items-center gap-1.5 transition-colors group-hover:text-zinc-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {cat.name} <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="mt-2 text-[12px] leading-[1.6] text-[#888888] max-w-[220px]">
                      We provide high-quality {cat.name.toLowerCase()} material. Explore our curated selection.
                    </p>
                  </Link>
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
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-10 flex items-center gap-3">
          <div className="flex h-10 w-6 items-center justify-center rounded-full border-2 border-zinc-300">
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-400 animate-bounce" />
          </div>
          <span className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">Scroll Down</span>
        </div>
      </section>

      {/* ===== SECTION 2: UNIVERSITY PARTNERS LOGO STRIP ===== */}
      <section className="py-12 bg-white border-b border-[#e5e5e5] overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#888888]">
            Trusted by students from top institutions
          </p>
          <div className="flex flex-wrap items-center gap-8 md:gap-16 grayscale opacity-40">
            {["MIT", "Stanford University", "Harvard University", "Oxford College", "Caltech"].map((uni) => (
              <span key={uni} className="text-sm font-extrabold tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {uni.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: FEATURE SHOWCASE (GRID BLOCK) ===== */}
      <section className="py-24 bg-[#f5f5f5] border-b border-[#e5e5e5]">
        <div className="mx-auto w-full max-w-[1400px] px-10">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Features</span>
            <h2 className="text-4xl font-semibold mt-3 text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Academic tools without distraction
            </h2>
          </div>

          {/* Large Dashboard Card */}
          <div className="w-full bg-white rounded-[32px] p-8 md:p-12 shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-[#e8e8e8] mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-bold text-zinc-600 uppercase tracking-wide">Interface Spotlight</span>
                <h3 className="text-3xl font-semibold mt-4 text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  A clean, unified document reader
                </h3>
                <p className="mt-4 text-[13px] leading-[1.8] text-[#666666] max-w-sm">
                  Say goodbye to standard browser PDF viewers. NotesOS provides side-by-side note stats, full-screen study modes, and zoom levels built directly into the UI.
                </p>
                <div className="mt-8 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-[12px] font-semibold text-zinc-700">Ad-free reading room</span>
                </div>
              </div>
              <div className="relative aspect-[4/3] w-full bg-[#fcfcfc] rounded-2xl border border-zinc-100 shadow-inner overflow-hidden flex items-center justify-center">
                {/* Visual mockup of layout */}
                <div className="w-[85%] h-[85%] bg-white rounded-xl border border-zinc-200/60 p-4 shadow-md flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                      <span className="h-2.5 w-2.5 rounded-full bg-zinc-200" />
                    </div>
                    <span className="text-[9px] font-bold text-zinc-400">PDF Reader</span>
                  </div>
                  <div className="space-y-2 py-4">
                    <div className="h-2 w-3/4 bg-zinc-100 rounded" />
                    <div className="h-2 w-1/2 bg-zinc-100 rounded" />
                    <div className="h-2 w-2/3 bg-zinc-100 rounded" />
                  </div>
                  <div className="h-8 bg-zinc-50 border border-zinc-100 rounded flex items-center justify-center text-[10px] font-semibold text-zinc-400">
                    Zoom: 100%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Three Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Search, 
                title: "Typo-Tolerant Search", 
                desc: "Find formulas and notes instantly, even with typos, across thousands of shared study guides." 
              },
              { 
                icon: BookOpen, 
                title: "Optimized Layouts", 
                desc: "Clean desktop and mobile reading rooms tailored to maximize visual focus during exams." 
              },
              { 
                icon: Download, 
                title: "Direct Downloads", 
                desc: "No waiting loops, ads, or premium subscriptions. Download standard PDFs with a single click." 
              }
            ].map((card, i) => (
              <div key={i} className="bg-white rounded-[28px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-[#e8e8e8] flex flex-col justify-between h-[260px]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100">
                  <card.icon className="h-5 w-5 text-[#1a1a1a]" />
                </div>
                <div>
                  <h4 className="text-[16px] font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {card.title}
                  </h4>
                  <p className="mt-2 text-[12px] leading-[1.6] text-[#666666]">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===== SECTION 4: SMART TRACKING FEATURE SHOWCASE ===== */}
      <section className="py-24 bg-white border-b border-[#e5e5e5]">
        <div className="mx-auto w-full max-w-[1400px] px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left text */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Library Control</span>
              <h2 className="text-4xl font-semibold mt-3 mb-6 text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Keep your revision organized
              </h2>
              <ul className="space-y-4">
                {[
                  "Save study notes to your personal dashboard directory",
                  "Monitor total downloads and views on your contributions",
                  "Categorize uploaded papers by semesters and subjects"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-800 mt-0.5">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-[13px] font-medium text-[#666666]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Floating UI mockup */}
            <div className="relative aspect-[4/3] w-full bg-[#f9f9f9] rounded-[32px] border border-zinc-100 shadow-inner overflow-hidden flex items-center justify-center p-8">
              <div className="w-full bg-white rounded-2xl border border-zinc-200/60 p-5 shadow-lg space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-800">Stats Tracker</span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-zinc-100 p-3 rounded-xl bg-zinc-50">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase">Total Views</span>
                    <p className="text-lg font-bold text-zinc-800 mt-1">4.2K</p>
                  </div>
                  <div className="border border-zinc-100 p-3 rounded-xl bg-zinc-50">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase">Downloads</span>
                    <p className="text-lg font-bold text-zinc-800 mt-1">1.8K</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== SECTION 5: TESTIMONIALS ===== */}
      <section className="py-24 bg-[#f5f5f5] border-b border-[#e5e5e5]">
        <div className="mx-auto w-full max-w-[1400px] px-10">
          
          <header className="mb-16">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Student Voices</span>
            <h2 className="text-3xl font-semibold mt-3 text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Incredibly effective at tracking notes
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                quote: "NotesOS has simplified studying. I can find relevant cs guides instantly without clicking through forums.",
                author: "Jordan Blake",
                role: "CS Student"
              },
              { 
                quote: "The PDF reader layout is clean. Best platform to quickly review lecture slides during finals week.",
                author: "Morgan Taylor",
                role: "Physics Major"
              },
              { 
                quote: "Direct downloads saved me hours of waiting. I just upload my revision docs and download others.",
                author: "Casey Ross",
                role: "Engineering Junior"
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white rounded-[24px] p-8 border border-zinc-200/50 shadow-sm flex flex-col justify-between">
                <p className="text-[13px] leading-[1.8] text-[#555555] italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-zinc-100">
                  <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-xs text-zinc-600">
                    {t.author[0]}
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-zinc-800">{t.author}</h4>
                    <span className="text-[10px] text-zinc-500">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===== SECTION 6: FAQ ACCORDION SECTION ===== */}
      <section className="py-24 bg-white border-b border-[#e5e5e5]">
        <div className="mx-auto w-full max-w-[1400px] px-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">FAQS</span>
              <h2 className="text-3xl font-semibold mt-3 text-[#1a1a1a]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Dedicated to help you learn
              </h2>
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              {[
                { q: "Is the platform completely free?", a: "Yes, NotesOS is built by students, for students. There are no fees, paywalls, or premium tiers." },
                { q: "How do I upload external file links?", a: "Simply switch the uploader mode to 'Link', paste your Google Drive URL, and customize your note details." },
                { q: "Can I manage or delete my uploaded documents?", a: "Yes, navigate to your Profile page by clicking your avatar. You can review all your publications there." }
              ].map((faq, i) => (
                <div key={i} className="border-b border-[#e5e5e5] pb-4">
                  <h3 className="text-[14px] font-bold text-[#1a1a1a] flex justify-between items-center cursor-pointer py-2">
                    {faq.q}
                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                  </h3>
                  <p className="mt-2 text-[12px] leading-[1.7] text-[#666666] max-w-xl">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ===== SECTION 7: SUCCESS STORY SPOTLIGHT ===== */}
      <section className="py-24 bg-[#f5f5f5] border-b border-[#e5e5e5]">
        <div className="mx-auto w-full max-w-[1400px] px-10 text-center">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">Contributor Spotlight</span>
          <p className="max-w-2xl mx-auto text-xl font-medium mt-6 text-[#1a1a1a] italic leading-[1.8]">
            &ldquo;Sharing my lecture summaries helped me study better, while helping over 500 classmates download revision notes during semesters.&rdquo;
          </p>
          <div className="mt-8 flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-zinc-300 flex items-center justify-center font-bold text-zinc-700 text-lg">
              A
            </div>
            <h3 className="text-[14px] font-bold mt-3 text-zinc-800">Alexis Reed</h3>
            <span className="text-[11px] text-zinc-500 font-semibold">Senior Contributor</span>
          </div>
        </div>
      </section>

      {/* ===== SECTION 8: BOTTOM CTA BANNER ===== */}
      <section className="py-24 bg-white border-b border-[#e5e5e5]">
        <div className="mx-auto w-full max-w-[1400px] px-10">
          <div className="w-full bg-[#1a1a1a] rounded-[40px] p-12 md:p-20 text-white relative overflow-hidden flex flex-col items-center text-center">
            
            {/* Background shape */}
            <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 max-w-md">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Get Started</span>
              <h2 className="text-3xl sm:text-4xl font-semibold mt-4 mb-6 leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Ready to contribute to the community?
              </h2>
              <p className="text-[13px] text-zinc-400 leading-[1.8] mb-8">
                Join thousands of students sharing guides. Upload and organize your study papers today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/upload" 
                  className="rounded-full bg-white px-8 py-3.5 text-[13px] font-semibold text-zinc-900 shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  Upload Notes
                </Link>
                <Link 
                  href="/search" 
                  className="rounded-full border border-white/20 bg-transparent px-8 py-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/5"
                >
                  Explore Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 9: GIANT TICKER BANNER ===== */}
      <aside aria-label="Feature ticker" className="overflow-hidden bg-white py-10 border-b border-[#e5e5e5]">
        <div className="flex gap-16 whitespace-nowrap select-none">
          <div className="flex animate-scroll-ticker gap-16 text-[4.5rem] font-bold text-zinc-100 uppercase tracking-tighter" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {Array(5).fill("NotesOS").map((txt, idx) => (
              <span key={idx} className="flex items-center gap-16">
                <span>{txt}</span>
                <span className="h-4 w-4 rounded-full bg-zinc-300" />
              </span>
            ))}
          </div>
        </div>
      </aside>

    </div>
  );
}
