'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createCompany(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?error=Please log in to continue')
  }

  const name = (formData.get('name') as string)?.trim()
  const website = (formData.get('website') as string)?.trim()
  const location = (formData.get('location') as string)?.trim()
  const bio = (formData.get('bio') as string)?.trim()

  if (!name || !location || !bio) {
    redirect('/dashboard/employer/company/new?error=Please fill in all required fields.')
  }

  const { error } = await supabase
    .from('companies')
    .insert({
      owner_id: user.id,
      name,
      website: website || null,
      location,
      bio,
    })

  if (error) {
    redirect(`/dashboard/employer/company/new?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/dashboard/employer', 'layout')
  redirect('/dashboard/employer/jobs/new?message=Company created successfully! Now post your first job.')
}