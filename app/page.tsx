import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('job_categories').select('*')

  console.log('data:', data)
  console.log('error:', error)

  return <div>Check your terminal</div>
}