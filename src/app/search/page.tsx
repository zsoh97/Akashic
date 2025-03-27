'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Book } from '@/types/book';
import { fetchOpenLibrarySearch } from '@/lib/api';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Button,
  Image,
  Card,
  CardBody,
  Stack,
  Badge,
  Spinner,
  useColorModeValue,
  ButtonGroup,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const RESULTS_PER_PAGE = 20;

export default function SearchResults() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') ?? '';
  const pageParam = searchParams?.get('page') ?? '1';
  const currentPage = parseInt(pageParam, 10);
  
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query) {
        setBooks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await fetchOpenLibrarySearch(query, (currentPage - 1) * RESULTS_PER_PAGE, RESULTS_PER_PAGE);
        setBooks(results.books);
        setTotalResults(results.totalResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  // Handle page change
  function handlePageChange(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return;
    
    // Update URL with new page parameter
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.set('page', newPage.toString());
    router.push(`/search?${params.toString()}`);
  }

  // Generate page numbers to display
  function getPageNumbers() {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning
      if (currentPage <= 2) {
        endPage = 4;
      }
      
      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push(-1); // -1 represents ellipsis
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  }

  // Handle book selection
  function handleBookSelect(book: Book) {
    router.push(`/dashboard/books/isbn/${book.id}`);
  }

  return (
    <DashboardLayout>
      <Box width="100%" minHeight="800px">
        <Heading size="lg" mb={4}>
          {query ? `Search Results for "${query}"` : 'Search Results'}
        </Heading>
        
        {loading ? (
          <Center py={16}>
            <Flex direction="column" align="center">
              <Spinner size="xl" color="sepia.500" thickness="4px" speed="0.65s" mb={4} />
              <Text color="gray.600" fontSize="lg">
                {query ? `Searching for "${query}"...` : 'Loading...'}
              </Text>
            </Flex>
          </Center>
        ) : books.length > 0 ? (
          <>
            <Text mb={6} color="gray.600">
              Found {totalResults} results
            </Text>
            
            <SimpleGrid columns={{ base: 2, md: 3, lg: 4, xl: 5 }} spacing={6} mb={8}>
              {books.map((book) => (
                <Card 
                  key={book.id} 
                  borderRadius="lg" 
                  overflow="hidden" 
                  borderColor={borderColor}
                  cursor="pointer"
                  onClick={() => handleBookSelect(book)}
                  transition="transform 0.2s"
                  _hover={{ transform: 'translateY(-5px)' }}
                >
                  <Box height="200px" position="relative">
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      objectFit="cover"
                      w="100%"
                      h="100%"
                      fallbackSrc="/images/default-cover.jpg"
                    />
                    {book.publishYear && (
                      <Badge 
                        position="absolute" 
                        bottom={2} 
                        right={2} 
                        colorScheme="sepia"
                        borderRadius="full"
                        px={2}
                      >
                        {book.publishYear}
                      </Badge>
                    )}
                  </Box>
                  <CardBody>
                    <Stack spacing={2}>
                      <Heading size="sm" noOfLines={2}>{book.title}</Heading>
                      <Text fontSize="sm" color="gray.600" noOfLines={1}>
                        {book.author}
                      </Text>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Flex justify="center" mt={8} mb={12}>
                <ButtonGroup variant="outline" isAttached>
                  <IconButton
                    aria-label="Previous page"
                    icon={<FiChevronLeft />}
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                  />
                  
                  {getPageNumbers().map((page, index) => (
                    page < 0 ? (
                      // Render ellipsis
                      <Button key={`ellipsis-${index}`} variant="ghost" isDisabled>
                        ...
                      </Button>
                    ) : (
                      // Render page number
                      <Button
                        key={page}
                        variant={currentPage === page ? "solid" : "outline"}
                        colorScheme={currentPage === page ? "sepia" : undefined}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    )
                  ))}
                  
                  <IconButton
                    aria-label="Next page"
                    icon={<FiChevronRight />}
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                  />
                </ButtonGroup>
              </Flex>
            )}
          </>
        ) : query ? (
          <Box textAlign="center" py={12}>
            <Text fontSize="xl" color="gray.600">No results found for "{query}"</Text>
            <Text mt={2} color="gray.500">Try a different search term or browse categories</Text>
          </Box>
        ) : (
          <Box textAlign="center" py={12}>
            <Text fontSize="xl" color="gray.600">Enter a search term to find books</Text>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
} 