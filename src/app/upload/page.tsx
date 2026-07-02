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
      <div className="min-h-[60vh] flex items-center justify-center px-4 bg-[#08080c]">
        <div className="text-center glass-card p-8 max-w-xs animate-fade-in">
          <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
          <h1 className="text-lg font-bold text-white mb-1">Sign in to Upload</h1>
          <p className="text-xs text-zinc-500 mb-5">You need to be signed in to upload notes.</p>
          <Link href="/login" className="btn-primary px-5 py-2.5 text-sm rounded-full">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[#08080c] min-h-screen text-white select-none">
      
      {/* Ambient glow */}
      <div className="hero-glow" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md glass-card p-6 sm:p-8 animate-scale-in" style={{ maxHeight: '92vh', overflowY: 'auto' }}>

          {/* Header */}
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1 mb-2">
              Share Work
            </span>
            <h1 className="text-2xl font-extrabold text-white">Upload Notes</h1>
            <p className="mt-1 text-xs text-zinc-500">Publish your resources instantly for download</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl mb-5 animate-scale-in">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Drag Drop Area */}
            <div
              {...getPdfRootProps()}
              className={`group rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all relative overflow-hidden ${
                isPdfDragActive ? "border-purple-500 bg-purple-500/5"
                : file ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-white/[0.06] hover:border-white/[0.12] bg-white/[0.01]"
              }`}
            >
              <input {...getPdfInputProps()} disabled={!!externalUrl} />

              {file ? (
                <div className="flex flex-col items-center gap-2 animate-scale-in">
                  <FileText className="w-8 h-8 text-emerald-400" />
                  <p className="text-xs font-semibold text-white truncate max-w-[240px]">{file.name}</p>
                  <p className="text-[10px] text-zinc-500">{formatFileSize(file.size)}</p>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 mt-1 font-bold">
                    <X className="w-3.5 h-3.5" /> Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                    <CloudUpload className="w-5 h-5" />
                  </div>
                  <p className="text-xs text-zinc-300">
                    Click to browse <span className="text-zinc-500">or drop PDF here</span>
                  </p>
                  <div className="flex gap-1.5 mt-0.5">
                    <span className="text-[9px] text-zinc-500 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">.PDF</span>
                    <span className="text-[9px] text-zinc-500 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">MAX 4MB</span>
                  </div>
                </div>
              )}

              {externalUrl && (
                <div className="absolute inset-0 bg-[#08080c]/95 flex items-center justify-center z-10 animate-fade-in">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">URL active — PDF disabled</p>
                </div>
              )}
            </div>

            {/* OR line */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-white/[0.04]" />
              <span className="text-[9px] text-zinc-500 font-bold tracking-wider">OR</span>
              <div className="flex-1 h-px bg-white/[0.04]" />
            </div>

            {/* External URL */}
            <div>
              <label htmlFor="externalUrl" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Import from URL</label>
              <input
                id="externalUrl" type="url" disabled={!!file}
                value={externalUrl}
                onChange={(e) => { setExternalUrl(e.target.value); setUploadMode(e.target.value ? "link" : "pdf"); }}
                placeholder="Google Drive, Dropbox, or external document link"
                className="input py-3 text-xs disabled:opacity-30"
              />
            </div>

            {/* Cover image for links */}
            {externalUrl && (
              <div className="animate-slide-down">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Thumbnail Cover (Optional)</label>
                <div
                  {...getImageRootProps()}
                  className={`rounded-xl border border-dashed p-3.5 text-center cursor-pointer transition-all text-xs ${
                    isImageDragActive ? "border-purple-500 bg-purple-500/5"
                    : coverImage ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-white/[0.06] hover:border-white/[0.12] bg-white/[0.01]"
                  }`}
                >
                  <input {...getImageInputProps()} />
                  {coverImage ? (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-300 truncate max-w-[200px]">{coverImage.name}</span>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setCoverImage(null); }} className="text-zinc-500 hover:text-red-400 p-0.5"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <p className="text-zinc-500">Drag or click to choose cover thumbnail</p>
                  )}
                </div>
              </div>
            )}

            {/* Text fields */}
            <div className="border-t border-white/[0.04] pt-4 flex flex-col gap-3.5">
              <div>
                <label htmlFor="title" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Title *</label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Algorithms & Complexity Midterm Guide" className="input pl-11 py-3 text-xs" />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of contents, exam date, course details..." rows={2}
                  className="input py-2.5 text-xs resize-none" style={{ borderRadius: '12px' }} />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="subject" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Subject *</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <select id="subject" required value={subject} onChange={(e) => setSubject(e.target.value)}
                      className="input pl-11 pr-8 py-3 text-xs appearance-none">
                      <option value="">Choose</option>
                      {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="semester" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Semester</label>
                  <select id="semester" value={semester} onChange={(e) => setSemester(e.target.value)}
                    className="input py-3 text-xs appearance-none">
                    <option value="">Choose</option>
                    {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="university" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">University</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input id="university" type="text" value={university} onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. Massachusetts Institute of Technology" className="input pl-11 py-3 text-xs" />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Tags</label>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 border border-purple-500/20 text-purple-400">
                        {tag}
                        <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-red-400 p-0.5"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input id="tags" type="text" value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                    placeholder="Add tags (press Enter)" className="input pl-11 py-3 text-xs" />
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {uploading && (
              <div className="animate-fade-in mt-1">
                <div className="flex justify-between text-[10px] text-zinc-500 mb-1 font-bold uppercase tracking-wider">
                  <span>Uploading files...</span>
                  <span className="text-purple-400">{uploadProgress}%</span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {/* Submit controls */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.04] mt-2">
              <Link href="/" className="btn-secondary px-6 py-2.5 text-xs uppercase tracking-wider font-bold">Cancel</Link>
              <button
                type="submit"
                disabled={uploading || (uploadMode === "pdf" && !file) || (uploadMode === "link" && !externalUrl.trim())}
                className="btn-primary px-7 py-3 text-xs uppercase tracking-wider font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                id="upload-submit"
              >
                {uploading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                ) : uploadProgress === 100 ? (
                  <><Check className="w-4 h-4 text-white" /> Done</>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
