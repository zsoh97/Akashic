"use client";

import {
  Box,
  Heading,
  Text,
  Flex,
  Stack,
  HStack,
  Button,
  Icon,
  Tag,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiBookmark, FiHeart, FiStar } from "react-icons/fi";
import { BookCover } from './BookCover';
import { semanticColors } from '@/theme/colors';

interface BookDetailHeaderProps {
  title: string;
  authors: string[];
  coverUrl: string;
  subjects?: string[];
  rating?: number;
}

export function BookDetailHeader({ 
  title, 
  authors, 
  coverUrl, 
  subjects = [], 
  rating 
}: BookDetailHeaderProps) {
  const borderColor = useColorModeValue(semanticColors.border.light, 'gray.700');
  
  return (
    <Flex 
      direction={{ base: 'column', md: 'row' }} 
      gap={{ base: 6, md: 8 }} 
      align={{ base: 'center', md: 'flex-start' }}
    >
      <Box 
        width={{ base: '200px', md: '240px' }}
        borderRadius="lg"
        overflow="hidden"
      >
        <BookCover 
          imageUrl={coverUrl} 
          title={title}
          size="lg"
        />
      </Box>
      
      <Stack spacing={4} flex="1">
        <Heading as="h1" size="xl">{title}</Heading>
        <Text fontSize="xl" color="gray.600">
          {authors.join(', ') || 'Unknown Author'}
        </Text>
        
        {rating && (
          <HStack>
            {[...Array(5)].map((_, i) => (
              <Icon 
                key={i} 
                as={FiStar} 
                color={i < Math.round(rating) ? "yellow.400" : "gray.300"} 
                fontSize="xl"
              />
            ))}
            <Text ml={2} fontWeight="bold">
              {rating.toFixed(1)}
            </Text>
          </HStack>
        )}
        
        {subjects.length > 0 && (
          <HStack wrap="wrap" spacing={2} mt={2}>
            {subjects.slice(0, 5).map((subject, index) => (
              <Tag key={index} colorScheme="bronze" size="md">
                {subject}
              </Tag>
            ))}
            {subjects.length > 5 && (
              <Tag colorScheme="gray" size="md">
                +{subjects.length - 5} more
              </Tag>
            )}
          </HStack>
        )}
        
        <HStack spacing={4} pt={2}>
          <Button leftIcon={<FiBookmark />} colorScheme="sepia" size="md">
            Add to Shelf
          </Button>
          <Button leftIcon={<FiHeart />} variant="outline" colorScheme="sepia" size="md">
            Favorite
          </Button>
        </HStack>
      </Stack>
    </Flex>
  );
} 