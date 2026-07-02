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
      <main className="flex min-h-[60vh] items-center justify-center bg-zinc-950 px-4">
        <section aria-label="Sign in required" className="w-full max-w-xs animate-in zoom-in-95 duration-300 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-md">
          <Upload className="mx-auto mb-3 h-8 w-8 text-zinc-500" aria-hidden="true" />
          <h1 className="mb-1 text-lg font-bold text-zinc-50">Sign in to Upload</h1>
          <p className="mb-5 text-xs text-zinc-400">You need to be signed in to upload notes.</p>
          <Link 
            href="/login" 
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Sign In
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-950 p-4 sm:p-8 text-zinc-50 selection:bg-purple-500/30">
      
      {/* Decorative ambient glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-1/2 top-[-10%] -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-purple-600/20 blur-[100px]" 
      />

      <main className="relative z-10 w-full max-w-md">
        <article className="animate-in slide-in-from-bottom-4 duration-500 w-full overflow-y-auto rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-2xl backdrop-blur-md sm:p-8" style={{ maxHeight: '92vh' }}>

          {/* Header */}
          <header className="mb-6 text-center">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
              Share Work
            </span>
            <h1 className="text-2xl font-extrabold text-zinc-50">Upload Notes</h1>
            <p className="mt-1 text-xs text-zinc-400">Publish your resources instantly for download</p>
          </header>

          {error && (
            <div role="alert" className="mb-5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400 animate-in fade-in duration-300">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Drag Drop Area */}
            <div
              {...getPdfRootProps()}
              className={`group relative overflow-hidden rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                isPdfDragActive ? "border-purple-500 bg-purple-500/5"
                : file ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-white/10 bg-white/[0.01] hover:border-white/20"
              }`}
              aria-label="Upload PDF document"
            >
              <input {...getPdfInputProps()} disabled={!!externalUrl} aria-label="PDF File Upload" />

              {file ? (
                <div className="flex flex-col items-center gap-2 animate-in zoom-in-95 duration-200">
                  <FileText className="h-8 w-8 text-emerald-400" aria-hidden="true" />
                  <p className="max-w-[240px] truncate text-xs font-semibold text-zinc-50">{file.name}</p>
                  <p className="text-[10px] text-zinc-400">{formatFileSize(file.size)}</p>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }} 
                    className="mt-1 flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" /> Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-400 transition-transform group-hover:scale-105" aria-hidden="true">
                    <CloudUpload className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-zinc-300">
                    Click to browse <span className="text-zinc-500">or drop PDF here</span>
                  </p>
                  <div className="mt-0.5 flex gap-1.5">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] text-zinc-400">.PDF</span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] text-zinc-400">MAX 4MB</span>
                  </div>
                </div>
              )}

              {externalUrl && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/95 backdrop-blur-sm animate-in fade-in duration-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">URL active — PDF disabled</p>
                </div>
              )}
            </div>

            {/* OR separator */}
            <div className="flex items-center gap-3 py-1" aria-hidden="true">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[9px] font-bold tracking-wider text-zinc-500 uppercase">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* External URL */}
            <div>
              <label htmlFor="externalUrl" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Import from URL</label>
              <input
                id="externalUrl" 
                type="url" 
                disabled={!!file}
                value={externalUrl}
                onChange={(e) => { setExternalUrl(e.target.value); setUploadMode(e.target.value ? "link" : "pdf"); }}
                placeholder="Google Drive, Dropbox, or external document link"
                className="w-full rounded-full border border-white/10 bg-zinc-900/50 px-4 py-3 text-xs text-zinc-50 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-30 disabled:cursor-not-allowed"
              />
            </div>

            {/* Cover image for links */}
            {externalUrl && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Thumbnail Cover (Optional)</label>
                <div
                  {...getImageRootProps()}
                  className={`rounded-xl border border-dashed p-3.5 text-center cursor-pointer transition-all text-xs ${
                    isImageDragActive ? "border-purple-500 bg-purple-500/5"
                    : coverImage ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-white/10 bg-white/[0.01] hover:border-white/20"
                  }`}
                  aria-label="Upload thumbnail cover image"
                >
                  <input {...getImageInputProps()} aria-label="Cover Image Upload" />
                  {coverImage ? (
                    <div className="flex items-center justify-between">
                      <span className="max-w-[200px] truncate text-xs text-zinc-300">{coverImage.name}</span>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); setCoverImage(null); }} 
                        className="rounded p-1 text-zinc-500 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        aria-label="Remove cover image"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-zinc-500">Drag or click to choose cover thumbnail</p>
                  )}
                </div>
              </div>
            )}

            {/* Text fields */}
            <div className="mt-2 flex flex-col gap-3.5 border-t border-white/5 pt-4">
              <div>
                <label htmlFor="title" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Title <span aria-hidden="true" className="text-red-400">*</span></label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden="true" />
                  <input 
                    id="title" 
                    type="text" 
                    required 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Algorithms & Complexity Midterm Guide" 
                    className="w-full rounded-full border border-white/10 bg-zinc-900/50 py-3 pl-11 pr-4 text-xs text-zinc-50 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Description</label>
                <textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of contents, exam date, course details..." 
                  rows={2}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-zinc-900/50 py-2.5 px-4 text-xs text-zinc-50 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="subject" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Subject <span aria-hidden="true" className="text-red-400">*</span></label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden="true" />
                    <select 
                      id="subject" 
                      required 
                      value={subject} 
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full appearance-none rounded-full border border-white/10 bg-zinc-900/50 py-3 pl-11 pr-8 text-xs text-zinc-50 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="">Choose</option>
                      {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="semester" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Semester</label>
                  <select 
                    id="semester" 
                    value={semester} 
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full appearance-none rounded-full border border-white/10 bg-zinc-900/50 py-3 px-4 text-xs text-zinc-50 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Choose</option>
                    {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="university" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">University</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden="true" />
                  <input 
                    id="university" 
                    type="text" 
                    value={university} 
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. Massachusetts Institute of Technology" 
                    className="w-full rounded-full border border-white/10 bg-zinc-900/50 py-3 pl-11 pr-4 text-xs text-zinc-50 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500" 
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tags" className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-zinc-400">Tags</label>
                {tags.length > 0 && (
                  <ul className="mb-2 flex flex-wrap gap-1" aria-label="Added tags">
                    {tags.map((tag) => (
                      <li key={tag}>
                        <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-400">
                          {tag}
                          <button 
                            type="button" 
                            onClick={() => setTags(tags.filter((t) => t !== tag))} 
                            className="rounded p-0.5 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                            aria-label={`Remove tag ${tag}`}
                          >
                            <X className="h-3 w-3" aria-hidden="true" />
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden="true" />
                  <input 
                    id="tags" 
                    type="text" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                    placeholder="Add tags (press Enter)" 
                    className="w-full rounded-full border border-white/10 bg-zinc-900/50 py-3 pl-11 pr-4 text-xs text-zinc-50 outline-none transition-colors focus:border-purple-500 focus:ring-1 focus:ring-purple-500" 
                  />
                </div>
              </div>
            </div>

            {/* Progress bar */}
            {uploading && (
              <div className="mt-1 animate-in fade-in duration-300" aria-live="polite">
                <div className="mb-1 flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  <span>Uploading files...</span>
                  <span className="text-purple-400">{uploadProgress}%</span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }} 
                    role="progressbar" 
                    aria-valuenow={uploadProgress} 
                    aria-valuemin={0} 
                    aria-valuemax={100} 
                  />
                </div>
              </div>
            )}

            {/* Submit controls */}
            <footer className="mt-2 flex items-center justify-end gap-3 border-t border-white/5 pt-4">
              <Link 
                href="/" 
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:bg-white/5 hover:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-900"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={uploading || (uploadMode === "pdf" && !file) || (uploadMode === "link" && !externalUrl.trim())}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-7 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-transform disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:scale-105 hover:enabled:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                id="upload-submit"
              >
                {uploading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" /> Uploading...</>
                ) : uploadProgress === 100 ? (
                  <><Check className="mr-2 h-4 w-4 text-white" aria-hidden="true" /> Done</>
                ) : (
                  "Upload"
                )}
              </button>
            </footer>
          </form>
        </article>
      </main>
    </div>
  );
}
