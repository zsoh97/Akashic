"use client";

import {
	Box,
	Container,
	Grid,
	GridItem,
	VStack,
	Heading,
	Text,
	Icon,
	Link,
	useColorModeValue,
} from "@chakra-ui/react";
import { FiHome, FiBook, FiUsers, FiStar } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/dashboard/PostCard";
import { BookCard } from "@/components/dashboard/BookCard";

// Sidebar navigation items
const sidebarItems = [
	{ icon: FiHome, label: "Feed", href: "/dashboard" },
	{ icon: FiBook, label: "My Books", href: "/dashboard/books" },
	{ icon: FiUsers, label: "Following", href: "/dashboard/following" },
	{
		icon: FiStar,
		label: "Recommendations",
		href: "/dashboard/recommendations",
	},
];

// Sample data (you'll replace this with real data)
const samplePosts = [
	{
		id: "1",
		author: {
			id: "1",
			name: "Jane Smith",
			image: "/avatars/jane.jpg",
		},
		content:
			"Just finished reading 'The Midnight Library' - absolutely mind-blowing!",
		timestamp: "2h ago",
		likes: 24,
		commentCount: 8,
	},
	// ... more posts
];

const sampleBooks = [
	{
		id: "1",
		title: "The Midnight Library",
		author: "Matt Haig",
		coverImage: "/books/midnight-library.jpg",
		status: "read" as const,
	},
	{
		id: "2",
		title: "Project Hail Mary",
		author: "Andy Weir",
		coverImage: "/books/project-hail-mary.jpg",
		status: "want-to-read" as const,
	},
	// ... more books
];

export default function Dashboard() {
	const sidebarBg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.100", "gray.700");

	return (
		<>
			<Navbar />
			<Container maxW="container.xl" py={8}>
				<Grid
					templateColumns={{ base: "1fr", md: "240px 1fr" }}
					gap={8}
					pt={{ base: "70px", md: "80px" }}
				>
					{/* Sidebar */}
					<GridItem
						as="aside"
						position={{ base: "relative", md: "sticky" }}
						top={{ base: 0, md: "100px" }}
						height={{ base: "auto", md: "calc(100vh - 100px)" }}
						overflowY="auto"
						bg={sidebarBg}
						p={4}
						borderRadius="lg"
						borderWidth="1px"
						borderColor={borderColor}
					>
						<VStack spacing={4} align="stretch">
							{sidebarItems.map((item) => (
								<Link
									key={item.label}
									href={item.href}
									display="flex"
									alignItems="center"
									p={2}
									borderRadius="md"
									_hover={{ bg: "warmWhite.50" }}
								>
									<Icon as={item.icon} mr={3} />
									<Text>{item.label}</Text>
								</Link>
							))}
						</VStack>
					</GridItem>

					{/* Main Content */}
					<GridItem>
						<VStack spacing={8} align="stretch">
							<Box>
								<Heading size="lg" mb={6}>
									Your Feed
								</Heading>
								<VStack spacing={6} align="stretch">
									{samplePosts.map((post, index) => (
										<PostCard key={index} {...post} />
									))}
								</VStack>
							</Box>

							<Box>
								<Heading size="lg" mb={6}>
									Your Reading List
								</Heading>
								<Grid
									templateColumns={{
										base: "1fr",
										sm: "repeat(2, 1fr)",
										lg: "repeat(3, 1fr)",
									}}
									gap={6}
								>
									{sampleBooks.map((book, index) => (
										<BookCard key={index} {...book} />
									))}
								</Grid>
							</Box>
						</VStack>
					</GridItem>
				</Grid>
			</Container>
		</>
	);
}
