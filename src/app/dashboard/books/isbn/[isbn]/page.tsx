"use client";

import { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
  Box,
  VStack,
  Heading,
  Button,
  Divider,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
} from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BookDetailHeader } from '@/components/books/BookDetailHeader';
import { BookDescription } from '@/components/books/BookDescription';
import { BookDetails } from '@/components/books/BookDetails';
import { BookDiscussions } from '@/components/books/BookDiscussions';
import { BookDetailSkeleton } from '@/components/books/BookDetailSkeleton';
import { useParams, useRouter } from 'next/navigation';
import _ from 'lodash';
import { useCreateBooks } from '@/hooks/useCreateBooks';
import { useGetBook } from '@/hooks/useGetBook';

export default function BookDetailPage() {
  const router = useRouter()
  const params = useParams()
  const isbn = _.get(params, 'isbn') || ''

  const { data, isGetBookError, refetch } = useGetBook(isbn as string);
  
  // GraphQL book data
  let graphQLBook = data?.book;
  
  const sectionBg = useColorModeValue('gray.50', 'gray.700');

  // Add the mutation hook
  const {createBook, createBookError} = useCreateBooks();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookData, setBookData] = useState<any>(null);

  // Get the current book to display - either from GraphQL or Google Books
  const bookToDisplay = graphQLBook || bookData?.volumeInfo;
  
  useEffect(() => {
    // Only run this effect if we don't have GraphQL data yet
    if (!graphQLBook && isbn) {
      async function fetchBookDetails() {
        if (!isbn) return;
        
        try {
          setIsLoading(true);
          
          // Fetch from Google Books API
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch book data');
          }
          
          const data = await response.json();
          const book = data.items?.[0];
          
          setBookData(book);
          
          const volumeInfo = book.volumeInfo;
          graphQLBook = await createBook({
            variables: {
              isbn: isbn,
              title: volumeInfo.title || 'Unknown Title',
              authors: volumeInfo.authors || ['Unknown Author'],
              description: volumeInfo.description || '',
              coverImage: volumeInfo.imageLinks?.thumbnail || '',
              publisher: volumeInfo.publisher || '',
              publishedDate: volumeInfo.publishedDate || '',
              pageCount: volumeInfo.pageCount || 0,
              categories: volumeInfo.categories || []
            }
          });
        } catch (err) {
          setError('Failed to load book details');
        } finally {
          setIsLoading(false);
        }
      }
      
      fetchBookDetails();
    }
  }, [isbn, graphQLBook, createBook, refetch]);


  // Get the book's cover image
  function getBookCoverUrl(): string {
    if (graphQLBook?.coverImage) {
      return graphQLBook.coverImage;
    } else if (bookData?.volumeInfo?.imageLinks?.thumbnail) {
      return bookData.volumeInfo.imageLinks.thumbnail;
    }
    return '/empty-book-cover.svg';
  }

  // Get the book's description
  function getBookDescription(): string {
    if (graphQLBook?.description) {
      return graphQLBook.description;
    } else if (bookData?.volumeInfo?.description) {
      return bookData.volumeInfo.description;
    }
    return 'No description available.';
  }

  // Get the book's subjects
  function getBookSubjects(): string[] {
    if (graphQLBook?.categories) {
      return graphQLBook.categories;
    } else if (bookData?.volumeInfo?.categories) {
      return bookData.volumeInfo.categories;
    }
    return [];
  }

  // Get author names as an array
  function getAuthorNames(): string[] {
    if (graphQLBook?.authors) {
      return graphQLBook.authors;
    } else if (bookData?.volumeInfo?.authors) {
      return bookData.volumeInfo.authors;
    }
    return ['Unknown Author'];
  }

  // Update the BookDetails component to fix type errors
  function getBookDetails() {
    return {
      publisher: graphQLBook?.publisher || bookData?.volumeInfo?.publisher,
      publishDate: graphQLBook?.publishedDate || bookData?.volumeInfo?.publishedDate,
      pageCount: graphQLBook?.pageCount || bookData?.volumeInfo?.pageCount,
      isbn10: bookData?.volumeInfo?.industryIdentifiers?.find((id: { type: string }) => id.type === 'ISBN_10')?.identifier,
      isbn13: bookData?.volumeInfo?.industryIdentifiers?.find((id: { type: string }) => id.type === 'ISBN_13')?.identifier || graphQLBook?.isbn13,
      googleBooksId: bookData?.id
    };
  }

  return (
    <DashboardLayout>
      <VStack spacing={6} align="stretch" width="100%">
        <Button 
          leftIcon={<Icon as={FiArrowLeft} />} 
          variant="ghost" 
          alignSelf="flex-start"
          onClick={() => router.back()}
        >
          Back
        </Button>
        
        <Box>
          {isLoading ? (
            <BookDetailSkeleton />
          ) : (
            <>
              {bookToDisplay ? (
                <>
                  <BookDetailHeader
                    id={graphQLBook.id}
                    title={bookToDisplay.title}
                    authors={getAuthorNames()}
                    coverUrl={getBookCoverUrl()}
                    subjects={getBookSubjects()}
                    rating={bookData?.volumeInfo?.averageRating}
                    isInReadingList={graphQLBook?.isInReadingList}
                  />
                  
                  <Divider my={6} />
                  
                  <Tabs colorScheme="sepia" isLazy>
                    <TabList>
                      <Tab>Book Information</Tab>
                      <Tab>Discussions</Tab>
                    </TabList>
                    
                    <TabPanels>
                      {/* Book Information Tab */}
                      <TabPanel p={0} pt={6}>
                        <VStack spacing={6} align="stretch">
                          <BookDescription 
                            description={getBookDescription()}
                            sectionBg={sectionBg}
                          />
                          
                          <BookDetails {...getBookDetails()} />
                        </VStack>
                      </TabPanel>
                      
                      {/* Discussions Tab */}
                      <TabPanel p={0} pt={6}>
                        {graphQLBook && <BookDiscussions bookId={graphQLBook.id} />}
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </>
              ): <>
              {(error || isGetBookError || createBookError) && (
                <Box p={8} textAlign="center">
                  <Heading size="md">{error || isGetBookError?.message || createBookError?.message || 'Book Not Found'}</Heading>
                  <Button mt={4} colorScheme="sepia" onClick={() => router.back()}>
                    Go Back
                  </Button>
                </Box>
              )}
              </>}
            </>
          )}
        </Box>
      </VStack>
    </DashboardLayout>
  );
}