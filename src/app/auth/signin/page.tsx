"use client";

import {
	Container,
	Box,
	VStack,
	Heading,
	Text,
	Button,
	Divider,
	HStack,
	Icon,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { SignInForm } from "@/components/auth/SignInForm";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

export default function SignInPage() {
	const supabase = createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
	);

	const handleGoogleSignIn = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
	};

	return (
		<Container maxW="md" py={12}>
			<Box p={8} shadow="lg" rounded="xl" bg="white">
				<VStack spacing={8}>
					<VStack spacing={2} textAlign="center">
						<Heading size="xl">Welcome Back</Heading>
						<Text color="gray.600">
							Sign in to continue reading
						</Text>
					</VStack>

					<Button
						w="full"
						size="lg"
						variant="outline"
						leftIcon={<Icon as={FcGoogle} />}
						onClick={handleGoogleSignIn}
					>
						Continue with Google
					</Button>

					<HStack w="full">
						<Divider />
						<Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
							or sign in with email
						</Text>
						<Divider />
					</HStack>

					<SignInForm />

					<Text fontSize="sm" color="gray.600">
						Don't have an account?{" "}
						<Link href="/auth" style={{ color: "sepia.500", textDecoration: "underline" }}>
							Join the Club
						</Link>
					</Text>
				</VStack>
			</Box>
		</Container>
	);
}
