'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { signup } from '@/app/auth/actions'
import { RoleToggle } from './RoleToggle'

interface SignupPageProps {
  searchParams: Promise<{
    error?: string
  }>
}

export default function SignupPage({ searchParams }: SignupPageProps) {
  const { error } = use(searchParams)
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate')

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <RoleToggle role={role} onRoleChange={setRole} />

        <form className="mt-6 space-y-4" action={signup}>
          <input type="hidden" name="role" value={role} />

          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-slate-700 mb-1">
              {role === 'employer' ? 'Company / Contact Person Name' : 'Full Name'}
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm"
              placeholder={role === 'employer' ? 'Acme Corp / Jane Doe' : 'John Doe'}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition text-sm cursor-pointer mt-2"
          >
            Register as {role === 'employer' ? 'Employer' : 'Candidate'}
          </button>
        </form>
      </div>
    </div>
  )
}