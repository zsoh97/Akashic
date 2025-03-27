"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  VStack,
  Heading,
  SimpleGrid,
  Text,
  Button,
  Spinner,
  Flex,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BookCover } from '@/components/books/BookCover';
import { fetchNYTBestsellers, NYTBook, NYT_LISTS } from '@/services/nytBooksService';

export default function BestsellerListPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params.listId as string;
  
  const [books, setBooks] = useState<NYTBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listName, setListName] = useState('');
  
  useEffect(() => {
    async function loadBestsellers() {
      try {
        setIsLoading(true);
        const data = await fetchNYTBestsellers(listId);
        setBooks(data.books);
        setListName(data.list_name);
        setError(null);
      } catch (err) {
        console.error('Error loading bestsellers:', err);
        setError('Failed to load bestsellers. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (listId) {
      loadBestsellers();
    }
  }, [listId]);
  
  const handleBookClick = (book: NYTBook) => {
    // Search for the book in Google Books API using ISBN
    const isbn = book.primary_isbn13 || book.primary_isbn10;
    if (isbn) {
      router.push(`/dashboard/discover?q=isbn:${isbn}`);
    } else {
      // Fallback to title + author search
      router.push(`/dashboard/discover?q=${encodeURIComponent(`${book.title} ${book.author}`)}`);
    }
  };
  
  const listInfo = NYT_LISTS.find(list => list.id === listId);
  
  return (
    <DashboardLayout>
      <VStack spacing={8} align="stretch" width="100%">
        <Button 
          leftIcon={<FiArrowLeft />} 
          variant="ghost" 
          alignSelf="flex-start"
          onClick={() => router.back()}
        >
          Back
        </Button>
        
        <Heading size="lg" mb={2}>
          {listName || listInfo?.name || 'Bestsellers'}
        </Heading>
        
        <Text fontSize="lg" mb={6}>
          The New York Times Bestseller list, updated weekly.
        </Text>
        
        {isLoading ? (
          <Flex justify="center" align="center" py={10}>
            <Spinner size="xl" color="sepia.500" />
          </Flex>
        ) : error ? (
          <Box textAlign="center" py={10}>
            <Text color="red.500">{error}</Text>
            <Button mt={4} onClick={() => router.back()}>
              Go Back
            </Button>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing={8}>
            {books.map((book) => (
              <Box 
                key={book.primary_isbn13 || book.title}
                onClick={() => handleBookClick(book)}
                cursor="pointer"
                transition="transform 0.2s"
                _hover={{ transform: 'translateY(-5px)' }}
              >
                <Flex direction="column" align="center">
                  <Box position="relative" mb={3}>
                    <BookCover 
                      imageUrl={book.book_image} 
                      title={book.title}
                      size="md"
                    />
                    <Badge 
                      position="absolute" 
                      top={2} 
                      left={2} 
                      colorScheme="sepia" 
                      fontSize="sm"
                      borderRadius="full"
                      px={2}
                    >
                      #{book.rank}
                    </Badge>
                    
                    {book.rank_last_week > 0 && book.rank < book.rank_last_week && (
                      <Badge 
                        position="absolute" 
                        top={2} 
                        right={2} 
                        colorScheme="green" 
                        fontSize="xs"
                        borderRadius="full"
                        px={2}
                      >
                        ↑ {book.rank_last_week - book.rank}
                      </Badge>
                    )}
                    
                    {book.weeks_on_list > 0 && (
                      <Badge 
                        position="absolute" 
                        bottom={2} 
                        right={2} 
                        colorScheme="blue" 
                        fontSize="xs"
                        borderRadius="full"
                        px={2}
                      >
                        {book.weeks_on_list} {book.weeks_on_list === 1 ? 'week' : 'weeks'}
                      </Badge>
                    )}
                  </Box>
                  <Text fontWeight="bold" textAlign="center" noOfLines={2} mb={1}>
                    {book.title}
                  </Text>
                  <Text fontSize="sm" color="gray.600" textAlign="center" noOfLines={1}>
                    {book.author}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {book.publisher}
                  </Text>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </DashboardLayout>
  );
} 