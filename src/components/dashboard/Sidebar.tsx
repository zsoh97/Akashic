"use client";

import { VStack, HStack, Icon, Text, Box, useColorModeValue } from "@chakra-ui/react";
import { FiHome, FiUsers, FiCompass, FiBook, FiBookmark, FiSettings } from "react-icons/fi";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { semanticColors } from '@/theme/colors';

// Sidebar navigation items
const sidebarItems = [
  {
    label: "Home",
    icon: FiHome,
    href: "/dashboard",
  },
  {
    label: "Discover",
    icon: FiCompass,
    href: "/dashboard/discover",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const activeBg = useColorModeValue(semanticColors.bg.active, 'gray.700');
  const hoverBg = useColorModeValue(semanticColors.bg.hover, 'gray.700');
  
  return (
    <VStack spacing={2} align="stretch" width="100%" py={4}>
      {sidebarItems.map((item) => {
        const isActive = item.href === "/dashboard" 
          ? pathname === "/dashboard" // Home is active only on exact match
          : pathname.startsWith(item.href); // Other items are active on prefix match
        
        return (
          <Link key={item.href} href={item.href} passHref>
            <Box
              as="div" // Use div instead of "a" to avoid nesting anchor tags
              px={4}
              py={3}
              borderRadius="md"
              bg={isActive ? activeBg : 'transparent'}
              color={isActive ? semanticColors.text.accent : semanticColors.text.secondary}
              _hover={{
                bg: !isActive ? hoverBg : activeBg,
                color: semanticColors.text.accent,
              }}
              cursor="pointer"
              width="100%"
            >
              <HStack spacing={3}>
                <Icon as={item.icon} boxSize={5} />
                <Text>{item.label}</Text>
              </HStack>
            </Box>
          </Link>
        );
      })}
    </VStack>
  );
} 