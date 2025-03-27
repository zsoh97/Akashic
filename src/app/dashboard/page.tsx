"use client";

import {
	Box,
	VStack,
	Heading,
	Text,
	Icon,
	Link,
	useColorModeValue,
	SimpleGrid,
	Button,
	Center,
} from "@chakra-ui/react";
import { FiBook, FiCompass, FiUsers } from "react-icons/fi";
import { PostCard } from "@/components/dashboard/PostCard";
import { BookCard } from "@/components/dashboard/BookCard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {

	const emptyStateBg = useColorModeValue("gray.50", "gray.700");

	// Sample data - replace with real data
	const currentlyReading: any[] = [];
	const followingFeed: any[] = [];
	const { session } = useAuth()

	return (
		<DashboardLayout>
			{!!session ?
				<VStack spacing={8} align="stretch">
					{/* Currently Reading */}
					<Box>
						<Heading size="lg" mb={6}>Currently Reading</Heading>
						{currentlyReading.length > 0 ? (
							<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
								{currentlyReading.map((book) => (
									<BookCard key={book.id} {...book} />
								))}
							</SimpleGrid>
						) : (
							<Center
								p={8}
								bg={emptyStateBg}
								borderRadius="lg"
								flexDirection="column"
								gap={4}
							>
								<Icon as={FiBook} w={10} h={10} color="gray.400" />
								<Text color="gray.500" textAlign="center">
									You're not reading any books yet
								</Text>
								<Link href="/dashboard/discover">
									<Button
										leftIcon={<Icon as={FiCompass} />}
										colorScheme="sepia"
										variant="outline"
									>
										Discover Books
									</Button>
								</Link>
							</Center>
						)}
					</Box>

					{/* Following Feed */}
					<Box>
						<Heading size="lg" mb={6}>Following Feed</Heading>
						{followingFeed.length > 0 ? (
							<VStack spacing={6} align="stretch">
								{followingFeed.map((post) => (
									<PostCard key={post.id} {...post} />
								))}
							</VStack>
						) : (
							<Center
								p={8}
								bg={emptyStateBg}
								borderRadius="lg"
								flexDirection="column"
								gap={4}
							>
								<Icon as={FiUsers} w={10} h={10} color="gray.400" />
								<VStack spacing={2}>
									<Text color="gray.500" textAlign="center">
										Your feed is empty
									</Text>
									<Text color="gray.500" fontSize="sm" textAlign="center">
										Follow other readers to see their updates here
									</Text>
								</VStack>
								<Link href="/dashboard/discover">
									<Button
										leftIcon={<Icon as={FiUsers} />}
										colorScheme="sepia"
										variant="outline"
									>
										Find Readers
									</Button>
								</Link>
							</Center>
						)}
					</Box>
				</VStack> : <VStack flex={1} align="stretch" height="100%">
					<Center>Login or sign up to view your personalised dashboard</Center>
				</VStack>
			}
		</DashboardLayout>
	);
}
