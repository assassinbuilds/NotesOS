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
      <div className="min-h-[60vh] flex items-center justify-center bg-[#08080c]">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 bg-[#08080c]">
        <div className="text-center glass-card p-8">
          <User className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <h1 className="text-sm font-bold text-white">User not found</h1>
          <Link href="/" className="text-xs text-purple-400 hover:underline mt-2 inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[#08080c] min-h-screen text-white select-none">
      
      {/* Ambient Glow */}
      <div className="hero-glow" />

      <div className="site-container py-12 relative z-10">

        {/* Profile Card */}
        <div className="glass-card p-6 sm:p-8 mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            
            {/* Avatar matching header/screenshot logo */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              {getInitials(profile.name)}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-extrabold text-white leading-tight">{profile.name}</h1>
              {profile.bio && <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">{profile.bio}</p>}
              
              <div className="flex flex-wrap items-center gap-4 mt-4 text-[11px] text-zinc-500">
                {profile.university && (
                  <span className="flex items-center gap-1.5 font-medium"><Building2 className="w-3.5 h-3.5" />{profile.university}</span>
                )}
                <span className="flex items-center gap-1.5 font-medium"><Calendar className="w-3.5 h-3.5" />Joined {formatDate(profile.createdAt)}</span>
                <span className="flex items-center gap-1.5 font-medium"><FileText className="w-3.5 h-3.5" />{profile._count.notes} shared notes</span>
              </div>
            </div>

            {isOwnProfile && (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn-secondary px-6 py-2.5 text-xs font-bold uppercase tracking-wider self-stretch sm:self-auto"
              >
                <LogOut className="w-4 h-4 text-purple-400" /> Sign Out
              </button>
            )}
          </div>
        </div>

        {/* User Notes Shared Directory */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
              {isOwnProfile ? "Your" : `${profile.name}'s`} Shared Directory
            </h2>
          </div>

          {profile.notes.length === 0 ? (
            <div className="text-center py-16 glass-card">
              <BookOpen className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-xs text-zinc-500">
                {isOwnProfile ? "You haven't shared any notes yet." : "No notes uploaded to this profile yet."}
              </p>
              {isOwnProfile && (
                <Link href="/upload" className="btn-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider mt-4 inline-flex">
                  Upload First Note
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4 stagger-children">
              {profile.notes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="block glass-card p-5 hover:border-purple-500/20 hover:shadow-[0_4px_20px_rgba(168,85,247,0.05)] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-extrabold text-white group-hover:text-purple-400 transition-colors truncate">
                        {note.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5 text-[11px] text-zinc-500">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold">
                          {note.subject}
                        </span>
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatNumber(note.views)}</span>
                        <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{formatNumber(note.downloads)}</span>
                        <span>{formatDate(note.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
