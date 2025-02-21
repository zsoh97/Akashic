"use client";

import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	UnorderedList,
	ListItem,
	Divider,
} from "@chakra-ui/react";

export default function Terms() {
	return (
		<Box as="main" py={12}>
			<Container maxW="container.md">
				<VStack spacing={8} align="stretch">
					<VStack align="start" spacing={4}>
						<Heading size="2xl">Terms of Service</Heading>
						<Text color="warmGray.600">Last updated: March 2024</Text>
					</VStack>

					<Divider />

					<VStack align="start" spacing={6}>
						<Text>
							These Terms of Service (&ldquo;Terms&rdquo;) govern your access to
							and use of Akashic&apos;s website and services. By accessing or
							using Akashic, you agree to be bound by these Terms.
						</Text>

						<VStack align="start" spacing={4}>
							<Heading size="lg">1. Your Agreement with Akashic</Heading>
							<Text>
								By using our services, you acknowledge that you have read,
								understood, and agree to be bound by these Terms. If you do not
								agree, please do not use Akashic.
							</Text>
						</VStack>

						<VStack align="start" spacing={4}>
							<Heading size="lg">2. Privacy</Heading>
							<Text>
								Your privacy is important to us. Our Privacy Policy explains how
								we collect, use, and protect your personal information. By using
								Akashic, you agree to our Privacy Policy.
							</Text>
						</VStack>

						<VStack align="start" spacing={4}>
							<Heading size="lg">3. Content and Conduct</Heading>
							<Text>You agree that you will:</Text>
							<UnorderedList spacing={2} pl={4}>
								<ListItem>
									Comply with all applicable laws and regulations
								</ListItem>
								<ListItem>
									Respect the intellectual property rights of others
								</ListItem>
								<ListItem>Not engage in harassment or hate speech</ListItem>
								<ListItem>Not post spam or malicious content</ListItem>
								<ListItem>
									Not manipulate or interfere with our services
								</ListItem>
							</UnorderedList>
						</VStack>

						<VStack align="start" spacing={4}>
							<Heading size="lg">4. Account Registration</Heading>
							<Text>
								You may need to create an account to use some of our services.
								You are responsible for maintaining the security of your account
								and for all activities that occur under it.
							</Text>
						</VStack>

						<VStack align="start" spacing={4}>
							<Heading size="lg">5. Termination</Heading>
							<Text>
								We reserve the right to suspend or terminate your access to
								Akashic at our sole discretion, without notice, for conduct that
								we believe violates these Terms or is harmful to other users,
								us, or third parties, or for any other reason.
							</Text>
						</VStack>
					</VStack>
				</VStack>
			</Container>
		</Box>
	);
}
