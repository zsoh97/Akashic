import { NextApiRequest } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export async function createContext({ req }: { req: NextApiRequest }) {
  // Get the user's token from the request
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    console.log('No token provided');
    return { user: null };
  }
  
  try {
    // Verify the token with Supabase admin client
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error) {
      console.error('Error verifying token:', error);
      return { user: null };
    }
    
    if (!data.user) {
      console.log('No user found for token');
      return { user: null };
    }
    
    // Return the user data in the context
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email
      }
    };
  } catch (error) {
    console.error('Error verifying token:', error);
    return { user: null };
  }
}