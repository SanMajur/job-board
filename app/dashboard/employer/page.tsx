import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

interface PageProps {
  searchParams: Promise<{ message?: string }>
}

export default async function EmployerDashboardPage({ searchParams }: PageProps) {
  const { message } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?error=Please sign in to view your dashboard')
  }

  // Fetch company details
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  // Fetch company jobs if company exists
  const { data: jobs } = company
    ? await supabase.from('jobs').select('*').eq('company_id', company.id).order('created_at', { ascending: false })
    : { data: [] }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
          {message}
        </div>
      )}

      {!company ? (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center space-y-4">
          <h2 className="text-lg font-bold text-amber-900">Company Profile Required</h2>
          <p className="text-sm text-amber-700 max-w-xl mx-auto">
            You haven't set up a company profile yet. Create your company profile first to unlock job posting capabilities.
          </p>
          <Link
            href="/dashboard/employer/company/new"
            className="inline-block px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-xl text-sm hover:bg-amber-700 transition"
          >
            Create Company Profile
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{company.name}</h1>
              <p className="text-sm text-slate-500">{company.location}</p>
            </div>
            <Link
              href="/dashboard/employer/jobs/new"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition"
            >
              + Post New Job
            </Link>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Posted Vacancies ({jobs?.length || 0})</h2>
            {jobs && jobs.length > 0 ? (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                      <div className="flex gap-3 text-xs text-slate-500 mt-1">
                        <span>{job.category}</span>
                        <span>•</span>
                        <span>{job.job_type}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {job.status === 'active' ? 'Active' : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                No active job postings found. Click "+ Post New Job" to list your first vacancy.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}