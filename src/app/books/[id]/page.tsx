"use client";

import {
	Box,
	Container,
	VStack,
	HStack,
	Heading,
	Text,
	Image,
	useColorModeValue,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Icon,
	ButtonGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiBookOpen, FiCheckCircle, FiChevronDown } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/dashboard/PostCard";

// Sample book data
const bookData = {
	title: "The Midnight Library",
	author: "Matt Haig",
	coverImage: "/books/midnight-library.jpg",
	description:
		"Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
	publishedDate: "2020",
	rating: "4.5",
	reviewCount: "2.3k",
};

// Sample posts about the book
const sampleBookPosts = [
	{
		id: "1",
		author: {
			id: "1",
			name: "Jane Smith",
			image: "/avatars/jane.jpg",
		},
		content: "The concept of infinite possibilities...",
		timestamp: "2d ago",
		likes: 245,
		commentCount: 89,
	},
	{
		id: "2",
		author: {
			id: "2",
			name: "John Doe",
			image: "/avatars/john.jpg",
		},
		content: "The way Matt Haig explores depression...",
		timestamp: "5d ago",
		likes: 189,
		commentCount: 45,
	},
	// Add more sample posts
];

type SortOption = "popular" | "discussed" | "newest";

export default function BookPage() {
	const [sortBy, setSortBy] = useState<SortOption>("popular");
	const [readingStatus, setReadingStatus] = useState<
		"read" | "want-to-read" | null
	>(null);
	const borderColor = useColorModeValue("gray.100", "gray.700");

	const getSortedPosts = () => {
		const posts = [...sampleBookPosts];
		switch (sortBy) {
			case "popular":
				return posts.sort((a, b) => b.likes - a.likes);
			case "discussed":
				return posts.sort((a, b) => b.commentCount - a.commentCount);
			case "newest":
				return posts.sort(
					(a, b) =>
						new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
				);
			default:
				return posts;
		}
	};

	const handleStatusUpdate = (status: "read" | "want-to-read") => {
		setReadingStatus(status);
		// Here you would make an API call to update the reading status
	};

	return (
		<>
			<Navbar />
			<Container maxW="container.xl" py={8} pt={{ base: "70px", md: "80px" }}>
				<VStack spacing={8} align="stretch">
					{/* Book Header */}
					<Box
						p={8}
						bg="white"
						borderRadius="lg"
						borderWidth="1px"
						borderColor={borderColor}
					>
						<HStack spacing={8} align="start">
							<Box
								width="200px"
								height="300px"
								flexShrink={0}
								overflow="hidden"
								borderRadius="md"
								boxShadow="lg"
							>
								<Image
									src={bookData.coverImage}
									alt={bookData.title}
									objectFit="cover"
									width="100%"
									height="100%"
								/>
							</Box>
							<VStack align="start" spacing={6}>
								<VStack align="start" spacing={2}>
									<Heading size="xl">{bookData.title}</Heading>
									<Text fontSize="xl" color="warmGray.600">
										by {bookData.author}
									</Text>
								</VStack>
								<HStack spacing={4} color="warmGray.500">
									<Text>Published {bookData.publishedDate}</Text>
									<Text>•</Text>
									<Text>{bookData.rating} Rating</Text>
									<Text>•</Text>
									<Text>{bookData.reviewCount} Reviews</Text>
								</HStack>
								<Text color="warmGray.700" fontSize="lg" lineHeight="tall">
									{bookData.description}
								</Text>

								<ButtonGroup size="lg" width="100%" spacing={4}>
									<Button
										leftIcon={<Icon as={FiCheckCircle} />}
										colorScheme={readingStatus === "read" ? "sepia" : "gray"}
										variant={readingStatus === "read" ? "solid" : "outline"}
										flex={1}
										onClick={() => handleStatusUpdate("read")}
									>
										Read
									</Button>
									<Button
										leftIcon={<Icon as={FiBookOpen} />}
										colorScheme={
											readingStatus === "want-to-read" ? "sepia" : "gray"
										}
										variant={
											readingStatus === "want-to-read" ? "solid" : "outline"
										}
										flex={1}
										onClick={() => handleStatusUpdate("want-to-read")}
									>
										Want to Read
									</Button>
								</ButtonGroup>
							</VStack>
						</HStack>
					</Box>

					{/* Posts Section */}
					<VStack spacing={6} align="stretch">
						<HStack justify="space-between">
							<Heading size="lg">Discussions</Heading>
							<Menu>
								<MenuButton
									as={Button}
									rightIcon={<Icon as={FiChevronDown} />}
									variant="outline"
									colorScheme="sepia"
									size="md"
									width="200px"
									textAlign="left"
									fontWeight="normal"
								>
									{sortBy === "popular" && "Most Popular"}
									{sortBy === "discussed" && "Most Discussed"}
									{sortBy === "newest" && "Newest First"}
								</MenuButton>
								<MenuList>
									<MenuItem onClick={() => setSortBy("popular")}>
										Most Popular
									</MenuItem>
									<MenuItem onClick={() => setSortBy("discussed")}>
										Most Discussed
									</MenuItem>
									<MenuItem onClick={() => setSortBy("newest")}>
										Newest First
									</MenuItem>
								</MenuList>
							</Menu>
						</HStack>
						{getSortedPosts().map((post, index) => (
							<PostCard key={index} {...post} />
						))}
					</VStack>
				</VStack>
			</Container>
		</>
	);
}
