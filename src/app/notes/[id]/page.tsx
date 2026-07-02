"use client";

import { useState, useEffect, useRef, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ArrowLeft, Download, Eye,
  ZoomIn, ZoomOut, Maximize, Minimize,
  FileText, Heart, ExternalLink, Calendar, ShieldAlert
} from "lucide-react";
import { formatFileSize, formatDate, formatNumber } from "@/lib/utils";

interface NoteData {
  id: string;
  title: string;
  description?: string;
  subject: string;
  semester?: number;
  university?: string;
  tags: string[];
  fileUrl: string;
  fileKey: string;
  fileSize: number;
  pageCount?: number;
  thumbnailUrl?: string | null;
  downloads: number;
  views: number;
  author: { id: string; name: string; image?: string };
  createdAt: string;
  _count?: { likes: number; comments: number; bookmarks: number };
}

const viewedNotesSession = new Set<string>();

export default function NoteReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [note, setNote] = useState<NoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNote();
    
    if (!viewedNotesSession.has(id)) {
      viewedNotesSession.add(id);
      incrementView();
    }
  }, [id]);

  const incrementView = async () => {
    try {
      await fetch(`/api/notes/${id}/view`, { method: "POST" });
    } catch (err) {
      console.error("Failed to increment view:", err);
    }
  };

  const fetchNote = async () => {
    try {
      const res = await fetch(`/api/notes/${id}`);
      if (res.ok) {
        const data = await res.json();
        setNote(data.note);
      }
    } catch (err) {
      console.error("Failed to fetch note:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-zinc-950 px-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" aria-label="Loading document..." role="status" />
      </main>
    );
  }

  if (!note) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-zinc-950 px-4">
        <section aria-label="Error" className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-md">
          <FileText className="mx-auto mb-3 h-8 w-8 text-zinc-600" aria-hidden="true" />
          <h1 className="text-sm font-bold text-zinc-50">Note not found</h1>
          <p className="mb-4 mt-1 text-xs text-zinc-500">This note may have been removed.</p>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2 text-xs font-semibold text-white shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Go Home
          </Link>
        </section>
      </main>
    );
  }

  const isExternal = note.fileKey === "external" || (!note.fileUrl.toLowerCase().endsWith(".pdf") && !note.fileUrl.includes("/uploads/"));

  const stats = [
    { icon: Eye, label: "Views", value: formatNumber(note.views) },
    { icon: isExternal ? ExternalLink : Download, label: isExternal ? "Clicks" : "Downloads", value: formatNumber(note.downloads) },
    { icon: Heart, label: "Likes", value: formatNumber(note._count?.likes || 0) },
    ...(isExternal ? [] : [{ icon: FileText, label: "Size", value: formatFileSize(note.fileSize) }]),
  ];

  return (
    <div ref={containerRef} className="relative flex min-h-[calc(100vh-4rem)] flex-col bg-zinc-950">

      {/* Document Toolbar */}
      <nav aria-label="Document toolbar" className="sticky top-16 z-40 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          
          {/* Back & Title */}
          <div className="flex min-w-0 items-center gap-3">
            <Link 
              href="/" 
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-zinc-50 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-zinc-50">{note.title}</h1>
              <span className="hidden mt-0.5 text-[10px] text-zinc-500 sm:block">{note.subject}{note.semester ? ` • Sem ${note.semester}` : ""}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            {!isExternal && (
              <>
                <button 
                  onClick={() => setZoom(Math.max(50, zoom - 10))} 
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-zinc-50 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  aria-label="Zoom out"
                >
                  <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <span className="w-9 text-center text-xs font-semibold text-zinc-400" aria-live="polite" aria-atomic="true">
                  {zoom}%
                </span>
                <button 
                  onClick={() => setZoom(Math.min(200, zoom + 10))} 
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-zinc-50 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  aria-label="Zoom in"
                >
                  <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <div className="mx-0.5 h-4 w-px bg-white/10" aria-hidden="true" />
                <button 
                  onClick={toggleFullscreen} 
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-zinc-50 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                  aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  aria-pressed={isFullscreen}
                >
                  {isFullscreen ? <Minimize className="h-3.5 w-3.5" aria-hidden="true" /> : <Maximize className="h-3.5 w-3.5" aria-hidden="true" />}
                </button>
              </>
            )}

            <a
              href={note.fileUrl}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              download={!isExternal}
              className="ml-1 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2 text-xs font-semibold text-white shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              {isExternal ? "Open" : "Download"}
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex flex-1 flex-col lg:flex-row">

        {/* Viewer */}
        <section aria-label="Document Viewer" className="flex flex-1 items-start justify-center overflow-auto border-b border-white/5 bg-[#0b0b0f] p-4 sm:p-6 lg:border-b-0 lg:border-r">
          {isExternal ? (
            <div className="my-auto w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-10 text-center backdrop-blur-md animate-in zoom-in-95 duration-300">
              {note.thumbnailUrl ? (
                <div className="mx-auto mb-5 relative aspect-[3/4] max-w-[180px] overflow-hidden rounded-xl border border-white/10">
                  <img src={note.thumbnailUrl} alt={note.title} className="h-full w-full object-cover" />
                  <span className="absolute right-2 top-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 text-[8px] font-bold text-white">Drive</span>
                </div>
              ) : (
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10" aria-hidden="true">
                  <ExternalLink className="h-5 w-5 text-purple-400" />
                </div>
              )}

              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[10px] font-bold text-purple-400">
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" /> External Link
              </span>

              <h2 className="mb-1.5 text-sm font-bold leading-snug text-zinc-50">{note.title}</h2>
              <p className="mb-5 text-xs leading-relaxed text-zinc-400">
                {note.description || "This resource is hosted externally. Click below to view."}
              </p>

              <a 
                href={note.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-zinc-50 px-6 py-3 text-xs font-bold text-zinc-950 transition-colors hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" /> Open External Link
              </a>
            </div>
          ) : (
            <div className="w-full max-w-5xl transition-transform duration-200 ease-out" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white shadow-2xl">
                <iframe
                  src={`${note.fileUrl}#toolbar=0`}
                  className="w-full bg-white"
                  style={{ height: "88vh" }}
                  title={note.title}
                />
              </div>
            </div>
          )}
        </section>

        {/* Sidebar Metadata */}
        <aside aria-label="Document Details" className="w-full overflow-y-auto bg-zinc-950/50 backdrop-blur-md lg:w-72">
          <div className="space-y-5 p-5">
            
            {/* Title Block */}
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-sm font-extrabold leading-snug text-zinc-50">{note.title}</h2>
              {note.description && <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{note.description}</p>}
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3 backdrop-blur-md">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-bold text-white shadow-sm" aria-hidden="true">
                {note.author.name[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-zinc-50">{note.author.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-500">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" /> {formatDate(note.createdAt)}
                </p>
              </div>
            </div>

            {/* Statistics */}
            <ul aria-label="Statistics" className="grid grid-cols-2 gap-2">
              {stats.map((stat) => (
                <li key={stat.label} className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.02] p-3 backdrop-blur-md">
                  <stat.icon className="h-4 w-4 shrink-0 text-purple-400" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-extrabold text-zinc-50">{stat.value}</p>
                    <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-zinc-500">{stat.label}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Meta Properties */}
            <dl className="space-y-2.5 border-t border-white/5 pt-4">
              <div className="flex justify-between text-xs">
                <dt className="text-zinc-500">Subject</dt>
                <dd className="font-bold text-zinc-50">{note.subject}</dd>
              </div>
              {note.semester && (
                <div className="flex justify-between text-xs">
                  <dt className="text-zinc-500">Semester</dt>
                  <dd className="font-bold text-zinc-50">{note.semester}</dd>
                </div>
              )}
              {note.university && (
                <div className="flex justify-between text-xs">
                  <dt className="text-zinc-500">University</dt>
                  <dd className="max-w-[120px] truncate text-right font-bold text-zinc-50">{note.university}</dd>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <dt className="text-zinc-500">Source</dt>
                <dd className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-400">
                  {isExternal ? "Google Drive" : "Direct PDF"}
                </dd>
              </div>
            </dl>

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="pt-2">
                <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tags</h3>
                <ul className="flex flex-wrap gap-1.5" aria-label="Document tags">
                  {note.tags.map((tag) => (
                    <li key={tag}>
                      <Link
                        href={`/search?q=${encodeURIComponent(tag)}`}
                        className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-[10px] text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action */}
            <div className="border-t border-white/5 pt-4">
              <a
                href={note.fileUrl}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                download={!isExternal}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-xs font-bold text-white shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                {isExternal ? <ExternalLink className="h-4 w-4" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
                {isExternal ? "Open in Google Drive" : "Download PDF Document"}
              </a>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
