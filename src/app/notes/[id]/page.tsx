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
      <div className="min-h-[60vh] flex items-center justify-center bg-[#08080c]">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 bg-[#08080c]">
        <div className="text-center glass-card p-8 max-w-xs">
          <FileText className="w-8 h-8 text-zinc-650 mx-auto mb-3" />
          <h1 className="text-sm font-bold text-white">Note not found</h1>
          <p className="text-xs text-zinc-500 mt-1 mb-4">This note may have been removed.</p>
          <Link href="/" className="btn-primary px-5 py-2 text-xs">Go Home</Link>
        </div>
      </div>
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
    <div ref={containerRef} className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#08080c] relative">

      {/* Toolbar */}
      <div className="sticky top-16 z-40 border-b border-white/[0.04] bg-[#08080c]/80 backdrop-blur-xl">
        <div className="site-container flex items-center justify-between h-14 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="shrink-0 w-8 h-8 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center hover:bg-white/[0.05] transition-colors">
              <ArrowLeft className="w-4 h-4 text-white" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-white truncate">{note.title}</h1>
              <span className="text-[10px] text-zinc-500 hidden sm:block mt-0.5">{note.subject}{note.semester ? ` • Sem ${note.semester}` : ""}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {!isExternal && (
              <>
                <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="w-8 h-8 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center hover:bg-white/[0.05] transition-colors text-white" aria-label="Zoom out"><ZoomOut className="w-3.5 h-3.5" /></button>
                <span className="text-xs font-semibold text-zinc-400 w-9 text-center">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="w-8 h-8 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center hover:bg-white/[0.05] transition-colors text-white" aria-label="Zoom in"><ZoomIn className="w-3.5 h-3.5" /></button>
                <div className="w-px h-4 bg-white/[0.06] mx-0.5" />
                <button onClick={toggleFullscreen} className="w-8 h-8 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center hover:bg-white/[0.05] transition-colors text-white" aria-label="Fullscreen">
                  {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                </button>
              </>
            )}

            <a
              href={note.fileUrl}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              download={!isExternal}
              className="btn-primary px-5 py-2 text-xs ml-1 rounded-full"
            >
              {isExternal ? "Open" : "Download"}
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row relative z-10">

        {/* Main Content Viewer */}
        <div className="flex-1 flex items-start justify-center p-4 sm:p-6 overflow-auto bg-[#0b0b0f] border-b lg:border-b-0 lg:border-r border-white/[0.04]">
          {isExternal ? (
            <div className="w-full max-w-sm text-center py-10 px-6 glass-card my-auto animate-scale-in">
              {note.thumbnailUrl ? (
                <div className="relative aspect-[3/4] max-w-[180px] mx-auto overflow-hidden mb-5 rounded-xl border border-white/[0.06]">
                  <img src={note.thumbnailUrl} alt={note.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded px-2 py-0.5 text-[8px] font-bold">Drive</span>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-5">
                  <ExternalLink className="w-5 h-5 text-purple-400" />
                </div>
              )}

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold mb-3">
                <ShieldAlert className="w-3.5 h-3.5" /> External Link
              </span>

              <h2 className="text-sm font-bold text-white mb-1.5 leading-snug">{note.title}</h2>
              <p className="text-xs text-zinc-500 mb-5 leading-relaxed">
                {note.description || "This resource is hosted externally. Click below to view."}
              </p>

              <a href={note.fileUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold text-xs hover:bg-zinc-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Open External Link
              </a>
            </div>
          ) : (
            <div className="w-full max-w-5xl" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
              <div className="rounded-xl border border-white/[0.06] overflow-hidden bg-white shadow-2xl">
                <iframe
                  src={`${note.fileUrl}#toolbar=0`}
                  className="w-full bg-white"
                  style={{ height: "88vh" }}
                  title={note.title}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-72 overflow-y-auto bg-[#08080c]/50 backdrop-blur-md">
          <div className="p-5 space-y-5">
            {/* Title Block */}
            <div className="border-b border-white/[0.04] pb-4">
              <h2 className="font-extrabold text-sm text-white leading-snug">{note.title}</h2>
              {note.description && <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{note.description}</p>}
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 glass-card p-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                {note.author.name[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{note.author.name}</p>
                <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" /> {formatDate(note.createdAt)}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-card p-3 flex items-center gap-2.5">
                  <stat.icon className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <p className="text-xs font-extrabold text-white">{stat.value}</p>
                    <p className="text-[9px] text-zinc-500 mt-0.5 font-medium uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Meta */}
            <div className="border-t border-white/[0.04] pt-4 space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Subject</span>
                <span className="font-bold text-white">{note.subject}</span>
              </div>
              {note.semester && (
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Semester</span>
                  <span className="font-bold text-white">{note.semester}</span>
                </div>
              )}
              {note.university && (
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">University</span>
                  <span className="font-bold text-white truncate max-w-[120px] text-right">{note.university}</span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Source</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold">
                  {isExternal ? "Google Drive" : "Direct PDF"}
                </span>
              </div>
            </div>

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="pt-2 space-y-2">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="px-2.5 py-0.5 rounded-full bg-white/[0.02] border border-white/[0.06] text-[10px] text-zinc-400 hover:text-white transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Action Download */}
            <div className="pt-3 border-t border-white/[0.04]">
              <a
                href={note.fileUrl}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                download={!isExternal}
                className="btn-primary w-full py-3 text-xs rounded-full"
              >
                {isExternal ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                {isExternal ? "Open in Google Drive" : "Download PDF Document"}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
