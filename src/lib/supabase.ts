import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.NEXY_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!

// Regular client for browser usage
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})