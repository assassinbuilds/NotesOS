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

  // Fetch real-time statistics from DB
  const totalNotes = await prisma.note.count({
    where: { status: "PUBLISHED" }
  });
  const totalUsers = await prisma.user.count();
  
  const aggregations = await prisma.note.aggregate({
    _sum: {
      views: true,
      downloads: true,
    }
  });
  
  const totalViews = aggregations._sum.views || 0;
  const totalDownloads = aggregations._sum.downloads || 0;

  // Formatting helper for real-time stats
  const formatStatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M+";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k+";
    }
    return num.toString();
  };

  return (
    <div className="w-full bg-[#e6ebf0] text-[#1a1a1a] font-sans selection:bg-blue-100 pb-20">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full min-h-screen md:h-screen flex flex-col justify-between mt-0 mb-0 bg-gradient-to-b from-[#4fa5e8] via-[#78bdf4] to-[#e6ebf0] text-white shadow-2xl shadow-blue-900/5 overflow-visible">
        
        {/* Subtle white grid overlay inside hero */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay" 
          style={{
            backgroundImage: "radial-gradient(white 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
          aria-hidden="true"
        />


        {/* Header Row Container */}
        <div className="w-full max-w-[1300px] mx-auto px-6 pt-8 pb-4 relative z-20">
          <div className="flex items-center justify-between w-full px-4">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/25 border border-white/35 backdrop-blur-md">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-[17px] font-black tracking-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                NotesOS
              </span>
            </Link>

            {/* Navigation Items */}
            <nav className="hidden md:flex items-center gap-8 bg-white/15 border border-white/25 backdrop-blur-md px-6 py-2 rounded-full shadow-sm">
              <Link href="/" className="text-[12.5px] font-bold text-white transition-colors hover:text-white/80">
                Home
              </Link>
              <Link href="/categories" className="text-[12.5px] font-bold text-white/85 transition-colors hover:text-white">
                Subjects
              </Link>
              <Link href="/search" className="text-[12.5px] font-bold text-white/85 transition-colors hover:text-white">
                Explore
              </Link>
              <Link href="/upload" className="text-[12.5px] font-bold text-white/85 transition-colors hover:text-white">
                Upload
              </Link>
            </nav>

            {/* Right CTA */}
            <div>
              <Link 
                href="/login" 
                className="flex items-center justify-center rounded-full bg-white px-6 py-2 text-[11px] font-black uppercase tracking-wider text-[#4fa5e8] transition-all hover:bg-white/95 active:scale-95 shadow-sm"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Main Hero Content - Centers content vertically and horizontally */}
        <div className="flex-1 flex flex-col justify-center items-center max-w-4xl w-full mx-auto px-6 pt-6 pb-0 relative z-10 text-center">
          
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/90 bg-white/15 border border-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full mb-6">
            Now Online
          </span>

          <h1 
            className="text-[3.6rem] sm:text-[4.8rem] lg:text-[5.4rem] font-black leading-[1.05] tracking-tighter text-white" 
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Academic Notes<br />Directory
          </h1>

          <p className="mt-6 max-w-xl text-[14px] sm:text-[15px] leading-[1.7] text-white/90 font-medium">
            The platform is simple without excess details. Find notes pleasantly, like reading out of a clean physical notebook.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-lg mt-9">
            <form action="/search" method="GET" className="relative flex items-center p-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-lg shadow-lg shadow-black/5 hover:border-white/30 transition-all">
              <Search className="absolute left-5 h-4.5 w-4.5 text-white/70" />
              <input 
                type="text" 
                name="q"
                placeholder="Search subjects, notes, formulas..." 
                className="w-full bg-transparent pl-12 pr-32 py-3.5 text-[13px] font-semibold text-white placeholder-white/60 focus:outline-none"
              />
              <button 
                type="submit"
                className="absolute right-1.5 rounded-full bg-white px-6 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-[#4fa5e8] transition-all hover:bg-white/95 active:scale-95 shadow-md shadow-black/5"
              >
                Search
              </button>
            </form>
          </div>

          {/* Centered Notebook Mockup - In relative layout flow to guarantee exact 60px gap from search bar */}
          <div className="relative w-full max-w-[240px] h-[200px] overflow-hidden mt-[60px] z-10 flex justify-center items-start">
            <div className="relative w-full h-[240px] transition-transform duration-700 hover:scale-[1.02]">
              <Image
                src="/hero-product.png"
                alt="Minimalist Black Notebook"
                fill
                sizes="240px"
                className="object-contain object-top mix-blend-multiply"
                priority
              />
            </div>
          </div>

          {/* Bottom Single Glassmorphic Stats Pill - Overlaps the bottom of the notebook by mt-[-100px] and transitions into the next section with translate-y-1/2 */}
          <div className="w-[92%] max-w-4xl bg-white/95 border border-white/60 backdrop-blur-md rounded-[32px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.06)] mt-[-100px] relative z-20 translate-y-1/2">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y-0">
              {[
                { number: formatStatNumber(totalNotes), label: "NOTES SHARED" },
                { number: formatStatNumber(totalUsers), label: "STUDENTS ACTIVE" },
                { number: formatStatNumber(totalDownloads), label: "TOTAL DOWNLOADS" },
                { number: formatStatNumber(totalViews), label: "TOTAL VIEWS" }
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className={`text-center py-4 md:py-6 px-4 flex flex-col justify-center items-center
                    ${i === 0 ? "border-r border-b border-zinc-200/50" : ""}
                    ${i === 1 ? "border-b md:border-b-0 md:border-r border-zinc-200/50" : ""}
                    ${i === 2 ? "border-r border-zinc-200/50" : ""}
                  `}
                >
                  <div className="text-3xl font-black text-zinc-900 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {stat.number}
                  </div>
                  <div className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest mt-1.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: UNIVERSITY PARTNERS LOGO STRIP ===== */}
      <section className="pt-36 pb-8 max-w-[1300px] mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#888888]">
            Trusted by students from top institutions
          </p>
          <div className="flex flex-wrap items-center gap-8 md:gap-16 grayscale opacity-60">
            {["MIT", "Stanford University", "Harvard University", "Oxford College", "Caltech"].map((uni) => (
              <span key={uni} className="text-sm font-black tracking-widest text-[#4fa5e8]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                {uni.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: FEATURE SHOWCASE (GRID BLOCK WITH NEARO CARDS) ===== */}
      <section className="mx-auto max-w-[1300px] px-6 py-12">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#4fa5e8] bg-blue-50 px-3.5 py-1.5 rounded-full">Core Value</span>
          <h2 className="text-5xl sm:text-6xl font-black mt-6 text-[#111111] tracking-tight leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Academic tools without distraction
          </h2>
        </div>

        {/* Large Dashboard Card with beautiful gradient mockups */}
        <div className="w-full bg-white border border-zinc-200/25 rounded-[36px] p-8 md:p-14 shadow-lg shadow-blue-900/5 mb-8 overflow-hidden relative group">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="rounded-full bg-[#f4f7fa] px-3.5 py-1 text-[10px] font-bold text-[#4fa5e8] uppercase tracking-wide">Interface Spotlight</span>
              <h3 className="text-4xl sm:text-5xl font-black mt-5 text-[#111111] tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                A clean, unified document reader
              </h3>
              <p className="mt-5 text-[15px] leading-[1.8] text-zinc-800 font-medium">
                Say goodbye to standard browser PDF viewers. NotesOS provides side-by-side note stats, full-screen study modes, and zoom levels built directly into the UI.
              </p>
              <div className="mt-8 flex items-center gap-2.5">
                <span className="flex h-5.5 w-5.5 items-center justify-center rounded-full bg-[#f4f7fa] text-[#4fa5e8]">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
                <span className="text-[14px] font-bold text-zinc-900">100% Ad-free reading environment</span>
              </div>
            </div>

            {/* Dynamic Gradient Mockup Container */}
            <div className="relative aspect-[4/3] w-full bg-gradient-to-tr from-[#4fa5e8]/20 via-[#70b7f0]/10 to-[#99c8f2]/20 rounded-2xl shadow-inner overflow-hidden flex items-center justify-center p-6">
              <div className="w-full h-full bg-white rounded-xl p-4 shadow-xl flex flex-col justify-between transition-transform duration-500 group-hover:scale-[1.02]">
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

        {/* Three Cards Row (Nearo Style) */}
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
            <div key={i} className="bg-white border border-zinc-200/25 rounded-[32px] p-8 flex flex-col justify-between h-[300px] transition-all hover:shadow-xl group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4f7fa] group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                <card.icon className="h-5 w-5 text-[#111111] group-hover:text-[#4fa5e8] transition-colors" />
              </div>
              <div>
                <h4 className="text-[20px] font-black text-[#111111] tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {card.title}
                </h4>
                <p className="mt-2.5 text-[14px] leading-[1.7] text-[#555555] font-semibold">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* ===== SECTION 4: SMART TRACKING FEATURE SHOWCASE ===== */}
      <section className="mx-auto max-w-[1300px] px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left text */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#4fa5e8] bg-blue-50 px-3.5 py-1.5 rounded-full">Library Control</span>
            <h2 className="text-5xl sm:text-6xl font-black mt-6 mb-8 text-[#111111] tracking-tight leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Keep your revision organized
            </h2>
            <ul className="space-y-5">
              {[
                "Save study notes to your personal dashboard directory",
                "Monitor total downloads and views on your contributions",
                "Categorize uploaded papers by semesters and subjects"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3.5">
                  <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-white text-zinc-900 mt-0.5 font-bold">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                  <span className="text-[15px] font-bold text-zinc-800">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Floating UI mockup with premium gradient backgrounds */}
          <div className="relative aspect-[4/3] w-full bg-gradient-to-tr from-[#4fa5e8]/10 via-[#70b7f0]/5 to-[#99c8f2]/10 rounded-[36px] shadow-inner overflow-hidden flex items-center justify-center p-8 group">
            <div className="w-full bg-white border border-zinc-200/25 rounded-2xl p-6 shadow-2xl space-y-5 transition-transform duration-500 group-hover:scale-[1.02]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Stats Tracker</span>
                <span className="text-[10px] font-bold text-[#4fa5e8] bg-[#f4f7fa] px-2.5 py-0.5 rounded-full">Live Synced</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f4f7fa] shadow-inner">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Views</span>
                  <p className="text-3xl font-black text-zinc-950 mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>4,219</p>
                </div>
                <div className="p-4 rounded-xl bg-[#f4f7fa] shadow-inner">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Downloads</span>
                  <p className="text-3xl font-black text-zinc-950 mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>1,840</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ===== SECTION 5: TESTIMONIALS ===== */}
      <section className="mx-auto max-w-[1300px] px-6 py-12">
        
        <header className="mb-20 text-center md:text-left">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#4fa5e8] bg-blue-50 px-3.5 py-1.5 rounded-full">Student Voices</span>
          <h2 className="text-5xl sm:text-6xl font-black mt-6 text-[#111111]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Incredibly effective at tracking notes
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              quote: "NotesOS has simplified studying. I can find relevant cs guides instantly without clicking through forums.",
              author: "Jordan Blake",
              role: "CS Student",
              gradient: "from-[#4fa5e8] to-[#99c8f2]"
            },
            { 
              quote: "The PDF reader layout is clean. Best platform to quickly review lecture slides during finals week.",
              author: "Morgan Taylor",
              role: "Physics Major",
              gradient: "from-[#3b82f6] to-[#70b7f0]"
            },
            { 
              quote: "Direct downloads saved me hours of waiting. I just upload my revision docs and download others.",
              author: "Casey Ross",
              role: "Engineering Junior",
              gradient: "from-[#4fa5e8] to-[#70b7f0]"
            }
          ].map((t, idx) => (
            <div key={idx} className="bg-white border border-zinc-200/25 rounded-[32px] p-8 shadow-sm flex flex-col justify-between h-[300px] hover:shadow-xl transition-all">
              <p className="text-[15px] leading-[1.8] text-zinc-800 font-bold italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-3.5 pt-5 border-t border-zinc-200">
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

      </section>

      {/* ===== SECTION 6: FAQ ACCORDION SECTION ===== */}
      <section className="mx-auto max-w-[1300px] px-6 py-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">FAQS</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-5 text-[#111111] leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Dedicated to help you learn
            </h2>
          </div>
          
          <div className="lg:col-span-2 bg-white rounded-[36px] p-8 md:p-12 border border-zinc-200/25 shadow-sm space-y-4">
            {[
              { q: "Is the platform completely free?", a: "Yes, NotesOS is built by students, for students. There are no fees, paywalls, or premium tiers." },
              { q: "How do I upload external file links?", a: "Simply switch the uploader mode to 'Link', paste your Google Drive URL, and customize your note details." },
              { q: "Can I manage or delete my uploaded documents?", a: "Yes, navigate to your Profile page by clicking your avatar. You can review all your publications there." }
            ].map((faq, i) => (
              <div key={i} className="border-b border-zinc-200/80 pb-5 last:border-b-0 last:pb-0">
                <h3 className="text-[16px] font-black text-[#111111] flex justify-between items-center cursor-pointer py-2 hover:text-[#4fa5e8] transition-colors">
                  {faq.q}
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </h3>
                <p className="mt-2 text-[14px] leading-[1.8] text-zinc-800 font-medium max-w-2xl">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ===== SECTION 7: SUCCESS STORY SPOTLIGHT ===== */}
      <section className="mx-auto max-w-[1300px] px-6 py-12">
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#4fa5e8] bg-blue-50 px-3.5 py-1.5 rounded-full">Contributor Spotlight</span>
          <p className="max-w-3xl mx-auto text-3xl font-black mt-8 text-[#111111] italic leading-[1.7]" style={{ fontFamily: "'Outfit', sans-serif" }}>
            &ldquo;Sharing my lecture summaries helped me study better, while helping over 500 classmates download revision notes during semesters.&rdquo;
          </p>
          <div className="mt-10 flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-[#4fa5e8] to-[#99c8f2] flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/10">
              A
            </div>
            <h3 className="text-[14.5px] font-bold mt-4 text-zinc-800">Alexis Reed</h3>
            <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Senior Contributor</span>
          </div>
        </div>
      </section>

      {/* ===== SECTION 8: BOTTOM CTA BANNER ===== */}
      <section className="mx-auto max-w-[1300px] rounded-[40px] overflow-hidden shadow-2xl mb-8">
        <div className="w-full bg-gradient-to-br from-[#4fa5e8] via-[#70b7f0] to-[#99c8f2] p-12 md:p-24 text-white relative overflow-hidden flex flex-col items-center text-center">
          
          {/* Background glowing shape */}
          <div className="absolute right-[-10%] bottom-[-10%] w-[450px] h-[450px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute left-[-10%] top-[-10%] w-[450px] h-[450px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 max-w-xl">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white bg-white/20 px-3.5 py-1.5 rounded-full border border-white/30">Get Started</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-6 mb-6 leading-tight tracking-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Ready to contribute to the community?
            </h2>
            <p className="text-[13.5px] text-white/90 leading-[1.8] mb-10 max-w-md mx-auto">
              Join thousands of students sharing guides. Upload and organize your study papers today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/upload" 
                className="rounded-full bg-white px-9 py-4 text-[13px] font-bold uppercase tracking-wider text-[#4fa5e8] shadow-xl transition-all hover:bg-zinc-50 hover:-translate-y-0.5"
              >
                Upload Notes
              </Link>
              <Link 
                href="/search" 
                className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-9 py-4 text-[13px] font-bold uppercase tracking-wider text-white transition-all hover:bg-white/20 hover:-translate-y-0.5"
              >
                Explore Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 9: GIANT TICKER BANNER ===== */}
      <aside aria-label="Feature ticker" className="overflow-hidden py-6 max-w-[1300px] mx-auto">
        <div className="flex gap-16 whitespace-nowrap select-none">
          <div className="flex animate-scroll-ticker gap-16 text-[4.5rem] font-black text-zinc-300/40 uppercase tracking-tighter" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {Array(5).fill("NotesOS").map((txt, idx) => (
              <span key={idx} className="flex items-center gap-16">
                <span>{txt}</span>
                <span className="h-5 w-5 rounded-full bg-zinc-300" />
              </span>
            ))}
          </div>
        </div>
      </aside>

    </div>
  );
}
