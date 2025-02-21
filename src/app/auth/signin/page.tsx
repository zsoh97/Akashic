"use client";

import {
	Button,
	Container,
	Heading,
	VStack,
	Text,
	Icon,
	Box,
	Divider,
	HStack,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignIn() {
	return (
		<Box minH="100vh" bg="warmWhite.50" py={{ base: 8, md: 12 }}>
			<Container
				maxW="md"
				bg="white"
				p={{ base: 8, md: 10 }}
				rounded="xl"
				boxShadow="xl"
				borderWidth="1px"
				borderColor="warmGray.100"
			>
				<VStack spacing={8} align="stretch">
					<VStack spacing={3} textAlign="center">
						<Heading size="xl" color="warmGray.900">
							Welcome to Akashic
						</Heading>
						<Text color="warmGray.600" fontSize="lg">
							Sign in or create an account to continue
						</Text>
					</VStack>

					<VStack spacing={4}>
						<Button
							w="full"
							size="lg"
							variant="outline"
							leftIcon={<Icon as={FcGoogle} boxSize={5} />}
							onClick={() => signIn("google", { callbackUrl: "/" })}
							_hover={{
								bg: "warmWhite.50",
								transform: "translateY(-1px)",
								boxShadow: "sm",
							}}
						>
							Continue with Google
						</Button>

						<Button
							w="full"
							size="lg"
							variant="outline"
							bg="black"
							color="white"
							leftIcon={<Icon as={FaApple} boxSize={5} />}
							onClick={() => signIn("apple", { callbackUrl: "/" })}
							_hover={{
								bg: "gray.800",
								transform: "translateY(-1px)",
								boxShadow: "sm",
							}}
						>
							Continue with Apple
						</Button>

						<HStack w="full" py={4}>
							<Divider />
							<Text fontSize="sm" color="warmGray.400" whiteSpace="nowrap">
								or
							</Text>
							<Divider />
						</HStack>

						<Button
							w="full"
							size="lg"
							variant="primary"
							onClick={() => signIn("google", { callbackUrl: "/" })}
							_hover={{
								transform: "translateY(-1px)",
								boxShadow: "lg",
							}}
						>
							Create an Account
						</Button>
					</VStack>

					<Text fontSize="sm" color="warmGray.500" textAlign="center">
						By continuing, you agree to our{" "}
						<Link href="/terms" style={{ textDecoration: "underline" }}>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link href="/privacy" style={{ textDecoration: "underline" }}>
							Privacy Policy
						</Link>
					</Text>
				</VStack>
			</Container>
		</Box>
	);
}
