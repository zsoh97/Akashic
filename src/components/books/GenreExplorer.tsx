"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { 
  FiBookOpen, FiHeart, FiCompass, FiCoffee, 
  FiZap, FiStar, FiGlobe, FiFeather, FiActivity 
} from 'react-icons/fi';

// Popular genres with icons
const GENRES = [
  { id: 'fiction', name: 'Fiction', icon: FiBookOpen, color: 'sepia.500' },
  { id: 'romance', name: 'Romance', icon: FiHeart, color: 'red.400' },
  { id: 'mystery', name: 'Mystery', icon: FiCompass, color: 'purple.500' },
  { id: 'science+fiction', name: 'Sci-Fi', icon: FiZap, color: 'blue.500' },
  { id: 'fantasy', name: 'Fantasy', icon: FiFeather, color: 'teal.500' },
  { id: 'biography', name: 'Biography', icon: FiCoffee, color: 'orange.500' },
  { id: 'history', name: 'History', icon: FiGlobe, color: 'green.500' },
  { id: 'self-help', name: 'Self-Help', icon: FiStar, color: 'yellow.500' },
  { id: 'thriller', name: 'Thriller', icon: FiActivity, color: 'red.600' },
];

interface GenreExplorerProps {
  onGenreSelect?: (genre: string) => void;
}

export function GenreExplorer({ onGenreSelect }: GenreExplorerProps) {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const tileBg = useColorModeValue('gray.50', 'gray.700');
  
  const handleGenreClick = (genre: string) => {
    if (onGenreSelect) {
      onGenreSelect(genre);
    }
  };
  
  return (
    <Box 
      bg={bgColor} 
      borderRadius="lg" 
      boxShadow="sm"
      border="1px"
      borderColor={borderColor}
      p={6}
      mb={8}
    >
      <Heading size="md" mb={6}>Explore by Genre</Heading>
      
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 9 }} spacing={4}>
        {GENRES.map((genre) => (
          <Box 
            key={genre.id}
            bg={tileBg}
            borderRadius="lg"
            p={4}
            textAlign="center"
            cursor="pointer"
            onClick={() => handleGenreClick(genre.id)}
            transition="all 0.2s"
            _hover={{ 
              transform: 'translateY(-5px)',
              boxShadow: 'md',
              bg: useColorModeValue('gray.100', 'gray.600')
            }}
          >
            <Icon 
              as={genre.icon} 
              boxSize={8} 
              color={genre.color} 
              mb={2} 
            />
            <Text fontWeight="medium">{genre.name}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
} 