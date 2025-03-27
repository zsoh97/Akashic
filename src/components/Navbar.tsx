"use client";

import {
	Box,
	Flex,
	HStack,
	Button,
	useColorModeValue,
	Container,
	Heading,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
	InputGroup,
	InputLeftElement,
	Input,
	useDisclosure,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	VStack,
	Spacer,
	Text,
	Avatar,
	Spinner,
	Divider,
	useOutsideClick,
	Image,
	Center,
} from "@chakra-ui/react";
import { useRouter, usePathname } from 'next/navigation'
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FiUser, FiMenu, FiSearch } from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/hooks/useDebounce';
import { semanticColors } from '@/theme/colors';

interface SearchSuggestion {
	id: string;
	type: 'book' | 'user';
	title?: string;
	name?: string;
	image?: string;
	author?: string;
	isbn?: string;
}

export function Navbar() {
	const router = useRouter()
	const pathname = usePathname()
	const { isOpen, onOpen, onClose } = useDisclosure()
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);
	
	const debouncedQuery = useDebounce(query, 300);

	useOutsideClick({
		ref: searchRef,
		handler: () => setShowSuggestions(false),
	});

	const [session, setSession] = useState<any>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		return () => subscription.unsubscribe();
	}, [supabase.auth]);


	// Search for suggestions when query changes
	useEffect(() => {
		async function fetchSuggestions() {
			if (!debouncedQuery || debouncedQuery.length < 1) {
				setSuggestions([]);
				setShowSuggestions(false);
				return;
			}
			
			setIsSearching(true);
			
			try {
				// Search for books via Google Books API
				const bookResponse = await fetch(
					`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(debouncedQuery)}&maxResults=3`
				);
				const bookData = await bookResponse.json();
				
				// Format book suggestions
				const bookSuggestions: SearchSuggestion[] = bookData.items 
					? bookData.items.map((book: any) => {
						// Extract ISBN from industryIdentifiers
						let isbn = '';
						if (book.volumeInfo.industryIdentifiers) {
							// Try to get ISBN-13 first, then ISBN-10
							const isbn13 = book.volumeInfo.industryIdentifiers.find(
								(id: any) => id.type === 'ISBN_13'
							);
							const isbn10 = book.volumeInfo.industryIdentifiers.find(
								(id: any) => id.type === 'ISBN_10'
							);
							isbn = isbn13?.identifier || isbn10?.identifier || '';
						}
						
						return {
							id: book.id,
							type: 'book',
							title: book.volumeInfo.title,
							author: book.volumeInfo.authors?.[0] || 'Unknown Author',
							image: book.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') || '/empty-book-cover.svg',
							isbn: isbn
						};
					})
					: [];
					
				// In a real app, you would also search for users here
				// For now, we'll just use some dummy user data
				const userSuggestions: SearchSuggestion[] = debouncedQuery.length > 3 
					? [
						{
							id: 'user-1',
							type: 'user' as const,
							name: 'Jane Reader',
							image: '/avatars/jane.jpg',
						},
						{
							id: 'user-2',
							type: 'user' as const,
							name: 'John Bookworm',
							image: '/avatars/john.jpg',
						}
					].filter(user => 
						user.name?.toLowerCase().includes(debouncedQuery.toLowerCase())
					)
					: [];
					
				setSuggestions([...bookSuggestions, ...userSuggestions]);
				setShowSuggestions(true);
			} catch (error) {
				console.error('Error fetching search suggestions:', error);
				setSuggestions([]);
			} finally {
				setIsSearching(false);
			}
		}

		fetchSuggestions();
	}, [debouncedQuery]);

	const handleSignOut = async () => {
		try {
			await supabase.auth.signOut()
			// Clear any local storage or cookies
			localStorage.clear()
			// Force reload to clear any cached auth state
			window.location.href = '/'
		} catch (error) {
			console.error('Error signing out:', error)
		}
	}

	const handleSearch = (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (query.trim()) {
			router.push(`/search?q=${encodeURIComponent(query)}`);
			setShowSuggestions(false);
		}
	}

	const handleSuggestionClick = (suggestion: SearchSuggestion) => {
		if (suggestion.type === 'book') {
			router.push(`/dashboard/books/isbn/${suggestion.isbn}`);
		} else if (suggestion.type === 'user') {
			router.push(`/dashboard/users/${suggestion.id}`);
		}
		setShowSuggestions(false);
	}

	const handleSeeAllResults = () => {
		router.push(`/search?q=${encodeURIComponent(query)}`);
		setShowSuggestions(false);
	};

	const bgColor = useColorModeValue(semanticColors.bg.main, "gray.800")
	const borderColor = useColorModeValue(semanticColors.border.light, "gray.700")
	const inputBg = useColorModeValue(semanticColors.bg.hover, "gray.700")
	const suggestionsBg = useColorModeValue("white", "gray.800")
	const hoverBg = useColorModeValue(semanticColors.bg.hover, "gray.700")

	return (
		<Box
			bg={bgColor}
			borderBottom="1px"
			borderColor={borderColor}
			py={4}
			position="fixed"
			w="full"
			top={0}
			zIndex="sticky"
			height="72px"
		>
			<Container maxW="container.xl" h="100%">
				<Flex alignItems="center" h="100%">
					{/* Mobile menu button */}
					<IconButton
						display={{ base: "flex", md: "none" }}
						onClick={onOpen}
						variant="ghost"
						aria-label="open menu"
						icon={<FiMenu />}
					/>

					{/* Logo */}
					<Link href="/dashboard" passHref>
						<Flex 
							align="center" 
							transition="transform 0.2s"
							_hover={{ transform: 'scale(1.05)' }}
						>
							<Image 
								src="/AkashicLogo.svg" 
								alt="Akashic Logo" 
								height="36px"
								width="auto"
								mr={2}
							/>
						</Flex>
					</Link>

					<Spacer />

					{/* Search Bar */}
					<Box 
						as="form" 
						onSubmit={handleSearch}
						width={{ base: "auto", md: "500px" }}
						mx={4}
						position="relative"
						ref={searchRef}
					>
						<InputGroup size={{ base: "md", md: "lg" }}>
							<InputLeftElement pointerEvents="none">
								<FiSearch color="bronze.300" />
							</InputLeftElement>
							<Input
								placeholder="Search books..."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								borderRadius="full"
								bg={inputBg}
								onFocus={() => debouncedQuery && setShowSuggestions(true)}
							/>
						</InputGroup>

						{/* Search Suggestions */}
						{showSuggestions && (
							<Box
								position="absolute"
								top="100%"
								left={0}
								right={0}
								mt={2}
								bg={suggestionsBg}
								boxShadow="lg"
								borderRadius="md"
								zIndex={10}
								maxH="400px"
								overflowY="auto"
							>
								{isSearching ? (
									<Center p={4}>
										<Spinner size="sm" mr={2} />
										<Text>Searching...</Text>
									</Center>
) : (
    <>
        {suggestions.length > 0 ? (
            <VStack align="stretch" spacing={0} divider={<Divider />}>
                {suggestions.filter(s => s.type === 'book').length > 0 && (
                    <>
                        <Text fontSize="xs" fontWeight="bold" p={2} color="gray.500">
                            BOOKS
                        </Text>
                        {suggestions
                            .filter(s => s.type === 'book')
                            .map(suggestion => (
                                <Box 
                                    key={`${suggestion.type}-${suggestion.id}`}
                                    p={3}
                                    cursor="pointer"
                                    _hover={{ bg: hoverBg }}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    <Flex align="center">
                                        <Box 
                                            width="40px" 
                                            height="60px" 
                                            mr={3}
                                            backgroundImage={`url(${suggestion.image})`}
                                            backgroundSize="cover"
                                            backgroundPosition="center"
                                            borderRadius="sm"
                                        />
                                        <Box>
                                            <Text fontWeight="medium" noOfLines={1}>
                                                {suggestion.title}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {suggestion.author}
                                            </Text>
                                        </Box>
                                    </Flex>
                                </Box>
                            ))
                        }
                    </>
                )}
                
                {suggestions.filter(s => s.type === 'user').length > 0 && (
                    <>
                        <Divider />
                        <Text fontSize="xs" fontWeight="bold" p={2} color="gray.500">
                            USERS
                        </Text>
                        {suggestions
                            .filter(s => s.type === 'user')
                            .map(suggestion => (
                                <Box 
                                    key={`${suggestion.type}-${suggestion.id}`}
                                    p={3}
                                    cursor="pointer"
                                    _hover={{ bg: hoverBg }}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    <Flex align="center">
                                        <Avatar size="sm" name={suggestion.name} src={suggestion.image} mr={3} />
                                        <Text fontWeight="medium">{suggestion.name}</Text>
                                    </Flex>
                                </Box>
                            ))
                        }
                    </>
                )}
                
                <Box 
                    p={3} 
                    cursor="pointer" 
                    _hover={{ bg: hoverBg }}
                    onClick={handleSeeAllResults}
                >
                    <Flex align="center" justify="center" color="bronze.500">
                        <FiSearch />
                        <Text ml={2}>See all results for "{query}"</Text>
                    </Flex>
                </Box>
            </VStack>
        ) : (
            <Box p={4} textAlign="center">
                <Text>No results found</Text>
            </Box>
        )}
    </>
)}
							</Box>
						)}
					</Box>

					<Spacer />

					{/* User Menu or Auth Buttons */}
					{session ? (
						<Menu>
							<MenuButton
								as={IconButton}
								icon={<FiUser />}
								variant="ghost"
								rounded="full"
							/>
							<MenuList>
								<MenuItem as={Link} href="/dashboard/profile">
									Profile
								</MenuItem>
								<MenuItem onClick={handleSignOut}>
									Sign Out
								</MenuItem>
							</MenuList>
						</Menu>
					) : (
						<HStack spacing={4}>
							<Button
								as={Link}
								href="/auth?mode=login"
								variant="ghost"
								size="sm"
							>
								Log In
							</Button>
							<Button
								as={Link}
								href="/auth?mode=signup"
								variant="primary"
								size="sm"
							>
								Sign Up
							</Button>
						</HStack>
					)}
				</Flex>
			</Container>

			{/* Mobile Navigation Drawer */}
			<Drawer isOpen={isOpen} placement="left" onClose={onClose}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader borderBottomWidth="1px">
						<Flex align="center">
							<Image 
								src="/AkashicLogo.svg" 
								alt="Akashic Logo" 
								height="30px"
								width="auto"
								mr={2}
							/>
							<Heading as="h2" size="md" color="bronze.600">Akashic</Heading>
						</Flex>
					</DrawerHeader>
					<DrawerBody>
						<VStack spacing={4} align="stretch" mt={4}>
							<Button
								as={Link}
								href="/dashboard"
								variant="ghost"
								justifyContent="flex-start"
								width="full"
								isActive={pathname === '/dashboard'}
								onClick={onClose}
							>
								Feed
							</Button>
							<Button
								as={Link}
								href="/dashboard/following"
								variant="ghost"
								justifyContent="flex-start"
								width="full"
								isActive={pathname === '/dashboard/following'}
								onClick={onClose}
							>
								Following
							</Button>
							<Button
								as={Link}
								href="/dashboard/discover"
								variant="ghost"
								justifyContent="flex-start"
								width="full"
								isActive={pathname === '/dashboard/discover'}
								onClick={onClose}
							>
								Discover
							</Button>
						</VStack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</Box>
	);
}