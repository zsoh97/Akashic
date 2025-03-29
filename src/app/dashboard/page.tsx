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
	Spinner,
} from "@chakra-ui/react";
import { FiBook, FiCompass, FiUsers, FiBookmark } from "react-icons/fi";
import { PostCard } from "@/components/dashboard/PostCard";
import { BookCard } from "@/components/dashboard/BookCard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useAuth } from '@/contexts/AuthContext';
import { useGetReadingList } from '@/hooks/useGetReadingList';

export default function DashboardPage() {

	const emptyStateBg = useColorModeValue("gray.50", "gray.700");

	const followingFeed: any[] = [];
	const { session } = useAuth();
	
	// Get user's reading list books
	const { readingList, loading: loadingReadingList, error: readingListError } = useGetReadingList();
	
	return (
		<DashboardLayout>
			{!!session ?
				<VStack spacing={8} align="stretch">
					{/* Reading List */}
					<Box>
						<Heading size="lg" mb={6}>Your Reading List</Heading>
						{loadingReadingList ? (
							<Center py={4}>
								<Spinner size="lg" color="sepia.500" />
							</Center>
						) : readingListError ? (
							<Center
								p={8}
								bg={emptyStateBg}
								borderRadius="lg"
								flexDirection="column"
								gap={4}
							>
								<Text color="gray.500" textAlign="center">
									Error loading your reading list
								</Text>
							</Center>
						) : readingList.books.length > 0 ? (
							<SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
								{readingList.books.map((book) => (
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
								<Icon as={FiBookmark} w={10} h={10} color="gray.400" />
								<Text color="gray.500" textAlign="center">
									Your reading list is empty
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
