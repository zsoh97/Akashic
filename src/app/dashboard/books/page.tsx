"use client";

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import {
	Box,
	Container,
	Grid,
	Heading,
	VStack,
	SimpleGrid,
	Text,
	Button,
	Flex,
	Input,
	InputGroup,
	InputLeftElement,
	Icon,
	Spinner,
	Center,
} from "@chakra-ui/react";
import { Navbar } from "@/components/Navbar";
import { BookCard } from "@/components/dashboard/BookCard";
import { FiSearch, FiPlus } from "react-icons/fi";
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useRouter } from 'next/navigation';

const GET_BOOKS = gql`
	query GetBooks($limit: Int, $offset: Int) {
		books(limit: $limit, offset: $offset) {
			id
			isbn
			isbn13
			title
			authors
			coverImage
			averageRating
			categories
		}
	}
`;

const SEARCH_BOOKS = gql`
	query SearchBooks($query: String!, $limit: Int) {
		searchBooks(query: $query, limit: $limit) {
			id
			isbn
			isbn13
			title
			authors
			coverImage
			averageRating
			categories
		}
	}
`;

export default function BooksPage() {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	
	const { data, loading, error } = useQuery(GET_BOOKS, {
		variables: { limit: 20, offset: 0 },
		skip: searchQuery.trim().length > 0
	});
	
	const { data: searchData, loading: searchLoading } = useQuery(SEARCH_BOOKS, {
		variables: { query: searchQuery, limit: 20 },
		skip: searchQuery.trim().length === 0
	});
	
	const books = searchQuery.trim().length > 0 ? searchData?.searchBooks : data?.books;
	const isLoading = loading || searchLoading;
	
	return (
		<>
			<Navbar />
			<DashboardLayout>
				<Container maxW="container.xl" py={8}>
					<Flex justify="space-between" align="center" mb={8}>
						<Heading size="lg">My Books</Heading>
						<Button 
							leftIcon={<FiPlus />} 
							colorScheme="sepia"
							onClick={() => router.push('/dashboard/books/add')}
						>
							Add Book
						</Button>
					</Flex>
					
					<InputGroup mb={8} maxW="600px">
						<InputLeftElement pointerEvents="none">
							<Icon as={FiSearch} color="gray.400" />
						</InputLeftElement>
						<Input 
							placeholder="Search your books..." 
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</InputGroup>
					
					{isLoading ? (
						<Center py={10}>
							<Spinner size="xl" color="sepia.500" />
						</Center>
					) : error ? (
						<Box textAlign="center" py={10}>
							<Text>Error loading books. Please try again later.</Text>
						</Box>
					) : books?.length > 0 ? (
						<SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={6}>
							{books.map((book) => (
								<BookCard
									key={book.id}
									id={book.id}
									isbn={book.isbn || book.isbn13}
									title={book.title}
									authors={book.authors}
									coverImage={book.coverImage || '/empty-book-cover.svg'}
									rating={book.averageRating}
									categories={book.categories}
								/>
							))}
						</SimpleGrid>
					) : (
						<Box textAlign="center" py={10}>
							<Text>No books found. Add some books to your collection!</Text>
						</Box>
					)}
				</Container>
			</DashboardLayout>
		</>
	);
}
