"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, FileText, Download, Eye, User, SlidersHorizontal } from "lucide-react";
import { formatFileSize, formatNumber } from "@/lib/utils";
import { Suspense } from "react";

interface NoteResult {
  id: string;
  title: string;
  description?: string;
  subject: string;
  semester?: number;
  university?: string;
  authorName: string;
  downloads: number;
  views: number;
  fileSize: number;
  pageCount?: number;
  createdAt: number;
  _formatted?: { title?: string; description?: string };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<NoteResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery);
  }, []);

  const doSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({ q: q.trim() });
      if (subjectFilter) params.set("subject", subjectFilter);
      if (semesterFilter) params.set("semester", semesterFilter);
      if (sortBy !== "relevance") params.set("sort", sortBy);
      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();
      setResults(data.hits || []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); doSearch(query); };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50 selection:bg-purple-500/30">
      
      {/* Decorative ambient glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-1/2 top-[-10%] -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-purple-600/20 blur-[100px]" 
      />

      <main className="relative z-10 w-full px-4 py-12 sm:px-6 lg:px-8 max-w-6xl mx-auto">

        {/* Header */}
        <header className="mb-8 animate-in slide-in-from-bottom-4 duration-500">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
            Search Directory
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-50">
            Find <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Study Material</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-400">Instant typo-tolerant search across subjects and levels</p>
        </header>

        {/* Search Bar */}
        <section aria-label="Search form" className="mb-6 animate-in slide-in-from-bottom-6 duration-500 delay-100">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by subject, college, semester, keyword..."
                  className="w-full rounded-full border border-white/10 bg-zinc-900/50 py-3.5 pl-12 pr-4 text-sm text-zinc-50 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  id="search-input"
                  aria-label="Search query"
                  autoFocus
                />
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                    showFilters
                      ? "border-white bg-white text-zinc-950"
                      : "border-white/10 bg-white/[0.02] text-zinc-300 hover:bg-white/[0.05]"
                  }`}
                  aria-expanded={showFilters}
                  aria-controls="filters-panel"
                >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  Filters
                </button>

                <button 
                  type="submit" 
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-7 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Filters Panel */}
        {showFilters && (
          <section id="filters-panel" aria-label="Search filters" className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
            <div>
              <label htmlFor="subject-filter" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Subject</label>
              <select
                id="subject-filter"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-zinc-900/80 px-3 py-2 text-xs text-zinc-50 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                <option value="">All Subjects</option>
                {["Computer Science","Mathematics","Physics","Engineering","Chemistry","Biology","Electronics","Business","Law","Medicine"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="semester-filter" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Semester</label>
              <select
                id="semester-filter"
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-zinc-900/80 px-3 py-2 text-xs text-zinc-50 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                <option value="">All Semesters</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={String(s)}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="sort-filter" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Sort By</label>
              <select
                id="sort-filter"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-zinc-900/80 px-3 py-2 text-xs text-zinc-50 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                <option value="relevance">Most Relevant</option>
                <option value="createdAt:desc">Newest First</option>
                <option value="downloads:desc">Most Downloaded</option>
                <option value="views:desc">Most Viewed</option>
              </select>
            </div>
          </section>
        )}

        {/* Results Section */}
        <section aria-label="Search results">
          {loading ? (
            <div className="space-y-4" aria-busy="true">
              {[1,2,3].map(i => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 animate-pulse backdrop-blur-md">
                  <div className="mb-3 h-4 w-1/3 rounded bg-white/10" />
                  <div className="mb-2 h-3 w-1/2 rounded bg-white/5" />
                  <div className="h-3 w-1/4 rounded bg-white/5" />
                </div>
              ))}
            </div>
          ) : searched && results.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] py-16 text-center backdrop-blur-md">
              <Search className="mx-auto mb-3 h-8 w-8 text-zinc-600" aria-hidden="true" />
              <h2 className="text-sm font-bold text-zinc-50">No documents found</h2>
              <p className="mt-1 text-xs text-zinc-500">Try another keyword or remove subject filters</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              <p className="mb-1 text-xs text-zinc-500" aria-live="polite">
                Showing {results.length} matched note{results.length !== 1 ? "s" : ""}
              </p>
              <ul className="space-y-4">
                {results.map((note) => (
                  <li key={note.id}>
                    <Link
                      href={`/notes/${note.id}`}
                      className="group block rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-purple-500/30 hover:bg-white/[0.04] hover:shadow-[0_4px_20px_rgba(168,85,247,0.1)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950 backdrop-blur-md"
                    >
                      <article className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400" aria-hidden="true">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3
                            className="truncate text-base font-extrabold text-zinc-50 transition-colors group-hover:text-purple-400"
                            dangerouslySetInnerHTML={{ __html: note._formatted?.title || note.title }}
                          />
                          {(note._formatted?.description || note.description) && (
                            <p
                              className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400"
                              dangerouslySetInnerHTML={{ __html: note._formatted?.description || note.description || "" }}
                            />
                          )}
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
                            <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 font-bold text-purple-400">
                              {note.subject}
                            </span>
                            {note.semester && <span className="font-semibold text-zinc-400">Sem {note.semester}</span>}
                            {note.university && <span className="text-zinc-500">{note.university}</span>}
                            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" aria-hidden="true" /><span className="sr-only">Views: </span>{formatNumber(note.views)}</span>
                            <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" aria-hidden="true" /><span className="sr-only">Downloads: </span>{formatNumber(note.downloads)}</span>
                            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" aria-hidden="true" /><span className="sr-only">Author: </span>{note.authorName}</span>
                            <span>{formatFileSize(note.fileSize)}</span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[40vh] items-center justify-center bg-zinc-950 px-4 py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" aria-label="Loading..." role="status" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
