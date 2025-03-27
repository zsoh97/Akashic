"use client";

import {
  Box,
  Flex,
  Stack,
  HStack,
  Divider,
  Skeleton,
  AspectRatio,
} from "@chakra-ui/react";

export function BookDetailSkeleton() {
  return (
    <>
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
          <AspectRatio ratio={2/3}>
            <Skeleton height="100%" width="100%" borderRadius="lg" />
          </AspectRatio>
        </Box>
        
        <Stack spacing={4} flex="1">
          {/* <SkeletonText noOfLines={1} skeletonHeight={8} width="80%" /> */}
          {/* <SkeletonText noOfLines={1} skeletonHeight={6} width="60%" /> */}
          
          <Skeleton height="24px" width="120px" />
          
          <HStack wrap="wrap" spacing={2}>
            <Skeleton height="24px" width="100px" />
            <Skeleton height="24px" width="80px" />
            <Skeleton height="24px" width="120px" />
          </HStack>
          
          <HStack spacing={4} pt={2}>
            <Skeleton height="40px" width="150px" />
            <Skeleton height="40px" width="120px" />
            <Skeleton height="40px" width="100px" />
          </HStack>
        </Stack>
      </Flex>
      
      <Divider my={6} />
      
      <Box>
        <Skeleton height="24px" width="150px" mb={4} />
        {/* <SkeletonText noOfLines={8} spacing={4} skeletonHeight={4} /> */}
      </Box>
      
      <Divider my={6} />
      
      <Skeleton height="200px" borderRadius="lg" />
      
      <HStack spacing={4} pt={6}>
        <Skeleton height="40px" width="200px" />
        <Skeleton height="40px" width="150px" />
      </HStack>
    </>
  );
} 