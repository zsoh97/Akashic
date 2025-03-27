"use client";

import { Box, Heading, Flex, Text, Stack, useColorModeValue } from "@chakra-ui/react";
import { semanticColors } from '@/theme/colors';

interface BookDetailsProps {
  publisher?: string;
  publishDate?: string;
  pageCount?: number;
  isbn10?: string;
  isbn13?: string;
  googleBooksId?: string;
}

export function BookDetails({ 
  publisher, 
  publishDate, 
  pageCount, 
  isbn10, 
  isbn13, 
  googleBooksId,
}: BookDetailsProps) {
  const borderColor = useColorModeValue(semanticColors.border.light, 'gray.700');
  const sectionBg = useColorModeValue('gray.50', 'gray.700');
  
  return (
    <Box 
      p={6} 
      bg={sectionBg} 
      borderRadius="lg"
      boxShadow="sm"
      border="1px"
      borderColor={borderColor}
    >
      <Heading size="md" mb={4}>Book Details</Heading>
      <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
        <Box flex="1">
          <Stack spacing={3}>
            <Flex justify="space-between">
              <Text fontWeight="bold">Publisher:</Text>
              <Text>{publisher || 'Unknown'}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">Publication Date:</Text>
              <Text>{publishDate || 'Unknown'}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">Pages:</Text>
              <Text>{pageCount || 'Unknown'}</Text>
            </Flex>
          </Stack>
        </Box>
        <Box flex="1">
          <Stack spacing={3}>
            <Flex justify="space-between">
              <Text fontWeight="bold">ISBN-13:</Text>
              <Text>{isbn13 || 'N/A'}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">ISBN-10:</Text>
              <Text>{isbn10 || 'N/A'}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">Google Books ID:</Text>
              <Text>{googleBooksId || 'N/A'}</Text>
            </Flex>
          </Stack>
        </Box>
      </Flex>
    </Box>
  );
} 