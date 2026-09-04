"use client";

import { useState } from 'react';
import Link from 'next/link';
import DesktopMenu from './DesktopMenu';
import MobileDrawer from './MobileDrawer';

interface NavbarWrapperProps {
  user: {
    id: string;
    email?: string;
    email_confirmed_at?: string | null;
  } | null;
  role: 'candidate' | 'employer' | null;
}

export default function NavbarWrapper({ user, role }: NavbarWrapperProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            MyJobs<span className="text-blue-600">SouthSudan</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <DesktopMenu user={user} role={role} />

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-blue-600 focus:outline-none z-50"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            {isDrawerOpen ? (
              <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z" />
            ) : (
              <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" />
            )}
          </svg>
        </button>

        {/* MOBILE DRAWER */}
        <MobileDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          user={user}
          role={role}
        />
      </div>
    </header>
  );
}