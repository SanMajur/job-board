"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface DesktopMenuProps {
  user: {
    id: string;
    email?: string;
    email_confirmed_at?: string | null;
  } | null;
  role: 'candidate' | 'employer' | null;
}

export default function DesktopMenu({ user, role }: DesktopMenuProps) {
  const router = useRouter();
  const supabase = createClient();

  const handlePostJobClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/login?error=Please log in to your account to post a position&next=/dashboard/employer/jobs/new");
    } else if (!user.email_confirmed_at) {
      router.push("/login?error=Please confirm your email address via your inbox link before posting a job");
    } else {
      router.push("/dashboard/employer/jobs/new");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  };

  return (
    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
      <Link href="/jobs" className="hover:text-blue-600 transition">
        Browse Jobs
      </Link>
      <Link href="/faqs" className="hover:text-blue-600 transition">
        FAQs
      </Link>

      <span className="text-slate-300 h-4 w-[1px] bg-slate-300" aria-hidden="true" />

      {!user ? (
        <>
          <Link href="/login" className="hover:text-blue-600 hover:underline transition">
            Sign In
          </Link>
          <Link href="/signup" className="hover:text-blue-600 hover:underline transition">
            Register
          </Link>
          <button 
            onClick={handlePostJobClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow-sm transition text-sm cursor-pointer"
          >
            Post a Job
          </button>
        </>
      ) : (
        <>
          {role === 'employer' ? (
            <>
              <Link href="/dashboard/employer" className="hover:text-blue-600 font-semibold transition">
                Employer Dashboard
              </Link>
              <button 
                onClick={handlePostJobClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow-sm transition text-sm cursor-pointer"
              >
                + Post a Job
              </button>
            </>
          ) : (
            <Link href="/dashboard/candidate" className="hover:text-blue-600 font-semibold transition">
              My Applications
            </Link>
          )}

          <button 
            onClick={handleSignOut}
            className="text-red-600 hover:text-red-700 font-medium transition cursor-pointer"
          >
            Sign Out
          </button>
        </>
      )}
    </div>
  );
}