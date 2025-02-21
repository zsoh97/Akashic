"use client";

import {
	Box,
	Container,
	Grid,
	Heading,
	VStack,
	useColorModeValue,
	HStack,
} from "@chakra-ui/react";
import { Navbar } from "@/components/Navbar";
import { BookCard } from "@/components/dashboard/BookCard";

// Sample collection data (replace with API call)
const myBooks = [
	{
		id: "1",
		title: "The Midnight Library",
		author: "Matt Haig",
		coverImage: "/books/midnight-library.jpg",
		status: "read" as const,
	},
	// ... more books
];

export default function MyBooksPage() {
	return (
		<>
			<Navbar />
			<Container maxW="container.xl" py={8} pt={{ base: "70px", md: "80px" }}>
				<VStack spacing={8} align="stretch">
					<Heading size="lg">My Books</Heading>

					{/* Books I've Read */}
					<Box>
						<Heading size="lg" mb={2}>
							Books I&apos;ve Read
						</Heading>
						<Grid
							templateColumns={{
								base: "1fr",
								sm: "repeat(2, 1fr)",
								lg: "repeat(4, 1fr)",
							}}
							gap={6}
						>
							{myBooks
								.filter((book) => book.status === "read")
								.map((book) => (
									<BookCard key={book.id} {...book} />
								))}
						</Grid>
					</Box>

					{/* Want to Read */}
					<Box>
						<Heading size="lg" mb={2}>
							Want to Read
						</Heading>
						<Grid
							templateColumns={{
								base: "1fr",
								sm: "repeat(2, 1fr)",
								lg: "repeat(4, 1fr)",
							}}
							gap={6}
						>
							{myBooks
								.filter((book) => book.status === "want-to-read")
								.map((book) => (
									<BookCard key={book.id} {...book} />
								))}
						</Grid>
					</Box>
				</VStack>
			</Container>
		</>
	);
}
