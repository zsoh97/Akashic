"use client";

import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BestsellerSection } from '@/components/books/BestsellerSection';
import { NYT_LISTS } from '@/services/nytBooksService';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export default function BestsellersPage() {
  // Start with just the first 2 lists
  const [visibleLists, setVisibleLists] = useState(NYT_LISTS.slice(0, 2));
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Create a ref for the loading indicator
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    rootMargin: '100px',
  });
  
  // Load more lists when the loading indicator comes into view
  useEffect(() => {
    const loadMoreLists = async () => {
      if (isIntersecting && visibleLists.length < NYT_LISTS.length && !isLoadingMore) {
        setIsLoadingMore(true);
        
        // Simulate a delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add the next list
        const nextIndex = visibleLists.length;
        if (nextIndex < NYT_LISTS.length) {
          setVisibleLists(prev => [...prev, NYT_LISTS[nextIndex]]);
        }
        
        setIsLoadingMore(false);
      }
    };
    
    loadMoreLists();
  }, [isIntersecting, visibleLists.length, isLoadingMore]);
  
  return (
    <DashboardLayout>
      <VStack spacing={8} align="stretch" width="100%">
        <Heading size="lg" mb={4}>New York Times Bestsellers</Heading>
        
        <Text fontSize="lg" mb={4}>
          Explore the latest bestselling books across different categories, updated weekly by The New York Times.
        </Text>
        
        {visibleLists.map(list => (
          <Box key={list.id} mb={8}>
            <BestsellerSection 
              initialListName={list.id} 
              title={list.name} 
              showListSelector={false}
              limit={5}
              showViewAllButton={true}
            />
          </Box>
        ))}
        
        {/* Loading indicator */}
        {visibleLists.length < NYT_LISTS.length && (
          <Box ref={targetRef} py={8} textAlign="center">
            {isLoadingMore ? (
              <Center>
                <Spinner size="lg" color="bronze.500" />
                <Text ml={4}>Loading more bestsellers...</Text>
              </Center>
            ) : (
              <Text color="gray.500">Scroll to load more bestseller lists</Text>
            )}
          </Box>
        )}
      </VStack>
    </DashboardLayout>
  );
} 