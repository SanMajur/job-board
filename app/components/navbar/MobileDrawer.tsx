"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    email?: string;
    email_confirmed_at?: string | null;
  } | null;
  role: 'candidate' | 'employer' | null;
}

export default function MobileDrawer({ isOpen, onClose, user, role }: MobileDrawerProps) {
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePostJobClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();

    if (!user) {
      router.push("/login?error=Please log in to your account to post a position&next=/dashboard/employer/jobs/new");
    } else if (!user.email_confirmed_at) {
      router.push("/login?error=Please confirm your email address via your inbox link before posting a job");
    } else {
      router.push("/dashboard/employer/jobs/new");
    }
  };

  const handleSignOut = async () => {
    onClose();
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  };

  const showOverlay = mounted && isOpen;

  return (
    <>
      {/* FADED BACKGROUND OVERLAY */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden z-40 ${
          showOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* SIDE DRAWER */}
      <div 
        className={`fixed top-0 right-0 h-full w-[65%] sm:w-[50%] bg-white shadow-2xl p-6 pt-24 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:hidden z-40 ${
          showOverlay ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col space-y-6">
          <Link 
            href="/jobs" 
            onClick={onClose}
            className="text-slate-700 font-semibold text-lg hover:text-blue-600 transition"
          >
            Browse Jobs
          </Link>
          <Link 
            href="/faqs" 
            onClick={onClose}
            className="text-slate-700 font-semibold text-lg hover:text-blue-600 transition"
          >
            FAQs
          </Link>

          {!user ? (
            <>
              <Link 
                href="/login" 
                onClick={onClose}
                className="text-slate-700 font-semibold text-lg hover:text-blue-600 transition"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                onClick={onClose}
                className="text-slate-700 font-semibold text-lg hover:text-blue-600 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {role === 'employer' ? (
                <Link 
                  href="/dashboard/employer" 
                  onClick={onClose}
                  className="text-blue-600 font-bold text-lg hover:underline transition"
                >
                  Employer Dashboard
                </Link>
              ) : (
                <Link 
                  href="/dashboard/candidate" 
                  onClick={onClose}
                  className="text-blue-600 font-bold text-lg hover:underline transition"
                >
                  My Applications
                </Link>
              )}
              <button 
                onClick={handleSignOut}
                className="text-left text-red-600 font-semibold text-lg hover:underline transition cursor-pointer"
              >
                Sign Out
              </button>
            </>
          )}
        </div>

        <div className="border-t border-slate-100 pt-6">
          <button 
            onClick={handlePostJobClick}
            className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold text-base shadow-md transition cursor-pointer"
          >
            Post a Job
          </button>
        </div>
      </div>
    </>
  );
}