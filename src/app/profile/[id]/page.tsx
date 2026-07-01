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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#d24b28] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 font-sans select-none">
        <div className="text-center p-8 rounded-3xl bg-white border border-black/5 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-4">
            <User className="w-5 h-5 text-zinc-400" />
          </div>
          <h1 className="text-sm font-black uppercase tracking-wider text-black">User not found</h1>
          <Link href="/" className="text-xs font-bold text-[#d24b28] hover:underline mt-2 inline-block">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="site-container py-10 sm:py-16 font-sans select-none">
      
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-white border border-black/5 p-6 sm:p-8 mb-10 shadow-sm animate-fade-in-up">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          
          <div className="w-16 h-16 rounded-2xl bg-[#d24b28] text-white flex items-center justify-center text-xl font-black shadow-sm flex-shrink-0">
            {getInitials(profile.name)}
          </div>
          
          <div className="flex-1">
            <h1 className="text-xl font-black uppercase tracking-tight text-black">{profile.name}</h1>
            {profile.bio && <p className="text-xs font-semibold text-zinc-500 mt-1">{profile.bio}</p>}
            <div className="flex flex-wrap items-center gap-4 mt-3.5 text-xs font-bold uppercase tracking-wide text-zinc-450">
              {profile.university && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-zinc-400" />
                  {profile.university}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-400" />
                Joined {formatDate(profile.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-zinc-400" />
                {profile._count.notes} Notes Shared
              </span>
            </div>
          </div>

          {isOwnProfile && (
            <button 
              onClick={() => signOut({ callbackUrl: "/" })} 
              className="modern-btn-secondary flex items-center gap-2 px-6 py-2.5 text-[10px] uppercase tracking-wider self-stretch sm:self-auto text-center justify-center"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Notes Directory Section */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-zinc-655 mb-4">
          {isOwnProfile ? "Your" : `${profile.name}'s`} Shared Directory
        </h2>
        
        {profile.notes.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-zinc-200 bg-white shadow-sm">
            <BookOpen className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
            <p className="text-xs font-semibold text-zinc-500">
              {isOwnProfile ? "You haven't uploaded any notes yet." : "No notes uploaded to this profile yet."}
            </p>
            {isOwnProfile && (
              <Link 
                href="/upload" 
                className="modern-btn-primary inline-flex items-center gap-2 px-8 py-3 text-xs uppercase tracking-wider mt-4"
              >
                Upload Your First Note
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4 stagger-children">
            {profile.notes.map((note) => (
              <Link 
                key={note.id} 
                href={`/notes/${note.id}`} 
                className="block p-5 bg-white rounded-2xl border border-black/5 shadow-sm hover:border-[#d24b28]/10 hover:shadow-md hover:scale-[1.005] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-[#d24b28]/10 text-[#d24b28] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-black text-black group-hover:text-[#d24b28] transition-colors truncate">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-[9px] font-bold text-zinc-450 uppercase tracking-wider">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#d24b28]/10 text-[#d24b28]">
                        {note.subject}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-zinc-400" />
                        {formatNumber(note.views)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5 text-zinc-400" />
                        {formatNumber(note.downloads)}
                      </span>
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
  );
}
