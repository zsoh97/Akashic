import { prisma } from '@/lib/prisma';
import { SupabaseClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import createClient from '@/lib/api-supabase';
import _ from 'lodash';

export type GraphQLContext = {
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  supabase:  SupabaseClient<any, "public", any>;
  prisma: typeof prisma;
};

export async function createContext({ req, res }: {req: NextApiRequest, res: NextApiResponse}): Promise<GraphQLContext> {
  const adminSupabase = createClient(req, res)
  try {
    // Extract the authorization header
    const authHeader = req.headers?.get('authorization');
    
    // Get session from Supabase
    let session;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // Extract the token from the Authorization header
      const token = authHeader.substring(7);
      
      // Use the token to get the user
      const { data, error } = await adminSupabase.auth.getUser(token);
      if (error) {
        console.error('Error getting user from token:', error);
      } else {
        return {
          user: {
            id: data.user.id as string,
            email: data.user.email as string,
            name: data.user.email as string,
          },
          supabase: adminSupabase,
          prisma
        };
      }
    }

    return { 
      user: null,
      supabase: adminSupabase,
      prisma
    };
  } catch (error) {
    console.error('Error in GraphQL context:', error);
    return { 
      user: null,
      supabase: adminSupabase,
      prisma
    };
  }
}