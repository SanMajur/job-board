import { createClient } from '@/utils/supabase/server';
import NavbarWrapper from './NavbarWrapper';


export default async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role: 'candidate' | 'employer' | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile) {
      role = profile.role as 'candidate' | 'employer';
    }
  }

  const sanitizedUser = user
    ? {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
      }
    : null;

  return <NavbarWrapper user={sanitizedUser} role={role} />;
}