"use client";

import {
  Container,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ReactNode, useEffect } from "react";
import { useNavbarContext } from "@/contexts/NavbarContext";

interface DashboardLayoutProps {
  children: ReactNode;
  showSearch?: boolean;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

export function DashboardLayout({ 
  children, 
  showSearch = false,
  searchQuery = '',
  onSearch
}: Readonly<DashboardLayoutProps>) {
  const { setShowSearch, setSearchQuery, setOnSearch } = useNavbarContext();
  
  // Update navbar search state when props change
  useEffect(() => {
    setShowSearch(showSearch);
    setSearchQuery(searchQuery);
    setOnSearch(onSearch || (() => {}));
    
    // Cleanup when component unmounts
    return () => {
      setShowSearch(false);
      setSearchQuery('');
      setOnSearch(() => {});
    };
  }, [showSearch, searchQuery, onSearch, setShowSearch, setSearchQuery, setOnSearch]);
  
  return (
    <Container maxW="container.xl" py={8} pt="100px">
      <Grid templateColumns={{ base: "1fr", md: "240px 1fr" }} gap={8}>
        {/* Sidebar */}
        <GridItem display={{ base: 'none', md: 'block' }}>
          <Sidebar />
        </GridItem>

        {/* Main Content */}
        <GridItem>
          {children}
        </GridItem>
      </Grid>
    </Container>
  );
} 