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
      
      {/* Brutalist Header Block */}
      <div className="mb-10 p-6 border-2 border-black bg-[#e8e3d5] shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
          Search Directory
        </h1>
        <p className="mt-1.5 text-xs font-semibold uppercase text-zinc-650">
          Find notes, past sheets, and summaries across subjects
        </p>
      </div>

      {/* Search Bar Container */}
      <form onSubmit={handleSubmit} className="mb-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Search notes by subject, university, tags..." 
              className="w-full pl-11 pr-4 py-3.5 border-2 border-black rounded-none bg-white text-xs text-black font-semibold outline-none focus:bg-[#fcfbf9] focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all" 
              id="search-input" 
              autoFocus 
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => setShowFilters(!showFilters)} 
              className={`flex items-center justify-center gap-2 px-5 py-3.5 border-2 border-black rounded-none text-xs font-black uppercase tracking-wider transition-all
                ${showFilters 
                  ? "bg-black text-[#f4f1ea] shadow-none translate-x-1 translate-y-1" 
                  : "bg-white text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
            
            <button 
              type="submit" 
              className="flex-1 sm:flex-none px-8 py-3.5 bg-[#d24b28] text-white border-2 border-black rounded-none font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all" 
              id="search-submit"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Filters (Brutalist style) */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 p-5 border-2 border-black bg-[#eae5db] shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-slide-down">
          <select 
            value={subjectFilter} 
            onChange={(e) => setSubjectFilter(e.target.value)} 
            className="px-3 py-2.5 border-2 border-black rounded-none bg-white text-xs font-semibold text-black outline-none"
          >
            <option value="">All Subjects</option>
            {["Computer Science","Mathematics","Physics","Engineering","Chemistry","Biology","Electronics","Business","Law","Medicine"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            value={semesterFilter} 
            onChange={(e) => setSemesterFilter(e.target.value)} 
            className="px-3 py-2.5 border-2 border-black rounded-none bg-white text-xs font-semibold text-black outline-none"
          >
            <option value="">All Semesters</option>
            {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={String(s)}>Semester {s}</option>)}
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="px-3 py-2.5 border-2 border-black rounded-none bg-white text-xs font-semibold text-black outline-none"
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
            <div key={i} className="border-2 border-black p-6 bg-white animate-pulse shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <div className="h-5 w-2/3 bg-zinc-200 rounded-none mb-3.5" />
              <div className="h-4 w-1/2 bg-zinc-100 rounded-none" />
            </div>
          ))}
        </div>
      ) : searched && results.length === 0 ? (
        <div className="text-center py-16 p-8 border-2 border-dashed border-black bg-[#eae5db]">
          <div className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center mx-auto mb-4">
            <Search className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-wider text-black">No notes found</h2>
          <p className="text-xs font-semibold text-zinc-500 mt-1">Try broad keywords or change filters</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-550 mb-2">
            {results.length} Note{results.length !== 1 ? "s" : ""} located
          </p>
          {results.map((note) => (
            <Link 
              key={note.id} 
              href={`/notes/${note.id}`} 
              className="block border-2 border-black p-5 bg-[#f4f1ea] shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 border-2 border-black bg-black text-[#f4f1ea] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 
                    className="text-sm font-black text-black group-hover:text-[#d24b28] transition-colors truncate" 
                    dangerouslySetInnerHTML={{ __html: note._formatted?.title || note.title }} 
                  />
                  {(note._formatted?.description || note.description) && (
                    <p 
                      className="text-xs font-semibold text-zinc-600 mt-1 line-clamp-2 leading-relaxed" 
                      dangerouslySetInnerHTML={{ __html: note._formatted?.description || note.description || "" }} 
                    />
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    <span className="px-2 py-0.5 border border-black bg-[#eae5db] text-black text-[9px] font-black">
                      {note.subject}
                    </span>
                    {note.semester && <span>Sem {note.semester}</span>}
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(note.views)}</span>
                    <span className="flex items-center gap-1"><Download className="w-3 h-3" />{formatNumber(note.downloads)}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{note.authorName}</span>
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
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
