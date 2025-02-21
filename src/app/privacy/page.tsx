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

export default function Privacy() {
	return (
		<Box as="main" py={12}>
			<Container maxW="container.md">
				<VStack spacing={8} align="stretch">
					<VStack align="start" spacing={4}>
						<Heading size="2xl">Privacy Policy</Heading>
						<Text color="warmGray.600">Last updated: March 2024</Text>
					</VStack>

					<Divider />

					<VStack align="start" spacing={6}>
						<Text>
							This Privacy Policy explains how Akashic collects, uses, and
							protects your personal information when you use our website and
							services.
						</Text>

						<VStack align="start" spacing={4}>
							<Heading size="lg">1. Information We Collect</Heading>
							<Text>
								We collect information that you provide directly to us:
							</Text>
							<UnorderedList spacing={2} pl={4}>
								<ListItem>
									Account information (name, email, profile picture)
								</ListItem>
								<ListItem>Content you post or share</ListItem>
								<ListItem>Communications with other users</ListItem>
								<ListItem>Reading preferences and history</ListItem>
							</UnorderedList>
						</VStack>

						<VStack align="start" spacing={4}>
							<Heading size="lg">2. How We Use Your Information</Heading>
							<Text>We use your information to:</Text>
							<UnorderedList spacing={2} pl={4}>
								<ListItem>Provide and improve our services</ListItem>
								<ListItem>Personalize your experience</ListItem>
								<ListItem>Send you updates and communications</ListItem>
								<ListItem>Protect against abuse and spam</ListItem>
								<ListItem>Analyze usage patterns</ListItem>
							</UnorderedList>
						</VStack>

						<VStack align="start" spacing={4}>
							<Heading size="lg">3. Information Sharing</Heading>
							<Text>
								We do not sell your personal information. We may share your
								information in the following circumstances:
							</Text>
							<UnorderedList spacing={2} pl={4}>
								<ListItem>With your consent</ListItem>
								<ListItem>To comply with legal obligations</ListItem>
								<ListItem>To protect rights and safety</ListItem>
								<ListItem>
									With service providers who assist our operations
								</ListItem>
							</UnorderedList>
						</VStack>

						<VStack align="start" spacing={4}>
							<Heading size="lg">4. Data Security</Heading>
							<Text>
								We implement reasonable security measures to protect your
								information. However, no method of transmission over the
								internet is 100% secure.
							</Text>
						</VStack>

						<VStack align="start" spacing={4}>
							<Heading size="lg">5. Your Rights</Heading>
							<Text>You have the right to:</Text>
							<UnorderedList spacing={2} pl={4}>
								<ListItem>Access your personal information</ListItem>
								<ListItem>Correct inaccurate data</ListItem>
								<ListItem>Request deletion of your data</ListItem>
								<ListItem>Opt out of marketing communications</ListItem>
							</UnorderedList>
						</VStack>
					</VStack>
				</VStack>
			</Container>
		</Box>
	);
}
