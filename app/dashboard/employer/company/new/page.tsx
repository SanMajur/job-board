import { createCompany } from '@/app/actions/company'

interface PageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function NewCompanyPage({ searchParams }: PageProps) {
  const { error } = await searchParams

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Company Profile</h1>
          <p className="text-sm text-slate-600 mt-1">
            Set up your organization's public details before posting job vacancies.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <form action={createCompany} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company Name *
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Nile Tech Solutions"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Headquarters / Primary Location *
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
              Website URL (Optional)
            </label>
            <input
              name="website"
              type="url"
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Company Overview *
            </label>
            <textarea
              name="bio"
              required
              rows={4}
              placeholder="Describe your company's mission, industry, and work culture..."
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition text-sm cursor-pointer"
          >
            Save Profile & Continue
          </button>
        </form>
      </div>
    </div>
  )
}