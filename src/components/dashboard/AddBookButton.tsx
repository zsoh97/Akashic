"use client";

import {
	Button,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	Input,
	VStack,
	useDisclosure,
	useToast,
	InputGroup,
	InputLeftElement,
	Icon,
	Box,
	Text,
	HStack,
	Image,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";

// Mock search results - replace with API call
const searchBooks = async (query: string) => {
	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 500));
	return [
		{
			id: "3",
			title: "The Hobbit",
			author: "J.R.R. Tolkien",
			coverImage: "/books/hobbit.jpg",
		},
		// ... more results
	];
};

export function AddBookButton() {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const toast = useToast();

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;

		setIsSearching(true);
		try {
			const results = await searchBooks(searchQuery);
			setSearchResults(results);
		} catch (error) {
			toast({
				title: "Error searching books",
				status: "error",
				duration: 3000,
			});
		} finally {
			setIsSearching(false);
		}
	};

	const handleAddBook = (book: any, status: "read" | "want-to-read") => {
		// Here you would make an API call to add the book
		toast({
			title: "Book added",
			description: `Added "${book.title}" to your ${
				status === "read" ? "read books" : "want to read list"
			}`,
			status: "success",
			duration: 3000,
		});
		onClose();
	};

	return (
		<>
			<Button
				leftIcon={<Icon as={FiPlus} />}
				colorScheme="sepia"
				onClick={onOpen}
			>
				Add Book
			</Button>

			<Modal isOpen={isOpen} onClose={onClose} size="xl">
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add a Book</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<VStack spacing={6}>
							<InputGroup size="lg">
								<InputLeftElement pointerEvents="none">
									<Icon as={FiSearch} color="gray.400" />
								</InputLeftElement>
								<Input
									placeholder="Search for a book..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									onKeyPress={(e) => e.key === "Enter" && handleSearch()}
								/>
							</InputGroup>

							<VStack spacing={4} align="stretch" width="100%">
								{isSearching ? (
									<Text textAlign="center" color="gray.500">
										Searching...
									</Text>
								) : (
									searchResults.map((book) => (
										<Box
											key={book.id}
											p={4}
											borderWidth="1px"
											borderRadius="lg"
										>
											<HStack spacing={4}>
												<Image
													src={book.coverImage}
													alt={book.title}
													width="60px"
													height="90px"
													objectFit="cover"
													borderRadius="md"
												/>
												<VStack align="start" flex={1}>
													<Text fontWeight="bold">{book.title}</Text>
													<Text color="gray.600">{book.author}</Text>
												</VStack>
												<VStack>
													<Button
														size="sm"
														colorScheme="sepia"
														onClick={() => handleAddBook(book, "read")}
													>
														Read
													</Button>
													<Button
														size="sm"
														variant="outline"
														colorScheme="sepia"
														onClick={() => handleAddBook(book, "want-to-read")}
													>
														Want to Read
													</Button>
												</VStack>
											</HStack>
										</Box>
									))
								)}
							</VStack>
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}
