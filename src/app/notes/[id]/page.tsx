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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 font-sans select-none">
        <div className="text-center p-8 border-2 border-black bg-[#eae5db] shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          <div className="w-12 h-12 border-2 border-black bg-white flex items-center justify-center mx-auto mb-4">
            <FileText className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-sm font-black uppercase tracking-wider text-black">Note not found</h1>
          <p className="text-xs font-semibold text-zinc-500 mb-6">This note may have been removed or doesn&apos;t exist.</p>
          <Link href="/" className="px-5 py-2 bg-black text-[#f4f1ea] border-2 border-black font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_rgba(210,75,40,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">Go Home</Link>
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
    <div ref={containerRef} className="flex flex-col min-h-[calc(100vh-4rem)] bg-[#f4f1ea] font-sans text-black select-none">
      
      {/* Brutalist Sticky Header Toolbar */}
      <div className="sticky top-16 z-40 border-b-2 border-black px-4 sm:px-6 bg-[#f4f1ea]">
        <div className="site-container flex items-center justify-between h-14 gap-4">
          
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" className="flex-shrink-0 text-black border-2 border-black p-1 bg-white hover:bg-zinc-50 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex flex-col min-w-0">
              <h1 className="text-xs font-black truncate text-black uppercase tracking-tight">{note.title}</h1>
              <span className="text-[9px] font-black text-zinc-550 uppercase tracking-widest sm:block hidden">{note.subject} • Sem {note.semester || "N/A"}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {!isExternal && (
              <>
                <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1 border-2 border-black bg-white hover:bg-zinc-50 transition-colors text-black" aria-label="Zoom out"><ZoomOut className="w-3.5 h-3.5" /></button>
                <span className="text-[10px] font-black text-black w-10 text-center">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1 border-2 border-black bg-white hover:bg-zinc-50 transition-colors text-black" aria-label="Zoom in"><ZoomIn className="w-3.5 h-3.5" /></button>
                <div className="w-0.5 h-5 bg-black/20 mx-1" />
                <button onClick={toggleFullscreen} className="p-1 border-2 border-black bg-white hover:bg-zinc-50 transition-colors text-black" aria-label="Toggle fullscreen">
                  {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                </button>
              </>
            )}
            
            <a 
              href={note.fileUrl} 
              target={isExternal ? "_blank" : undefined} 
              rel={isExternal ? "noopener noreferrer" : undefined} 
              download={!isExternal} 
              className="flex items-center gap-1.5 px-4.5 py-1.5 bg-[#d24b28] text-white border-2 border-black font-black text-[10px] uppercase tracking-wider shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.75 hover:translate-y-0.75 transition-all"
            >
              <span>{isExternal ? "Open Document" : "Download"}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row">
        
        {/* Main Content Area */}
        <div className="flex-1 flex items-start justify-center p-4 sm:p-8 overflow-auto bg-[#eae5db] relative border-b-2 lg:border-b-0 lg:border-r-2 border-black">
          
          {isExternal ? (
            <div className="w-full max-w-md text-center py-10 px-8 border-2 border-black bg-[#f4f1ea] shadow-[4px_4px_0px_rgba(0,0,0,1)] my-auto animate-scale-in relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#d24b28]" />
              
              {/* Cover Art / Thumbnail Frame */}
              {note.thumbnailUrl ? (
                <div className="relative aspect-[3/4] max-w-[200px] mx-auto overflow-hidden mb-6 border-2 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  <img src={note.thumbnailUrl} alt={note.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-[#d24b28] text-white border-2 border-black px-2 py-0.5 text-[8px] font-black uppercase tracking-wider">
                    Drive Link
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-black bg-white flex items-center justify-center mx-auto mb-6 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  <ExternalLink className="w-6 h-6" />
                </div>
              )}
              
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 border border-black bg-[#eae5db] text-black text-[9px] font-black uppercase tracking-wider mb-4">
                <ShieldAlert className="w-3.5 h-3.5 text-[#d24b28]" /> External Document
              </span>

              <h2 className="text-sm font-black text-black uppercase tracking-tight mb-2 leading-tight">
                {note.title}
              </h2>
              <p className="text-xs font-semibold text-zinc-600 mb-6 max-w-sm mx-auto leading-relaxed">
                {note.description || "This academic resource is hosted on Google Drive. Click below to view the file content directory."}
              </p>
              
              <a
                href={note.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-[#f4f1ea] border-2 border-black font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_rgba(210,75,40,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Open External Drive
              </a>
            </div>
          ) : (
            <div className="w-full max-w-5xl" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
              <div className="border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] bg-white">
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

        {/* Sidebar Info Panel */}
        <aside className="w-full lg:w-80 bg-[#f4f1ea] overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {/* Title Block */}
            <div className="space-y-2 border-b-2 border-black/10 pb-4">
              <h2 className="font-black text-sm uppercase tracking-tight text-black leading-snug">{note.title}</h2>
              {note.description && <p className="text-xs font-semibold text-zinc-600 leading-relaxed">{note.description}</p>}
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 p-4 border-2 border-black bg-white shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              <div className="w-8 h-8 rounded-none border-2 border-black bg-black text-white flex items-center justify-center text-[10px] font-black">
                {note.author.name[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-black truncate">{note.author.name}</p>
                <p className="text-[9px] font-black text-zinc-500 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" /> {formatDate(note.createdAt)}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 p-3 border-2 border-black bg-white shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                  <stat.icon className="w-4 h-4 text-black flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-black leading-none">{stat.value}</p>
                    <p className="text-[8px] font-black text-zinc-550 tracking-wider uppercase mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Meta Properties */}
            <div className="border-t-2 border-black pt-4 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Subject</span>
                <span className="font-black text-black">{note.subject}</span>
              </div>
              {note.semester && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Semester</span>
                  <span className="font-black text-black">Semester {note.semester}</span>
                </div>
              )}
              {note.university && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">University</span>
                  <span className="font-black text-black truncate max-w-[140px] text-right">{note.university}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500 font-bold uppercase tracking-wider text-[9px]">Source</span>
                <span className="px-2 py-0.5 border border-black bg-[#eae5db] text-black text-[9px] font-black">
                  {isExternal ? "Google Drive" : "Direct PDF"}
                </span>
              </div>
            </div>

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <p className="text-[8px] font-black text-zinc-500 tracking-wider uppercase">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map((tag) => (
                    <Link 
                      key={tag} 
                      href={`/search?q=${encodeURIComponent(tag)}`} 
                      className="px-2 py-0.5 border border-black bg-white text-[9px] font-black text-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t-2 border-black/10">
              <a
                href={note.fileUrl}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                download={!isExternal}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-black text-[#f4f1ea] border-2 border-black font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_rgba(210,75,40,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
              >
                {isExternal ? <ExternalLink className="w-4.5 h-4.5" /> : <Download className="w-4.5 h-4.5" />}
                <span>{isExternal ? "Open in Google Drive" : "Download PDF Document"}</span>
              </a>
            </div>
            
          </div>
        </aside>
      </div>
    </div>
  );
}
