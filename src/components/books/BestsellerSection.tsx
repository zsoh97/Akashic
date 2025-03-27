"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  SimpleGrid,
  Spinner,
  Badge,
  useColorModeValue,
  Select,
  HStack,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { FiChevronRight, FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi';
import { NYTBook, NYT_LISTS } from '@/services/nytBooksService';
import { useNYTBestsellers } from '@/hooks/useNYTBooks';
import { BookCover } from './BookCover';
import { semanticColors } from '@/theme/colors';
import { getBookRoute } from '@/utils/bookRouting';

interface BestsellerSectionProps {
  initialListName?: string;
  title?: string;
  showListSelector?: boolean;
  limit?: number;
  showViewAllButton?: boolean;
  onSeeAllResults?: () => void;
}

export function BestsellerSection({
  initialListName = "hardcover-fiction",
  title = "New York Times Bestsellers",
  showListSelector = true,
  limit = 5, // Default to 5 books
  showViewAllButton = true,
  onSeeAllResults
}: BestsellerSectionProps) {
  const [listName, setListName] = useState(initialListName);
  const { data, isLoading, error } = useNYTBestsellers(listName);
  
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue(semanticColors.border.light, 'gray.700');
  const rankBgColor = useColorModeValue('gray.100', 'gray.700');
  
  const handleBookClick = (book: NYTBook) => {
    const isbn = book.primary_isbn13 || book.primary_isbn10;
    if (isbn) {
      router.push(`/dashboard/books/isbn/${isbn}`);
    } else {
      // Fallback to title + author search
      router.push(`/dashboard/discover?q=${encodeURIComponent(`${book.title} ${book.author}`)}`);
    }
  };
  
  // Function to render rank change indicator
  const renderRankChange = (book: NYTBook) => {
    // If rank_last_week is 0, it means the book is new to the list
    if (book.rank_last_week === 0) {
      return (
        <Tooltip label="New to the list">
          <Badge colorScheme="green" fontSize="xs" ml={1}>NEW</Badge>
        </Tooltip>
      );
    }
    
    const change = book.rank_last_week - book.rank;
    
    if (change > 0) {
      // Book moved up in rank (lower number is better)
      return (
        <Tooltip label={`Up ${change} from last week`}>
          <HStack spacing={0.5} fontSize="xs" color="green.500">
            <Icon as={FiArrowUp} />
            <Text>{change}</Text>
          </HStack>
        </Tooltip>
      );
    } else if (change < 0) {
      // Book moved down in rank
      return (
        <Tooltip label={`Down ${Math.abs(change)} from last week`}>
          <HStack spacing={0.5} fontSize="xs" color="red.500">
            <Icon as={FiArrowDown} />
            <Text>{Math.abs(change)}</Text>
          </HStack>
        </Tooltip>
      );
    } else {
      // Rank unchanged
      return (
        <Tooltip label="No change from last week">
          <HStack spacing={0.5} fontSize="xs" color="gray.500">
            <Icon as={FiMinus} />
          </HStack>
        </Tooltip>
      );
    }
  };

  return (
    <Box>
      <Flex 
        justify="space-between" 
        align="center" 
        mb={6}
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 4, md: 0 }}
      >
        <Heading as="h2" size="lg">{title}</Heading>
        
        {showListSelector && (
          <Select 
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            width={{ base: 'full', md: '300px' }}
          >
            {Object.entries(NYT_LISTS).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </Select>
        )}
      </Flex>
      
      {isLoading ? (
        <Flex justify="center" align="center" py={10}>
          <Spinner size="lg" color={semanticColors.button.primary} />
        </Flex>
      ) : error ? (
        <Box p={6} bg="red.50" color="red.800" borderRadius="md">
          <Heading size="md" mb={2}>Error Loading Bestsellers</Heading>
          <Text>{error.message}</Text>
        </Box>
      ) : (
        <>
          <SimpleGrid columns={{ base: 2, sm: 3, md: 5 }} spacing={6}>
            {data?.books.slice(0, limit).map((book) => (
              <Box 
                key={book.primary_isbn13 || book.primary_isbn10 || book.title}
                onClick={() => handleBookClick(book)}
                cursor="pointer"
                transition="transform 0.2s, box-shadow 0.2s"
                _hover={{ 
                  transform: 'translateY(-5px)',
                  boxShadow: 'md'
                }}
                bg={bgColor}
                borderRadius="lg"
                overflow="hidden"
                border="1px"
                borderColor={borderColor}
                p={4}
              >
                <Flex direction="column" align="center">
                  <Box position="relative" mb={4}>
                    <BookCover 
                      imageUrl={book.book_image} 
                      title={book.title}
                      size="md"
                    />
                    
                    {/* Standardized Ranking Badge */}
                    <Flex
                      position="absolute"
                      top={2}
                      left={2}
                      direction="column"
                      align="center"
                    >
                      <Flex
                        bg={rankBgColor}
                        color="gray.800"
                        borderRadius="md"
                        boxShadow="md"
                        p={1}
                        px={2}
                        fontWeight="bold"
                        fontSize="sm"
                        align="center"
                        justify="center"
                      >
                        #{book.rank}
                      </Flex>
                      <Box mt={1}>
                        {renderRankChange(book)}
                      </Box>
                    </Flex>
                  </Box>
                  <Text fontWeight="bold" textAlign="center" noOfLines={2} mb={1}>
                    {book.title}
                  </Text>
                  <Text fontSize="sm" color="gray.600" textAlign="center" noOfLines={1}>
                    {book.author}
                  </Text>
                </Flex>
              </Box>
            ))}
          </SimpleGrid>
          
          {showViewAllButton && (
            <Button 
              rightIcon={<FiChevronRight />} 
              variant="ghost" 
              colorScheme="bronze" 
              mt={6}
              onClick={() => router.push(`/dashboard/discover/bestsellers/${listName}`)}
            >
              View All Bestsellers
            </Button>
          )}
          
          {onSeeAllResults && (
            <Button 
              variant="link" 
              colorScheme="sepia" 
              onClick={onSeeAllResults}
              mt={2}
            >
              See all results for {title}
            </Button>
          )}
        </>
      )}
    </Box>
  );
}