import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAuthWorkspace } from '@/lib/auth/onboarding';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in searchParams, use it, else default to /dashboard
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && session?.user) {
      // Re-use onboarding logic to determine if they need setup
      const { requiresOnboarding } = await getAuthWorkspace(supabase, session.user.id);
      
      const targetPath = requiresOnboarding ? '/onboarding' : next;
      return NextResponse.redirect(`${origin}${targetPath}`);
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/login?error=OAuthFailed`);
}
