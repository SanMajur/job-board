'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createJob(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?error=Please log in to post a job')
    }

    // Fetch employer's company using owner_id
    const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user.id)
        .single()

    if (companyError || !company) {
        redirect('/dashboard/employer/company/new?error=You must register a company profile before posting a job.')
    }

    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const job_type = (formData.get('job_type') as string)?.toLowerCase().trim()
    const location = formData.get('location') as string
    const salary_min = formData.get('salary_min') ? Number(formData.get('salary_min')) : null
    const salary_max = formData.get('salary_max') ? Number(formData.get('salary_max')) : null
    const description = formData.get('description') as string

    // Parse comma-separated skills input into string array
    const rawSkills = formData.get('skills') as string
    const skills = rawSkills
        ? rawSkills.split(',').map((s) => s.trim()).filter(Boolean)
        : []

    if (!title || !category || !job_type || !location || !description) {
        redirect('/dashboard/employer/jobs/new?error=Please complete all required fields.')
    }

    const { error } = await supabase.from('jobs').insert({
        company_id: company.id,
        employer_id: user.id, // Matches your employer_id column
        title,
        category,
        job_type,
        location,
        salary_min,
        salary_max,
        skills,
        description,
        status: 'active', // Matches your status column
    })

    if (error) {
        redirect(`/dashboard/employer/jobs/new?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard/employer?message=Job posted successfully!')
}