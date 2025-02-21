"use client";

import {
	Box,
	Container,
	Heading,
	Text,
	SimpleGrid,
	Button,
	VStack,
	Image,
	useColorModeValue,
	Icon,
	Flex,
} from "@chakra-ui/react";
import { FiBook, FiStar, FiUsers, FiArrowRight } from "react-icons/fi";
import { signIn } from "next-auth/react";
import { Navbar } from "@/components/Navbar";

export default function Home() {
	const cardBg = useColorModeValue("white", "gray.800");
	const textColor = useColorModeValue("gray.600", "gray.400");
	const sectionBg = useColorModeValue("gray.50", "gray.900");

	return (
		<>
			<Navbar />
			<Box as="main" pt={{ base: "70px", md: "80px" }}>
				{/* Hero Section */}
				<Box
					position="relative"
					height={{ base: "600px", md: "700px" }}
					color="white"
					overflow="hidden"
				>
					{/* Background Image */}
					<Box
						position="absolute"
						top={0}
						left={0}
						right={0}
						bottom={0}
						bgImage="url('/hero-bg.jpg')"
						bgSize="cover"
						bgPosition="center"
						_after={{
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							bg: "rgba(0, 0, 0, 0.5)", // Dark overlay
						}}
					/>

					{/* Content */}
					<Container
						maxW="container.xl"
						position="relative"
						zIndex={1}
						height="100%"
						display="flex"
						alignItems="center"
					>
						<VStack spacing={8} align="center" textAlign="center" w="full">
							<Heading
								as="h1"
								fontSize={{ base: "4xl", md: "6xl" }}
								fontWeight="extrabold"
								lineHeight="1.2"
								letterSpacing="tight"
							>
								Your Next Great Read
								<Box
									as="span"
									display="block"
									fontSize={{ base: "3xl", md: "5xl" }}
								>
									Starts Here
								</Box>
							</Heading>
							<Text
								fontSize={{ base: "lg", md: "xl" }}
								maxW="2xl"
								opacity={0.9}
							>
								Join our community of book lovers where we discuss, recommend,
								and explore amazing books together.
							</Text>
							<Button
								size="lg"
								variant="primary"
								rightIcon={<Icon as={FiArrowRight} />}
								fontWeight="bold"
								rounded="full"
								fontSize="lg"
								py={7}
								px={10}
								onClick={() => signIn(undefined, { callbackUrl: "/" })}
							>
								Join the Club
							</Button>
						</VStack>
					</Container>
				</Box>

				{/* Features Section */}
				<Container maxW="container.xl" py={24}>
					<SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
						{[
							{
								icon: FiBook,
								title: "Book Discussions",
								description:
									"Engage in meaningful discussions about your favorite books with fellow readers.",
							},
							{
								icon: FiStar,
								title: "Popular Recommendations",
								description:
									"Discover top-rated books recommended by our community members.",
							},
							{
								icon: FiUsers,
								title: "Community Events",
								description:
									"Join virtual book clubs, author interviews, and reading challenges.",
							},
						].map((feature, index) => (
							<VStack
								key={index}
								spacing={6}
								align="start"
								p={8}
								rounded="2xl"
								bg={cardBg}
								borderWidth="1px"
								borderColor="gray.100"
							>
								<Flex bg="purple.50" color="purple.500" p={3} rounded="xl">
									<Icon as={feature.icon} w={6} h={6} />
								</Flex>
								<Heading as="h3" size="md">
									{feature.title}
								</Heading>
								<Text color={textColor}>{feature.description}</Text>
							</VStack>
						))}
					</SimpleGrid>
				</Container>

				{/* Featured Books Section */}
				<Box bg={sectionBg} py={24}>
					<Container maxW="container.xl">
						<VStack spacing={16}>
							<VStack spacing={4} textAlign="center">
								<Heading
									as="h2"
									fontSize={{ base: "3xl", md: "4xl" }}
									fontWeight="bold"
								>
									Featured Books This Month
								</Heading>
								<Text color={textColor} maxW="2xl">
									Discover our carefully curated selection of must-read books
								</Text>
							</VStack>

							<SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
								{[1, 2, 3, 4].map((book) => (
									<VStack
										key={book}
										bg={cardBg}
										p={4}
										rounded="2xl"
										borderWidth="1px"
										borderColor="gray.100"
										spacing={4}
									>
										<Box
											width="full"
											height="300px"
											position="relative"
											overflow="hidden"
											rounded="xl"
										>
											<Image
												src={`https://picsum.photos/seed/${book}/300/400`}
												alt="Book cover"
												objectFit="cover"
												width="100%"
												height="100%"
											/>
										</Box>
										<VStack spacing={2} align="start" width="full">
											<Heading as="h4" size="md">
												Book Title {book}
											</Heading>
											<Text color={textColor}>Author Name</Text>
											<Button
												variant="ghost"
												colorScheme="purple"
												size="sm"
												width="full"
												rightIcon={<Icon as={FiArrowRight} />}
												onClick={() => signIn(undefined, { callbackUrl: "/" })}
											>
												Learn More
											</Button>
										</VStack>
									</VStack>
								))}
							</SimpleGrid>
						</VStack>
					</Container>
				</Box>

				{/* CTA Section */}
				<Box py={24}>
					<Container maxW="container.md" textAlign="center">
						<VStack spacing={8}>
							<Heading
								as="h2"
								fontSize={{ base: "3xl", md: "4xl" }}
								fontWeight="bold"
							>
								Ready to Start Reading Together?
							</Heading>
							<Text fontSize="lg" color={textColor} maxW="2xl">
								Join our book club today and connect with readers from around
								the world.
							</Text>
							<Button
								size="lg"
								variant="primary"
								rounded="full"
								rightIcon={<Icon as={FiArrowRight} />}
								fontSize="lg"
								py={7}
								px={10}
								onClick={() => signIn(undefined, { callbackUrl: "/" })}
							>
								Sign Up Now
							</Button>
						</VStack>
					</Container>
				</Box>
			</Box>
		</>
	);
}
