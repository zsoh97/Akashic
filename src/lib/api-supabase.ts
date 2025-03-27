import { createServerClient, serializeCookieHeader } from "@supabase/ssr"
import { NextApiRequest, NextApiResponse } from "next"

// api client with service role key for backend operations 
export default function createClient(req: NextApiRequest, res: NextApiResponse) {
	const supabase = createServerClient(
	  process.env.NEXT_PUBLIC_SUPABASE_URL!,
	  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
	  {
		cookies: {
		  getAll() {
			return Object.keys(req.cookies).map((name) => ({ name, value: req.cookies[name] ?? '' }))
		  },
		  setAll(cookiesToSet) {
			res.setHeader(
			  'Set-Cookie',
			  cookiesToSet.map(({ name, value, options }) =>
				serializeCookieHeader(name, value, options)
			  )
			)
		  },
		},
	  }
	)
  
	return supabase
  }
