"use client";

import { useRouter } from 'next/navigation';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { FiHome, FiUsers, FiCompass } from "react-icons/fi";
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { BestsellerSection } from '@/components/books/BestsellerSection';
import { GenreExplorer } from '@/components/books/GenreExplorer';
import { NYT_LISTS } from '@/services/nytBooksService';

// Sidebar navigation items
const sidebarItems = [
  { icon: FiHome, label: "Feed", href: "/dashboard" },
  { icon: FiUsers, label: "Following", href: "/dashboard/following" },
  { icon: FiCompass, label: "Discover", href: "/dashboard/discover" },
];

export default function DiscoverPage() {
  const router = useRouter();

  // Function to handle genre selection
  const handleGenreSelect = (genre: string) => {
    router.push(`/search?q=${encodeURIComponent(genre)}`);
  };

  // Function to handle "See all results" clicks
  const handleSeeAllResults = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <DashboardLayout>
      <VStack spacing={8} align="stretch" width="100%" minHeight="800px">
        <Heading size="lg" mb={6}>Discover New Books</Heading>
        
        <Tabs variant="soft-rounded" colorScheme="sepia">
          <TabList mb={4}>
            <Tab>Genres</Tab>
            <Tab>Bestsellers</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel px={0}>
              {/* Genres Tab */}
              <VStack spacing={8} align="stretch">
                <GenreExplorer onGenreSelect={handleGenreSelect} />
              </VStack>
            </TabPanel>
            
            <TabPanel px={0}>
              {/* Bestsellers Tab */}
              <VStack spacing={8} align="stretch">
                <Box mb={4}>
                  <Text fontSize="lg" mb={4}>
                    Explore the New York Times bestseller lists, updated weekly.
                  </Text>
                </Box>
                
                {NYT_LISTS.slice(0, 4).map(list => (
                  <BestsellerSection 
                    key={list.id}
                    initialListName={list.id} 
                    title={list.name} 
                    showListSelector={false}
                    onSeeAllResults={() => handleSeeAllResults(list.name)}
                  />
                ))}
                
                <Button 
                  colorScheme="sepia" 
                  size="lg" 
                  width="full"
                  onClick={() => router.push('/dashboard/discover/bestsellers')}
                >
                  View All Bestseller Lists
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </DashboardLayout>
  );
} 