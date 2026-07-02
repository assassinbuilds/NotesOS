import Link from "next/link";
import Image from "next/image";
import { 
  Play, Mouse, ArrowRight, Check, Search, BookOpen, 
  Download, ArrowUpRight, GraduationCap, Clock, Award, ChevronDown,
  Sparkles, Shield, Zap, HelpCircle
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categoriesFromDb = await prisma.category.findMany({
    take: 3,
    orderBy: { notes: { _count: "desc" } },
  });

  return (
    <div className="w-full bg-[#f8f9fa] text-[#1a1a1a] font-sans selection:bg-purple-100 relative">
      
      {/* Subtle Dot Grid Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.4]" 
        style={{
          backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
        aria-hidden="true"
      />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden border-b border-zinc-200/80 pt-28 pb-20">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] bg-purple-200/30 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-pink-200/20 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

        {/* Center White Circle */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full bg-white shadow-[0_10px_60px_rgba(0,0,0,0.02)] border border-zinc-100 pointer-events-none flex items-center justify-center" 
          aria-hidden="true" 
        />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          
          {/* Left Column: Typography & CTA */}
          <div className="flex flex-col justify-center pr-4">
            <div className="inline-flex items-center gap-2 bg-white/80 border border-zinc-200/60 px-3.5 py-1.5 rounded-full w-fit mb-6 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-600">The Student Network</span>
            </div>
            <h1 
              className="text-[4.5rem] sm:text-[5.2rem] font-black leading-[1.02] tracking-tighter text-[#111111]" 
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Academic<br />
              Notes<br />
              Directory
            </h1>
            <p className="mt-8 max-w-[300px] text-[13px] leading-[1.8] text-[#555555] font-medium">
              The platform is simple without excess details and you can find notes pleasantly,
              like reading out of a clean physical notebook.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <Link 
                href="/search" 
                className="inline-flex items-center justify-center rounded-full bg-[#111111] px-9 py-4 text-[13px] font-bold uppercase tracking-wider text-white transition-all hover:bg-zinc-800 hover:-translate-y-0.5 shadow-lg shadow-black/10"
              >
                Start Now
              </Link>
              <button 
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-zinc-200/60 shadow-sm transition-all hover:scale-105 hover:shadow-md"
                aria-label="Watch video"
              >
                <Play className="h-4 w-4 fill-current text-zinc-900 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Center Column: Product Image */}
          <div className="flex justify-center relative items-center min-h-[550px]">
            <div className="relative w-full max-w-[340px] aspect-[1/2] transition-transform duration-700 hover:scale-[1.02]">
              <Image
                src="/hero-product.png"
                alt="Minimalist Black Notebook"
                fill
                sizes="(max-width: 768px) 100vw, 340px"
                className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.12)] mix-blend-multiply"
                priority
              />
            </div>
          </div>

          {/* Right Column: Features / Categories List */}
          <div className="flex flex-col justify-center lg:pl-10">
            <div className="flex flex-col divide-y divide-zinc-200/80">
              {categoriesFromDb.length > 0 ? (
                categoriesFromDb.map((cat, i) => (
                  <Link 
                    href={`/search?subject=${encodeURIComponent(cat.name)}`}
                    key={cat.id} 
                    className="py-6 first:pt-0 last:pb-0 group cursor-pointer block"
                  >
                    <h3 className="text-[17px] font-bold text-[#111111] flex items-center gap-2 transition-colors group-hover:text-purple-600" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      <span className="text-[12px] text-zinc-400 font-mono">0{i+1}.</span>
                      {cat.name} 
                      <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-purple-600" />
                    </h3>
                    <p className="mt-2 text-[12px] leading-[1.6] text-[#777777] max-w-[240px] font-medium">
                      We provide high-quality {cat.name.toLowerCase()} material. Explore our curated selection.
                    </p>
                  </Link>
                ))
              ) : (
                <>
                  <div className="py-6 first:pt-0 last:pb-0">
                    <h3 className="text-[17px] font-semibold text-[#111111]" style={{ fontFamily: "'Outfit', sans-serif" }}>Computer Science</h3>
                    <p className="mt-2 text-[12px] leading-[1.6] text-[#777777] max-w-[240px]">
                      We provide high-quality computer science material. Explore our curated selection.
                    </p>
                  </div>
                  <div className="py-6 first:pt-0 last:pb-0">
                    <h3 className="text-[17px] font-semibold text-[#111111]" style={{ fontFamily: "'Outfit', sans-serif" }}>Mathematics</h3>
                    <p className="mt-2 text-[12px] leading-[1.6] text-[#777777] max-w-[240px]">
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
          <div className="flex h-10 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-600 animate-bounce" />
          </div>
          <span className="text-[11px] font-bold text-[#888888] uppercase tracking-widest">Scroll Down</span>
        </div>
      </section>

      {/* ===== SECTION 2: UNIVERSITY PARTNERS LOGO STRIP ===== */}
      <section className="py-14 bg-white border-b border-zinc-200/80 overflow-hidden relative">
        <div className="mx-auto w-full max-w-[1400px] px-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#888888]">
            Trusted by students from top institutions
          </p>
          <div className="flex flex-wrap items-center gap-8 md:gap-16 grayscale opacity-60">
            {["MIT", "Stanford University", "Harvard University", "Oxford College", "Caltech"].map((uni) => (
              <span key={uni} className="text-sm font-black tracking-widest text-zinc-800" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {uni.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: FEATURE SHOWCASE (GRID BLOCK) ===== */}
      <section className="py-28 bg-[#f8f9fa] border-b border-zinc-200/80 relative">
        <div className="mx-auto w-full max-w-[1400px] px-10 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-20">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-600 bg-purple-50 px-3.5 py-1.5 rounded-full">Core Value</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold mt-6 text-[#111111] tracking-tight leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Academic tools without distraction
            </h2>
          </div>

          {/* Large Dashboard Card with beautiful gradient mockups */}
          <div className="w-full bg-white rounded-[36px] p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-zinc-200/60 mb-8 overflow-hidden relative group">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="rounded-full bg-purple-50 border border-purple-100 px-3.5 py-1 text-[10px] font-bold text-purple-600 uppercase tracking-wide">Interface Spotlight</span>
                <h3 className="text-3xl sm:text-4xl font-extrabold mt-5 text-[#111111] tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  A clean, unified document reader
                </h3>
                <p className="mt-5 text-[13px] leading-[1.8] text-[#555555] max-w-md font-medium">
                  Say goodbye to standard browser PDF viewers. NotesOS provides side-by-side note stats, full-screen study modes, and zoom levels built directly into the UI.
                </p>
                <div className="mt-8 flex items-center gap-2.5">
                  <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                  <span className="text-[12px] font-bold text-zinc-700">100% Ad-free reading environment</span>
                </div>
              </div>

              {/* Dynamic Gradient Mockup Container */}
              <div className="relative aspect-[4/3] w-full bg-gradient-to-tr from-purple-500/10 via-pink-500/5 to-orange-500/10 rounded-2xl border border-zinc-100 shadow-inner overflow-hidden flex items-center justify-center p-6">
                <div className="w-full h-full bg-white rounded-xl border border-zinc-200/60 p-4 shadow-xl flex flex-col justify-between transition-transform duration-500 group-hover:scale-[1.02]">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">PDF Reader</span>
                  </div>
                  <div className="space-y-3 py-6">
                    <div className="h-2.5 w-3/4 bg-zinc-100 rounded-full" />
                    <div className="h-2.5 w-1/2 bg-zinc-100 rounded-full" />
                    <div className="h-2.5 w-2/3 bg-zinc-100 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between bg-zinc-50 border border-zinc-150 p-2.5 rounded-lg text-[10px] font-bold text-zinc-500">
                    <span>Page 1 of 12</span>
                    <span>Zoom: 100%</span>
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
              <div key={i} className="bg-white rounded-[32px] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.02)] border border-zinc-200/60 flex flex-col justify-between h-[280px] hover:border-purple-200 transition-all hover:shadow-[0_20px_40px_rgba(168,85,247,0.03)] group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 border border-zinc-100 group-hover:bg-purple-50 group-hover:border-purple-100 transition-colors">
                  <card.icon className="h-5 w-5 text-[#111111] group-hover:text-purple-600 transition-colors" />
                </div>
                <div>
                  <h4 className="text-[17px] font-bold text-[#111111] tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {card.title}
                  </h4>
                  <p className="mt-2.5 text-[12.5px] leading-[1.7] text-[#666666] font-medium">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===== SECTION 4: SMART TRACKING FEATURE SHOWCASE ===== */}
      <section className="py-28 bg-white border-b border-zinc-200/80">
        <div className="mx-auto w-full max-w-[1400px] px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left text */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-pink-600 bg-pink-50 px-3.5 py-1.5 rounded-full">Library Control</span>
              <h2 className="text-4xl sm:text-5xl font-extrabold mt-6 mb-8 text-[#111111] tracking-tight leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Keep your revision organized
              </h2>
              <ul className="space-y-5">
                {[
                  "Save study notes to your personal dashboard directory",
                  "Monitor total downloads and views on your contributions",
                  "Categorize uploaded papers by semesters and subjects"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-zinc-100 border border-zinc-200/60 text-zinc-800 mt-0.5">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </span>
                    <span className="text-[13px] font-semibold text-[#555555]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Floating UI mockup with premium gradient backgrounds */}
            <div className="relative aspect-[4/3] w-full bg-gradient-to-tr from-pink-500/10 via-purple-500/5 to-cyan-500/10 rounded-[36px] border border-zinc-100 shadow-inner overflow-hidden flex items-center justify-center p-8 group">
              <div className="w-full bg-white rounded-2xl border border-zinc-200/60 p-6 shadow-2xl space-y-5 transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Stats Tracker</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">Live Synced</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-zinc-250/60 p-4 rounded-xl bg-zinc-50 shadow-inner">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Views</span>
                    <p className="text-2xl font-black text-zinc-800 mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>4,219</p>
                  </div>
                  <div className="border border-zinc-250/60 p-4 rounded-xl bg-zinc-50 shadow-inner">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Downloads</span>
                    <p className="text-2xl font-black text-zinc-800 mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>1,840</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== SECTION 5: TESTIMONIALS ===== */}
      <section className="py-28 bg-[#f8f9fa] border-b border-zinc-200/80">
        <div className="mx-auto w-full max-w-[1400px] px-10">
          
          <header className="mb-20 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-600 bg-purple-50 px-3.5 py-1.5 rounded-full">Student Voices</span>
            <h2 className="text-4xl font-extrabold mt-6 text-[#111111]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Incredibly effective at tracking notes
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                quote: "NotesOS has simplified studying. I can find relevant cs guides instantly without clicking through forums.",
                author: "Jordan Blake",
                role: "CS Student",
                gradient: "from-purple-500 to-pink-500"
              },
              { 
                quote: "The PDF reader layout is clean. Best platform to quickly review lecture slides during finals week.",
                author: "Morgan Taylor",
                role: "Physics Major",
                gradient: "from-pink-500 to-orange-500"
              },
              { 
                quote: "Direct downloads saved me hours of waiting. I just upload my revision docs and download others.",
                author: "Casey Ross",
                role: "Engineering Junior",
                gradient: "from-blue-500 to-teal-500"
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white rounded-[32px] p-8 border border-zinc-200/60 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-all">
                <p className="text-[13.5px] leading-[1.8] text-[#555555] font-medium italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-3.5 pt-5 border-t border-zinc-100">
                  <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center font-black text-[13px] text-white shadow-sm`}>
                    {t.author[0]}
                  </div>
                  <div>
                    <h4 className="text-[12.5px] font-bold text-zinc-800">{t.author}</h4>
                    <span className="text-[10px] text-zinc-500 font-semibold">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ===== SECTION 6: FAQ ACCORDION SECTION ===== */}
      <section className="py-28 bg-white border-b border-zinc-200/80">
        <div className="mx-auto w-full max-w-[1400px] px-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">FAQS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-5 text-[#111111] leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Dedicated to help you learn
              </h2>
            </div>
            
            <div className="lg:col-span-2 space-y-4">
              {[
                { q: "Is the platform completely free?", a: "Yes, NotesOS is built by students, for students. There are no fees, paywalls, or premium tiers." },
                { q: "How do I upload external file links?", a: "Simply switch the uploader mode to 'Link', paste your Google Drive URL, and customize your note details." },
                { q: "Can I manage or delete my uploaded documents?", a: "Yes, navigate to your Profile page by clicking your avatar. You can review all your publications there." }
              ].map((faq, i) => (
                <div key={i} className="border-b border-zinc-200/80 pb-5">
                  <h3 className="text-[14px] font-bold text-[#111111] flex justify-between items-center cursor-pointer py-2 hover:text-purple-600 transition-colors">
                    {faq.q}
                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-[1.8] text-[#666666] font-medium max-w-2xl">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ===== SECTION 7: SUCCESS STORY SPOTLIGHT ===== */}
      <section className="py-28 bg-[#f8f9fa] border-b border-zinc-200/80">
        <div className="mx-auto w-full max-w-[1400px] px-10 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-600 bg-purple-50 px-3.5 py-1.5 rounded-full">Contributor Spotlight</span>
          <p className="max-w-3xl mx-auto text-2xl font-bold mt-8 text-[#111111] italic leading-[1.7]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            &ldquo;Sharing my lecture summaries helped me study better, while helping over 500 classmates download revision notes during semesters.&rdquo;
          </p>
          <div className="mt-10 flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-purple-500/10">
              A
            </div>
            <h3 className="text-[14.5px] font-bold mt-4 text-zinc-800">Alexis Reed</h3>
            <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Senior Contributor</span>
          </div>
        </div>
      </section>

      {/* ===== SECTION 8: BOTTOM CTA BANNER ===== */}
      <section className="py-28 bg-white border-b border-zinc-200/80">
        <div className="mx-auto w-full max-w-[1400px] px-10">
          <div className="w-full bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#222222] rounded-[48px] p-12 md:p-24 text-white relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
            
            {/* Background glowing shape */}
            <div className="absolute right-[-10%] bottom-[-10%] w-[450px] h-[450px] bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute left-[-10%] top-[-10%] w-[450px] h-[450px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-400 bg-purple-500/10 px-3.5 py-1.5 rounded-full border border-purple-500/20">Get Started</span>
              <h2 className="text-4xl sm:text-5xl font-black mt-6 mb-6 leading-tight tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Ready to contribute to the community?
              </h2>
              <p className="text-[13.5px] text-zinc-400 leading-[1.8] mb-10 max-w-md mx-auto">
                Join thousands of students sharing guides. Upload and organize your study papers today.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/upload" 
                  className="rounded-full bg-white px-9 py-4 text-[13px] font-bold uppercase tracking-wider text-zinc-900 shadow-xl transition-all hover:bg-zinc-150 hover:-translate-y-0.5"
                >
                  Upload Notes
                </Link>
                <Link 
                  href="/search" 
                  className="rounded-full border border-white/20 bg-white/5 backdrop-blur-md px-9 py-4 text-[13px] font-bold uppercase tracking-wider text-white transition-all hover:bg-white/10 hover:-translate-y-0.5"
                >
                  Explore Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 9: GIANT TICKER BANNER ===== */}
      <aside aria-label="Feature ticker" className="overflow-hidden bg-white py-12 border-b border-zinc-200/80">
        <div className="flex gap-16 whitespace-nowrap select-none">
          <div className="flex animate-scroll-ticker gap-16 text-[4.5rem] font-black text-zinc-100 uppercase tracking-tighter" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {Array(5).fill("NotesOS").map((txt, idx) => (
              <span key={idx} className="flex items-center gap-16">
                <span>{txt}</span>
                <span className="h-5 w-5 rounded-full bg-zinc-200" />
              </span>
            ))}
          </div>
        </div>
      </aside>

    </div>
  );
}
