import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    await supabase.auth.exchangeCodeForSession(code)
    
    // Redirect to dashboard after successful authentication
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
  }

  // If no code, redirect to auth page
  return NextResponse.redirect(new URL('/auth', requestUrl.origin))
}