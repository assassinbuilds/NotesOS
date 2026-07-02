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
    <div className="relative overflow-hidden bg-[#08080c] min-h-screen text-white select-none">
      
      {/* Ambient glow */}
      <div className="hero-glow" />

      <div className="site-container py-12 relative z-10">

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 mb-3">
            Search Directory
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Find <span className="text-gradient">Study Material</span></h1>
          <p className="mt-1 text-sm text-zinc-500">Instant typo-tolerant search across subjects and levels</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by subject, college, semester, keyword..."
                className="w-full input py-3.5 pl-12 pr-4 text-sm"
                id="search-input"
                autoFocus
              />
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  showFilters
                    ? "bg-white text-black border-white"
                    : "bg-white/[0.02] text-zinc-300 border-white/[0.06] hover:bg-white/[0.05]"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>

              <button type="submit" className="btn-primary px-7 py-3 rounded-full" id="search-submit">
                Search
              </button>
            </div>
          </div>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 p-5 glass-card animate-slide-down">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Subject</label>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="input py-2 px-3 text-xs"
              >
                <option value="">All Subjects</option>
                {["Computer Science","Mathematics","Physics","Engineering","Chemistry","Biology","Electronics","Business","Law","Medicine"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Semester</label>
              <select
                value={semesterFilter}
                onChange={(e) => setSemesterFilter(e.target.value)}
                className="input py-2 px-3 text-xs"
              >
                <option value="">All Semesters</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={String(s)}>Semester {s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input py-2 px-3 text-xs"
              >
                <option value="relevance">Most Relevant</option>
                <option value="createdAt:desc">Newest First</option>
                <option value="downloads:desc">Most Downloaded</option>
                <option value="views:desc">Most Viewed</option>
              </select>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-4 w-1/3 bg-white/[0.06] rounded mb-3" />
                <div className="h-3 w-1/2 bg-white/[0.04] rounded mb-2" />
                <div className="h-3 w-1/4 bg-white/[0.04] rounded" />
              </div>
            ))}
          </div>
        ) : searched && results.length === 0 ? (
          <div className="text-center py-16 glass-card">
            <Search className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
            <h2 className="text-sm font-bold text-white">No documents found</h2>
            <p className="text-xs text-zinc-500 mt-1">Try another keyword or remove subject filters</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <p className="text-xs text-zinc-500 mb-1">
              Showing {results.length} matched note{results.length !== 1 ? "s" : ""}
            </p>
            {results.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="block glass-card p-5 hover:border-purple-500/20 hover:shadow-[0_4px_20px_rgba(168,85,247,0.05)] transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-base font-extrabold text-white group-hover:text-purple-400 transition-colors truncate"
                      dangerouslySetInnerHTML={{ __html: note._formatted?.title || note.title }}
                    />
                    {(note._formatted?.description || note.description) && (
                      <p
                        className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: note._formatted?.description || note.description || "" }}
                      />
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-zinc-500">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold">
                        {note.subject}
                      </span>
                      {note.semester && <span className="font-semibold text-zinc-400">Sem {note.semester}</span>}
                      {note.university && <span className="text-zinc-500">{note.university}</span>}
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatNumber(note.views)}</span>
                      <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{formatNumber(note.downloads)}</span>
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{note.authorName}</span>
                      <span>{formatFileSize(note.fileSize)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="site-container py-12 flex justify-center items-center min-h-[40vh] bg-[#08080c]">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
