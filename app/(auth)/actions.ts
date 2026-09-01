'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type AuthFormState = {
  error: string | null
}

const initialState: AuthFormState = { error: null }

function validateSignUp(formData: FormData): AuthFormState | null {
  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!fullName || !email || !password) {
    return { error: 'Please fill in every field.' }
  }
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }
  return null
}

export async function signUpJobSeeker(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validationError = validateSignUp(formData)
  if (validationError) return validationError

  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: 'job_seeker' },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  })

  if (error) return { error: error.message }

  redirect('/signup/check-email')
}

export async function signUpEmployer(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validationError = validateSignUp(formData)
  if (validationError) return validationError

  const fullName = formData.get('fullName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: 'employer' },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  })

  if (error) return { error: error.message }

  redirect('/signup/check-email')
}

export async function signIn(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Please enter your email and password.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Incorrect email or password.' }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profile?.role === 'employer') {
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('owner_id', data.user.id)
      .maybeSingle()

    redirect(company ? '/dashboard/employer' : '/dashboard/employer/company/new')
  }

  redirect('/dashboard/jobseeker')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export { initialState }