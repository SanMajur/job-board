import Link from 'next/link'

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const { email } = await searchParams

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-900">Check your email</h2>
        <p className="text-sm text-slate-600">
          We sent a verification link to{' '}
          <span className="font-semibold text-slate-900">{email || 'your email address'}</span>.
          Please click the link inside to confirm your account.
        </p>

        <div className="pt-4 border-t border-slate-100">
          <Link
            href="/login"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}