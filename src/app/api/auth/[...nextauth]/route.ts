// import { NextAuthOptions } from 'next-auth'
// import NextAuth from 'next-auth/next'
// import { SupabaseAdapter } from '@auth/supabase-adapter'
// import GoogleProvider from 'next-auth/providers/google'

// export const authOptions: NextAuthOptions = {
// 	providers: [
// 		GoogleProvider({
// 			clientId: process.env.GOOGLE_CLIENT_ID!,
// 			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
// 		}),
// 	],
// 	adapter: SupabaseAdapter({
// 		url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
// 		secret: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
// 	}),
// 	pages: {
// 		signIn: '/auth/signin',
// 	},
// 	session: {
// 		strategy: 'jwt',  // Use JWT for faster auth
// 	},
// }

// const handler = NextAuth(authOptions)
// export { handler as GET, handler as POST }
