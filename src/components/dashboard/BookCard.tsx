"use client";

import {
	Box,
	VStack,
	Image,
	Heading,
	Text,
	IconButton,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiBookOpen } from "react-icons/fi";
import { useState } from "react";

interface BookCardProps {
	id: string;
	title: string;
	author: string;
	coverImage: string;
	status?: "read" | "want-to-read";
}

export function BookCard({
	id,
	title,
	author,
	coverImage,
	status,
}: BookCardProps) {
	const router = useRouter();
	const [readingStatus, setReadingStatus] = useState<
		"read" | "want-to-read" | null
	>(status || null);
	const borderColor = useColorModeValue("gray.100", "gray.700");

	const handleStatusClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		const newStatus = readingStatus === "read" ? "want-to-read" : "read";
		setReadingStatus(newStatus);
		// Here you would make an API call to update the reading status
	};

	return (
		<Box
			position="relative"
			p={4}
			bg="white"
			borderRadius="lg"
			borderWidth="1px"
			borderColor={borderColor}
			cursor="pointer"
			onClick={() => router.push(`/books/${id}`)}
			transition="all 0.2s"
			_hover={{
				transform: "translateY(-2px)",
				shadow: "md",
				borderColor: "sepia.500",
			}}
		>
			<IconButton
				position="absolute"
				top={6}
				right={6}
				aria-label="Update reading status"
				icon={readingStatus === "read" ? <FiCheckCircle /> : <FiBookOpen />}
				variant="ghost"
				colorScheme="sepia"
				size="sm"
				onClick={handleStatusClick}
				zIndex={2}
				color={readingStatus ? "sepia.500" : "gray.400"}
				_hover={{
					bg: "white",
					color: "sepia.600",
				}}
			/>
			<VStack spacing={3}>
				<Box
					position="relative"
					width="100%"
					height="200px"
					overflow="hidden"
					borderRadius="md"
				>
					<Image
						src={coverImage}
						alt={title}
						objectFit="cover"
						width="100%"
						height="100%"
					/>
				</Box>
				<VStack spacing={1} align="start" width="100%">
					<Heading size="sm" noOfLines={2}>
						{title}
					</Heading>
					<Text fontSize="sm" color="warmGray.600">
						{author}
					</Text>
				</VStack>
			</VStack>
		</Box>
	);
}
