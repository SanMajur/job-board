import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createJob } from '@/app/actions/jobs'

interface PageProps {
    searchParams: Promise<{ error?: string; message?: string }>
}

export default async function NewJobPage({ searchParams }: PageProps) {
    const { error, message } = await searchParams
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?error=Please log in to continue')
    }

    // Verify company exists prior to rendering job form
    const { data: company } = await supabase
        .from('companies')
        .select('id, name')
        .eq('owner_id', user.id)
        .single()

    if (!company) {
        redirect('/dashboard/employer/company/new?error=Please create a company profile first before posting a job.')
    }

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                        Posting for {company.name}
                    </span>
                    <h1 className="text-2xl font-bold text-slate-900 mt-2">Post a New Job Opening</h1>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                        {message}
                    </div>
                )}

                <form action={createJob} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Job Title *
                        </label>
                        <input
                            name="title"
                            type="text"
                            required
                            placeholder="e.g. Senior Full-Stack Engineer"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Category *
                            </label>
                            <select
                                name="category"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                            >
                                <option value="">Select Category</option>
                                <option value="Software Development">Software Development</option>
                                <option value="IT & Networking">IT & Networking</option>
                                <option value="Design & Creative">Design & Creative</option>
                                <option value="Project Management">Project Management</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Job Type *
                            </label>
                            <select
                                name="job_type"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm bg-white"
                            >
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="contract">Contract</option>
                                <option value="remote">Remote</option>
                                <option value="internship">Internship</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Location *
                            </label>
                            <input
                                name="location"
                                type="text"
                                required
                                placeholder="e.g. Juba, Central Equatoria"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Min Salary ($)
                            </label>
                            <input
                                name="salary_min"
                                type="number"
                                placeholder="1200"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Max Salary ($)
                            </label>
                            <input
                                name="salary_max"
                                type="number"
                                placeholder="1800"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Required Skills (Comma separated)
                        </label>
                        <input
                            name="skills"
                            type="text"
                            placeholder="e.g. React, Next.js, TypeScript, Supabase"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Job Description *
                        </label>
                        <textarea
                            name="description"
                            required
                            rows={6}
                            placeholder="Provide a detailed description of duties and qualifications..."
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition text-sm cursor-pointer"
                    >
                        Publish Job Listing
                    </button>
                </form>
            </div>
        </div>
    )
}