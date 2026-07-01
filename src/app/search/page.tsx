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
    <div className="site-container py-10 sm:py-16 font-sans select-none">
      
      {/* Modern Header Block */}
      <div className="mb-10 p-8 rounded-3xl bg-white border border-black/5 shadow-sm animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#d24b28]/5 -mr-5 -mt-5" />
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
          Search Directory
        </h1>
        <p className="mt-1.5 text-xs font-semibold uppercase text-[#d24b28] tracking-wider">
          Find notes, past sheets, and summaries across subjects
        </p>
      </div>

      {/* Search Bar Container */}
      <form onSubmit={handleSubmit} className="mb-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#d24b28] transition-colors" />
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search notes by subject, university, tags..." 
              className="w-full pl-11 pr-4 py-3.5 modern-input bg-white text-xs text-black font-semibold" 
              id="search-input" 
              autoFocus 
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => setShowFilters(!showFilters)} 
              className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border
                ${showFilters 
                  ? "bg-black text-[#f4f1ea] border-black" 
                  : "bg-white text-black border-zinc-200 shadow-sm hover:bg-zinc-50"}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
            
            <button 
              type="submit" 
              className="modern-btn-primary px-8 py-3.5 flex-1 sm:flex-none" 
              id="search-submit"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Filters (Modern style) */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-6 rounded-2xl bg-white border border-black/5 shadow-sm animate-slide-down">
          <select 
            value={subjectFilter} 
            onChange={(e) => setSubjectFilter(e.target.value)} 
            className="px-3.5 py-2.5 border border-zinc-200 rounded-xl bg-white text-xs font-semibold text-black outline-none focus:border-[#d24b28] transition-colors"
          >
            <option value="">All Subjects</option>
            {["Computer Science","Mathematics","Physics","Engineering","Chemistry","Biology","Electronics","Business","Law","Medicine"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            value={semesterFilter} 
            onChange={(e) => setSemesterFilter(e.target.value)} 
            className="px-3.5 py-2.5 border border-zinc-200 rounded-xl bg-white text-xs font-semibold text-black outline-none focus:border-[#d24b28] transition-colors"
          >
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={String(s)}>Semester {s}</option>)}
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="px-3.5 py-2.5 border border-zinc-200 rounded-xl bg-white text-xs font-semibold text-black outline-none focus:border-[#d24b28] transition-colors"
          >
            <option value="relevance">Most Relevant</option>
            <option value="createdAt:desc">Newest First</option>
            <option value="downloads:desc">Most Downloaded</option>
            <option value="views:desc">Most Viewed</option>
          </select>
        </div>
      )}

      {/* Results Section */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="modern-card p-6 bg-white animate-pulse">
              <div className="h-5 w-2/3 bg-zinc-200 rounded-lg mb-3.5" />
              <div className="h-4 w-1/2 bg-zinc-100 rounded-lg" />
            </div>
          ))}
        </div>
      ) : searched && results.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-zinc-200 bg-white shadow-sm">
          <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mx-auto mb-4 border border-zinc-100">
            <Search className="w-5 h-5 text-zinc-400" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-wider text-black">No notes found</h2>
          <p className="text-xs font-semibold text-zinc-500 mt-1">Try broad keywords or change filters</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">
            {results.length} Note{results.length !== 1 ? "s" : ""} located
          </p>
          {results.map((note) => (
            <Link 
              key={note.id} 
              href={`/notes/${note.id}`} 
              className="block p-5 bg-white rounded-2xl border border-black/5 shadow-sm hover:border-[#d24b28]/10 hover:shadow-md hover:scale-[1.005] transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#d24b28]/10 text-[#d24b28] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 
                    className="text-sm font-black text-black group-hover:text-[#d24b28] transition-colors truncate" 
                    dangerouslySetInnerHTML={{ __html: note._formatted?.title || note.title }} 
                  />
                  {(note._formatted?.description || note.description) && (
                    <p 
                      className="text-xs font-semibold text-zinc-650 mt-1 line-clamp-2 leading-relaxed" 
                      dangerouslySetInnerHTML={{ __html: note._formatted?.description || note.description || "" }} 
                    />
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-3.5 text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#d24b28]/10 text-[#d24b28] text-[9px] font-bold">
                      {note.subject}
                    </span>
                    {note.semester && <span>Sem {note.semester}</span>}
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatNumber(note.views)}</span>
                    <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{formatNumber(note.downloads)}</span>
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{note.authorName}</span>
                    {note.pageCount && <span>{note.pageCount} pages</span>}
                    <span>{formatFileSize(note.fileSize)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="site-container py-8 sm:py-12 flex justify-center items-center min-h-[40vh]">
        <div className="w-6 h-6 border-2 border-[#d24b28] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
