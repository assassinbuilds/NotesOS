"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import {
  Upload, FileText, X, Tag, BookOpen, GraduationCap,
  Building2, AlertCircle, Check, Loader2, CloudUpload,
} from "lucide-react";
import Link from "next/link";
import { formatFileSize } from "@/lib/utils";

const subjects = [
  "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology",
  "Engineering", "Electronics", "Mechanical", "Civil", "Electrical",
  "Information Technology", "Business", "Economics", "Law", "Medicine",
  "Arts & Design", "Languages", "Psychology", "Other",
];

export default function UploadPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [uploadMode, setUploadMode] = useState<"pdf" | "link">("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [university, setUniversity] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDropPdf = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f) {
      if (f.size > 4 * 1024 * 1024) { setError("PDF file must be under 4MB."); return; }
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " "));
      setError("");
    }
  }, [title]);

  const onDropImage = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f) {
      if (f.size > 5 * 1024 * 1024) { setError("Cover image must be under 5MB."); return; }
      setCoverImage(f);
      setError("");
    }
  }, []);

  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps, isDragActive: isPdfDragActive } = useDropzone({
    onDrop: onDropPdf, accept: { "application/pdf": [".pdf"] }, maxFiles: 1, multiple: false,
  });

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({
    onDrop: onDropImage, accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] }, maxFiles: 1, multiple: false,
  });

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 10) { setTags([...tags, tag]); setTagInput(""); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadMode === "pdf" && !file) { setError("Please select a PDF file."); return; }
    if (uploadMode === "link" && !externalUrl.trim()) { setError("Please enter a Google Drive or external URL."); return; }
    if (!title.trim()) { setError("Please enter a title."); return; }
    if (!subject) { setError("Please select a subject."); return; }
    
    setUploading(true); setError("");
    try {
      const formData = new FormData();
      if (uploadMode === "pdf" && file) {
        formData.append("file", file);
      } else if (uploadMode === "link") {
        formData.append("externalUrl", externalUrl.trim());
        if (coverImage) {
          formData.append("file", coverImage);
        }
      }
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("subject", subject);
      formData.append("semester", semester);
      formData.append("university", university.trim());
      formData.append("tags", JSON.stringify(tags));
      
      const progressInterval = setInterval(() => setUploadProgress((p) => Math.min(p + 10, 90)), 200);
      const res = await fetch("/api/notes", { method: "POST", body: formData });
      clearInterval(progressInterval);
      
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Upload failed"); }
      setUploadProgress(100);
      const data = await res.json();
      setTimeout(() => router.push(`/notes/${data.note.id}`), 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setUploadProgress(0);
    } finally { setUploading(false); }
  };

  if (!session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Sign in to Upload</h1>
          <p className="text-surface-500 dark:text-surface-400 mb-6">You need to be signed in to upload notes.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-all">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* Premium Studio Mesh Glow Backdrop */}
      <div className="absolute top-[-25%] left-[-15%] w-[60%] h-[60%] rounded-full bg-[#ff5a36]/8 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-25%] right-[-15%] w-[60%] h-[60%] rounded-full bg-violet-600/6 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-blue-500/3 blur-[100px] pointer-events-none" />

      {/* Glassmorphic Modal Card */}
      <div className="w-full max-w-[480px] bg-[#0d0d0d]/85 backdrop-blur-xl border border-zinc-800/40 text-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.85)] p-7 sm:p-9 relative overflow-hidden overflow-y-auto animate-scale-in custom-scrollbar" style={{ maxHeight: '95vh' }}>
        
        {/* Soft upper gradient highlight line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#ff5a36]/60 to-transparent" />

        {/* Title / Header */}
        <div className="mb-7 text-center">
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center justify-center gap-2">
            Upload Notes
          </h1>
          <p className="mt-1.5 text-xs text-zinc-400 leading-normal max-w-[90%] mx-auto">
            Securely add your academic documents to share them with the student community.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-950/40 border border-red-900/45 text-red-400 text-xs mb-5 animate-scale-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Drag & Drop PDF Uploader */}
          <div 
            {...getPdfRootProps()} 
            className={`group rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden bg-[#141414]/50 backdrop-blur-sm
              ${isPdfDragActive 
                ? "border-[#ff5a36] bg-[#ff5a36]/5" 
                : file 
                  ? "border-emerald-500 bg-emerald-950/10" 
                  : "border-zinc-800/80 hover:border-[#ff5a36]/60 hover:bg-[#1a1a1a]/55"
              }`}
          >
            <input {...getPdfInputProps()} disabled={!!externalUrl} />
            
            {file ? (
              <div className="flex flex-col items-center gap-3 animate-scale-in">
                {/* File Selected Preview */}
                <div className="w-12 h-12 rounded-xl bg-emerald-950/40 border border-emerald-900/40 flex items-center justify-center text-emerald-400 shadow-inner">
                  <FileText className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-center px-4 w-full">
                  <p className="font-semibold text-zinc-200 text-xs truncate max-w-[280px] mx-auto">{file.name}</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{formatFileSize(file.size)}</p>
                </div>
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-all border border-red-900/30 active:scale-95"
                >
                  <X className="w-3 h-3" /> Remove File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3.5">
                {/* Coral Orange Circular Button (Scales on drag & group-hover) */}
                <div className="w-12 h-12 rounded-full bg-[#ff5a36] flex items-center justify-center text-white shadow-[0_8px_20px_-4px_rgba(255,90,54,0.35)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_12px_24px_-4px_rgba(255,90,54,0.55)] group-active:scale-95">
                  <CloudUpload className="w-5.5 h-5.5" />
                </div>
                
                <p className="text-xs text-zinc-300 font-medium transition-colors group-hover:text-zinc-100">
                  Click to upload <span className="text-zinc-500 font-normal">or just use drag & drop.</span>
                </p>
                
                {/* Technical Requirements Badges */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#1b1b1b] border border-[#2d2d2d] text-zinc-400">
                    .PDF files
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-[#1b1b1b] border border-[#2d2d2d] text-zinc-400">
                    Max 4MB
                  </span>
                </div>
              </div>
            )}

            {/* Google Drive Active overlay */}
            {externalUrl && (
              <div className="absolute inset-0 bg-[#0c0c0c]/90 backdrop-blur-[2px] flex items-center justify-center z-10 animate-fade-in">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Google Drive Link Active
                </p>
              </div>
            )}
          </div>

          {/* OR Divider with subtle styling */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-zinc-800/60" />
            <span className="flex-shrink mx-3 text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest">OR</span>
            <div className="flex-grow border-t border-zinc-800/60" />
          </div>

          {/* Import from URL Section */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="externalUrl" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Import from URL
            </label>
            <input
              id="externalUrl"
              type="url"
              disabled={!!file}
              value={externalUrl}
              onChange={(e) => {
                setExternalUrl(e.target.value);
                if (e.target.value) {
                  setUploadMode("link");
                } else {
                  setUploadMode("pdf");
                }
              }}
              placeholder="Add file URL to here"
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-800/80 bg-[#141414]/60 text-white placeholder-zinc-650 focus:border-[#ff5a36] focus:ring-1 focus:ring-[#ff5a36]/30 text-xs outline-none transition-all disabled:opacity-40"
              style={{ paddingLeft: '16px', paddingRight: '16px' }}
            />
          </div>

          {/* Optional Preview Image Dropzone for URL uploads */}
          {externalUrl && (
            <div className="flex flex-col gap-2 animate-slide-down">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Cover / Preview Image (Optional)
              </label>
              <div 
                {...getImageRootProps()} 
                className={`rounded-xl border border-dashed p-4 text-center cursor-pointer transition-all duration-300 bg-[#141414]/40
                  ${isImageDragActive 
                    ? "border-[#ff5a36] bg-[#ff5a36]/5" 
                    : coverImage 
                      ? "border-emerald-500 bg-emerald-950/10" 
                      : "border-zinc-850 hover:border-zinc-700"
                  }`}
              >
                <input {...getImageInputProps()} />
                {coverImage ? (
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <p className="font-medium text-xs text-zinc-200 truncate">{coverImage.name}</p>
                    </div>
                    <button type="button" onClick={(e) => { e.stopPropagation(); setCoverImage(null); }} className="text-zinc-500 hover:text-red-400 p-1"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 py-1">
                    <p className="font-semibold text-xs text-zinc-400">Drag or click to add cover image</p>
                    <p className="text-[9px] text-zinc-600">PNG, JPG, WebP • Max 5MB</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expandable/Subtle Metadata fields */}
          <div className="border-t border-zinc-800/40 pt-4 flex flex-col gap-4">
            
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Title *</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  id="title" 
                  type="text" 
                  required 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g., Data Structures Lecture Notes" 
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-800/80 bg-[#141414]/60 text-white placeholder-zinc-600 text-xs outline-none focus:border-[#ff5a36] focus:ring-1 focus:ring-[#ff5a36]/30 transition-all"
                  style={{ paddingLeft: '40px', paddingRight: '12px' }}
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="description" className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Description (optional)</label>
              <textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Briefly describe the contents..." 
                rows={2} 
                className="w-full px-3 py-2 rounded-xl border border-zinc-800/80 bg-[#141414]/60 text-white placeholder-zinc-600 text-xs outline-none resize-none focus:border-[#ff5a36] focus:ring-1 focus:ring-[#ff5a36]/30 transition-all"
                style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px' }}
              />
            </div>

            {/* Subject + Semester */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="subject" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Subject *</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                  <select 
                    id="subject" 
                    required 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-zinc-800/80 bg-[#141414]/60 text-white text-xs outline-none appearance-none focus:border-[#ff5a36] focus:ring-1 focus:ring-[#ff5a36]/30 transition-all"
                    style={{ paddingLeft: '40px', paddingRight: '32px' }}
                  >
                    <option value="" className="bg-[#0a0a0a]">Subject</option>
                    {subjects.map((s) => <option key={s} value={s} className="bg-[#0a0a0a]">{s}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[8px]">
                    ▼
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="semester" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Semester</label>
                <div className="relative">
                  <select 
                    id="semester" 
                    value={semester} 
                    onChange={(e) => setSemester(e.target.value)} 
                    className="w-full px-3 pr-8 py-2.5 rounded-xl border border-zinc-800/80 bg-[#141414]/60 text-white text-xs outline-none appearance-none focus:border-[#ff5a36] focus:ring-1 focus:ring-[#ff5a36]/30 transition-all"
                    style={{ paddingLeft: '12px', paddingRight: '32px' }}
                  >
                    <option value="" className="bg-[#0a0a0a]">Semester</option>
                    {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s} className="bg-[#0a0a0a]">Sem {s}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[8px]">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            {/* University */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="university" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">University (optional)</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-650" />
                <input 
                  id="university" 
                  type="text" 
                  value={university} 
                  onChange={(e) => setUniversity(e.target.value)} 
                  placeholder="e.g., Stanford University" 
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-800/80 bg-[#141414]/60 text-white placeholder-zinc-600 text-xs outline-none focus:border-[#ff5a36] focus:ring-1 focus:ring-[#ff5a36]/30 transition-all"
                  style={{ paddingLeft: '40px', paddingRight: '12px' }}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="tags" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Tags (optional)</label>
              <div className="flex flex-wrap gap-1 mb-1.5">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#ff5a36]/10 text-[#ff5a36] border border-[#ff5a36]/15">
                    {tag}
                    <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                <input 
                  id="tags" 
                  type="text" 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)} 
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }} 
                  placeholder="Type a tag and press Enter" 
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-800/80 bg-[#141414]/60 text-white placeholder-zinc-600 text-xs outline-none focus:border-[#ff5a36] focus:ring-1 focus:ring-[#ff5a36]/30 transition-all"
                  style={{ paddingLeft: '40px', paddingRight: '12px' }}
                />
              </div>
            </div>
          </div>

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="animate-fade-in flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                <span className="text-zinc-550">Uploading notes...</span>
                <span className="text-[#ff5a36]">{uploadProgress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#161616] overflow-hidden border border-zinc-900">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-[#ff5a36] to-[#ff7d66] transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }} 
                />
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800/40">
            <Link 
              href="/" 
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#1a1a1a] text-zinc-350 hover:bg-[#222] hover:text-white transition-all text-center min-w-[80px]"
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              disabled={uploading || (uploadMode === "pdf" && !file) || (uploadMode === "link" && !externalUrl.trim())}
              className="px-6 py-2.5 rounded-xl bg-[#ff5a36] hover:bg-[#ff7254] text-white font-bold text-xs shadow-[0_8px_16px_-4px_rgba(255,90,54,0.3)] transition-all flex items-center justify-center gap-1.5 min-w-[110px] disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0"
              id="upload-submit"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : uploadProgress === 100 ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Success!</span>
                </>
              ) : (
                <>
                  <span>Upload Files</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
