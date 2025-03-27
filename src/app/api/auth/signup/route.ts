import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Try with direct client first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const directClient = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data: directData, error: directError } = await directClient.auth.signUp({
      email,
      password,
    });
    
    if (!directError) {
      return NextResponse.json({ 
        success: true, 
        user: directData.user,
        message: 'Account created successfully. Check your email for confirmation.',
        method: 'direct'
      });
    }
    
    // If direct client fails, try with route handler client
    console.log('Direct client failed, trying route handler client');
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('API signup error:', error);
      return NextResponse.json(
        { 
          error: error.message,
          directError: directError.message,
          details: 'Both authentication methods failed'
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      user: data.user,
      message: 'Account created successfully. Check your email for confirmation.',
      method: 'route-handler'
    });
  } catch (error: any) {
    console.error('Server error during signup:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
} 