"use client";

import {
  Box,
  VStack,
  Heading,
  Text,
  Center,
  Icon,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiUsers } from "react-icons/fi";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Link from "next/link";

export default function FollowingPage() {
  const emptyStateBg = useColorModeValue("gray.50", "gray.700");
  
  // This would be replaced with real data from your API
  const following: any[] = [];

  return (
    <DashboardLayout>
      <VStack spacing={8} align="stretch">
        <Heading size="xl">Following</Heading>
        
        {following.length > 0 ? (
          <Box>
            {/* Render following users here */}
            <Text>Your following list will appear here</Text>
          </Box>
        ) : (
          <Center 
            p={8} 
            bg={emptyStateBg} 
            borderRadius="lg"
            flexDirection="column"
            gap={4}
          >
            <Icon as={FiUsers} w={10} h={10} color="gray.400" />
            <VStack spacing={2}>
              <Text color="gray.500" textAlign="center">
                You're not following anyone yet
              </Text>
              <Text color="gray.500" fontSize="sm" textAlign="center">
                Follow other readers to see their updates in your feed
              </Text>
            </VStack>
            <Link href="/dashboard/discover">
              <Button
                leftIcon={<Icon as={FiUsers} />}
                colorScheme="sepia"
                variant="outline"
              >
                Find Readers
              </Button>
            </Link>
          </Center>
        )}
      </VStack>
    </DashboardLayout>
  );
} 