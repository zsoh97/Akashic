"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/theme";
import { NavbarProvider } from "@/contexts/NavbarContext";

import { Navbar } from "@/components/Navbar";
import { client } from "@/lib/apollo-client";
import { ApolloProvider } from "@apollo/client";
import { CacheProvider } from '@chakra-ui/next-js'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000, // 1 minute
						refetchOnWindowFocus: false,
						retry: 1,
					},
					mutations: {
						retry: 1,
					},
				},
			})
	)
	return (
		<html lang="en">
			<body>
					<QueryClientProvider client={queryClient}>
						<CacheProvider>
							<ChakraProvider theme={theme}>
								<AuthProvider>
									<NavbarProvider>
										<Navbar />
										<ApolloProvider client={client}>
											{children}
										</ApolloProvider>
									</NavbarProvider>
								</AuthProvider>
							</ChakraProvider>
						</CacheProvider>
						<ReactQueryDevtools />
					</QueryClientProvider>
			</body>
		</html>
	);
}
