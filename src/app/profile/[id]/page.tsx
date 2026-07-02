"use client";

import { useState, useEffect, use } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  User, Building2, FileText, Eye, Download,
  Calendar, LogOut, BookOpen,
} from "lucide-react";
import { formatDate, formatNumber, getInitials } from "@/lib/utils";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  university?: string;
  createdAt: string;
  _count: { notes: number };
  notes: Array<{
    id: string;
    title: string;
    subject: string;
    views: number;
    downloads: number;
    createdAt: string;
  }>;
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = session?.user?.id === id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/users/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-zinc-950 px-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" aria-label="Loading profile..." role="status" />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-zinc-950 px-4">
        <section aria-label="Profile not found" className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-md">
          <User className="mx-auto mb-3 h-8 w-8 text-zinc-600" aria-hidden="true" />
          <h1 className="mb-2 text-sm font-bold text-zinc-50">User not found</h1>
          <Link 
            href="/" 
            className="inline-block text-xs text-purple-400 hover:underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950 rounded"
          >
            Go Home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-zinc-50 selection:bg-purple-500/30">
      
      {/* Decorative ambient glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-1/2 top-[-10%] -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-purple-600/20 blur-[100px]" 
      />

      <main className="relative z-10 mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Profile Card */}
        <header className="mb-8 animate-in slide-in-from-bottom-4 duration-500 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            
            {/* Avatar */}
            <div 
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold text-white shadow-md"
              aria-hidden="true"
            >
              {getInitials(profile.name)}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-extrabold leading-tight text-zinc-50">{profile.name}</h1>
              {profile.bio && <p className="mt-1 text-xs leading-relaxed text-zinc-400 sm:text-sm">{profile.bio}</p>}
              
              <ul aria-label="Profile Details" className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-zinc-500">
                {profile.university && (
                  <li className="flex items-center gap-1.5 font-medium"><Building2 className="h-3.5 w-3.5" aria-hidden="true" />{profile.university}</li>
                )}
                <li className="flex items-center gap-1.5 font-medium"><Calendar className="h-3.5 w-3.5" aria-hidden="true" />Joined {formatDate(profile.createdAt)}</li>
                <li className="flex items-center gap-1.5 font-medium"><FileText className="h-3.5 w-3.5" aria-hidden="true" />{profile._count.notes} shared notes</li>
              </ul>
            </div>

            {isOwnProfile && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex items-center justify-center gap-2 self-stretch sm:self-auto rounded-full border border-white/10 bg-transparent px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition-colors hover:bg-white/5 hover:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-950"
              >
                <LogOut className="h-4 w-4 text-purple-400" aria-hidden="true" /> Sign Out
              </button>
            )}
          </div>
        </header>

        {/* User Notes Directory */}
        <section aria-labelledby="directory-heading" className="animate-in slide-in-from-bottom-6 duration-500 delay-100">
          <header className="mb-5 flex items-center justify-between">
            <h2 id="directory-heading" className="text-sm font-bold uppercase tracking-wider text-zinc-400">
              {isOwnProfile ? "Your" : `${profile.name}'s`} Shared Directory
            </h2>
          </header>

          {profile.notes.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] py-16 text-center backdrop-blur-md">
              <BookOpen className="mx-auto mb-3 h-8 w-8 text-zinc-600" aria-hidden="true" />
              <p className="text-xs text-zinc-500">
                {isOwnProfile ? "You haven't shared any notes yet." : "No notes uploaded to this profile yet."}
              </p>
              {isOwnProfile && (
                <Link 
                  href="/upload" 
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                >
                  Upload First Note
                </Link>
              )}
            </div>
          ) : (
            <ul className="space-y-4">
              {profile.notes.map((note) => (
                <li key={note.id}>
                  <Link
                    href={`/notes/${note.id}`}
                    className="group block rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-purple-500/20 hover:bg-white/[0.04] hover:shadow-[0_4px_20px_rgba(168,85,247,0.1)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950 backdrop-blur-md"
                  >
                    <article className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400" aria-hidden="true">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-extrabold text-zinc-50 transition-colors group-hover:text-purple-400">
                          {note.title}
                        </h3>
                        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-zinc-500">
                          <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 font-bold text-purple-400">
                            {note.subject}
                          </span>
                          <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" aria-hidden="true" /><span className="sr-only">Views: </span>{formatNumber(note.views)}</span>
                          <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" aria-hidden="true" /><span className="sr-only">Downloads: </span>{formatNumber(note.downloads)}</span>
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
