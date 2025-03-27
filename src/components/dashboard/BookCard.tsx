"use client";

import {
	Box,
	Image,
	Text,
	Heading,
	Stack,
	Badge,
	useColorModeValue,
	Flex,
	Icon,
	LinkBox,
	LinkOverlay,
} from "@chakra-ui/react";
import { FiStar } from "react-icons/fi";
import NextLink from "next/link";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface BookCardProps {
	id: string;
	isbn?: string;
	title: string;
	authors: string[];
	coverImage?: string;
	rating?: number;
	categories?: string[];
}

export function BookCard({ id, isbn, title, authors, coverImage, rating, categories }: BookCardProps) {
	const bgColor = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const textColor = useColorModeValue("gray.600", "gray.400");
	
	// Default cover image if none provided
	const defaultCover = "/empty-book-cover.svg";
	
	// Force the image source to be the SVG if coverImage is empty or invalid
	const imageSrc = coverImage || defaultCover;
	
	return (
		<MotionBox
			whileHover={{ y: -5 }}
			transition={{ duration: 0.2 }}
		>
			<LinkBox
				as="article"
				maxW="200px"
				borderWidth="1px"
				borderRadius="lg"
				overflow="hidden"
				bg={bgColor}
				borderColor={borderColor}
				boxShadow="sm"
				transition="all 0.2s"
				_hover={{ boxShadow: "md", borderColor: "sepia.300" }}
			>
				<Image
					src={imageSrc}
					alt={`Cover for ${title}`}
					height="240px"
					width="100%"
					objectFit="cover"
					fallbackSrc={defaultCover}
					onError={(e) => {
						// If the image fails to load, explicitly set the src to our SVG
						const target = e.target as HTMLImageElement;
						target.src = defaultCover;
					}}
				/>
				
				<Box p={4}>
					<Stack spacing={2}>
						<Heading as="h3" size="sm" noOfLines={2} lineHeight="tight">
							<LinkOverlay as={NextLink} href={`/dashboard/books/isbn/${isbn || id}`}>
								{title}
							</LinkOverlay>
						</Heading>
						
						<Text fontSize="sm" color={textColor} noOfLines={1}>
							{authors?.join(", ") || "Unknown Author"}
						</Text>
						
						{rating && (
							<Flex align="center">
								<Icon as={FiStar} color="yellow.400" mr={1} />
								<Text fontSize="sm" fontWeight="medium">
									{rating.toFixed(1)}
								</Text>
							</Flex>
						)}
						
						{categories && categories.length > 0 && (
							<Flex wrap="wrap" gap={1} mt={1}>
								{categories.slice(0, 2).map((category, index) => (
									<Badge key={index} colorScheme="sepia" fontSize="xs">
										{category}
									</Badge>
								))}
								{categories.length > 2 && (
									<Badge colorScheme="gray" fontSize="xs">
										+{categories.length - 2}
									</Badge>
								)}
							</Flex>
						)}
					</Stack>
				</Box>
			</LinkBox>
		</MotionBox>
	);
}
