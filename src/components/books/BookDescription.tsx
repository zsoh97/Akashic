"use client";

import { Box, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import DOMPurify from 'isomorphic-dompurify';
import { semanticColors } from '@/theme/colors';

interface BookDescriptionProps {
  description?: string;
  sectionBg: string;
}

export function BookDescription({ description, sectionBg }: BookDescriptionProps) {
  const borderColor = useColorModeValue(semanticColors.border.light, 'gray.700');
  
  // Function to sanitize HTML
  function sanitizeHTML(html?: string): string {
    if (!html) return '';
    return DOMPurify.sanitize(html);
  }
  
  return (
    <Box 
      p={6} 
      bg={sectionBg} 
      borderRadius="lg"
      boxShadow="sm"
      border="1px"
      borderColor={borderColor}
    >
      <Heading size="md" mb={4}>Description</Heading>
      {description ? (
        <Box 
          className="book-description"
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(description) }}
          sx={{
            'p': {
              marginBottom: '1rem',
            },
            'ul, ol': {
              marginLeft: '1.5rem',
              marginBottom: '1rem',
            },
            'li': {
              marginBottom: '0.5rem',
            },
            'b, strong': {
              fontWeight: 'bold',
            },
            'i, em': {
              fontStyle: 'italic',
            }
          }}
        />
      ) : (
        <Text>No description available.</Text>
      )}
    </Box>
  );
} 