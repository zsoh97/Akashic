import { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { supabase } from '@/lib/supabase';

const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
    }
  }
`;

export default function AuthStatus() {
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const { data, loading, error } = useQuery(ME_QUERY);

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setSupabaseUser(data.session?.user || null);
      setToken(data.session?.access_token || null);
    }
    
    getSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSupabaseUser(session?.user || null);
        setToken(session?.access_token ?? null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h2 className="text-lg font-bold mb-2">Authentication Status</h2>
      
      <div className="mb-2">
        <h3 className="font-semibold">Supabase Auth:</h3>
        {supabaseUser ? (
          <div className="text-green-600">
            ✅ Logged in as {supabaseUser.email}
          </div>
        ) : (
          <div className="text-red-600">❌ Not logged in</div>
        )}
      </div>
      
      <div className="mb-2">
        <h3 className="font-semibold">GraphQL Auth:</h3>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">
            ❌ Error: {error.message}
          </div>
        ) : data?.me ? (
          <div className="text-green-600">
            ✅ GraphQL authenticated as {data.me.email}
          </div>
        ) : (
          <div className="text-red-600">
            ❌ Not authenticated with GraphQL
          </div>
        )}
      </div>
      
      {token && (
        <div className="mb-2">
          <h3 className="font-semibold">Auth Token:</h3>
          <div className="text-xs overflow-hidden text-ellipsis">
            {token.substring(0, 20)}...
          </div>
        </div>
      )}
    </div>
  );
} 