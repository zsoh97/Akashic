"use client";

import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import { FiBook } from 'react-icons/fi';
import { useState } from 'react';
import NextImage from 'next/image';
import { semanticColors } from '@/theme/colors';

interface BookCoverProps {
  imageUrl?: string;
  title: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { width: 80, height: 120, fontSize: 'xs' },
  md: { width: 140, height: 210, fontSize: 'sm' },
  lg: { width: 200, height: 300, fontSize: 'md' },
};

export function BookCover({ imageUrl, title, size = 'md' }: BookCoverProps) {
  const { width, height, fontSize } = sizes[size];
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const [imgError, setImgError] = useState(false);
  
  // If no image URL or previous error loading image, show fallback
  if (!imageUrl || imgError) {
    return (
      <Box
        width={`${width}px`}
        height={`${height}px`}
        borderRadius="md"
        overflow="hidden"
        boxShadow="md"
        bg={bgColor}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        p={3}
      >
        <FiBook size="40px" color={textColor} />
        <Text
          mt={2}
          textAlign="center"
          fontWeight="medium"
          fontSize={fontSize}
          color={textColor}
          noOfLines={3}
        >
          {title}
        </Text>
      </Box>
    );
  }
  
  // Update the shadow color for book covers
  const shadowColor = useColorModeValue(
    semanticColors.shadow.bookCover, 
    semanticColors.shadow.bookCoverDark
  );
  
  return (
    <Box
      width={`${width}px`}
      height={`${height}px`}
      borderRadius="md"
      overflow="hidden"
      position="relative"
      boxShadow={shadowColor}
    >
      <NextImage
        src={imageUrl}
        alt={`Cover of ${title}`}
        fill
        sizes={`(max-width: 768px) ${width}px, ${width}px`}
        style={{ objectFit: 'cover' }}
        onError={() => setImgError(true)}
        priority={size === 'lg'} // Prioritize loading larger images
        quality={80}
      />
    </Box>
  );
} 