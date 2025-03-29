"use client";

import {
	Box,
	Heading,
	Text,
	Flex,
	Stack,
	HStack,
	Button,
	Icon,
	Tag,
	useToast,
} from "@chakra-ui/react";
import { FiBookmark, FiStar } from "react-icons/fi";
import { BookCover } from './BookCover';

interface BookDetailHeaderProps {
	id: string;
	title: string;
	authors: string[];
	coverUrl: string;
	subjects?: string[];
	rating?: number;
	isInReadingList?: boolean;
}

import { useReadingList } from '@/hooks/useReadingList';
import { useRemoveBookFromReadingList } from "@/hooks/useRemoveFromReadingList";

export function BookDetailHeader({
	id,
	title,
	authors,
	coverUrl,
	subjects = [],
	rating,
  	isInReadingList = false,
}: BookDetailHeaderProps) {
	const { addToReadingList, isAddingToList } = useReadingList();
	const { removeBookFromReadingList, isRemovingFromList } = useRemoveBookFromReadingList();
	const toast = useToast();

	console.log(isInReadingList)
	return (
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
				<BookCover
					imageUrl={coverUrl}
					title={title}
					size="lg"
				/>
			</Box>

			<Stack spacing={4} flex="1">
				<Heading as="h1" size="xl">{title}</Heading>
				<Text fontSize="xl" color="gray.600">
					{authors.join(', ') || 'Unknown Author'}
				</Text>

				{rating && (
					<HStack>
						{[...Array(5)].map((_, i) => (
							<Icon
								key={i}
								as={FiStar}
								color={i < Math.round(rating) ? "yellow.400" : "gray.300"}
								fontSize="xl"
							/>
						))}
						<Text ml={2} fontWeight="bold">
							{rating.toFixed(1)}
						</Text>
					</HStack>
				)}

				{subjects.length > 0 && (
					<HStack wrap="wrap" spacing={2} mt={2}>
						{subjects.slice(0, 5).map((subject, index) => (
							<Tag key={index} colorScheme="bronze" size="md">
								{subject}
							</Tag>
						))}
						{subjects.length > 5 && (
							<Tag colorScheme="gray" size="md">
								+{subjects.length - 5} more
							</Tag>
						)}
					</HStack>
				)}

				<HStack spacing={4} pt={2}>
					<Button
						leftIcon={<Icon as={FiBookmark} />}
						colorScheme={isInReadingList ? "red" : "bronze"}
						variant={isInReadingList ? "solid" : "outline"}
						isLoading={isAddingToList || isRemovingFromList}
						onClick={async () => {
							try {
								if (isInReadingList) {
									await removeBookFromReadingList({
										variables: { bookId: id },
									});
									toast({
										title: "Removed from reading list",
										status: "success",
										duration: 3000,
										isClosable: true,
									});
								} else {
									await addToReadingList({
										variables: { bookId: id },
									});
									toast({
										title: "Added to reading list",
										status: "success",
										duration: 3000,
										isClosable: true,
									});
								}
							} catch (error) {
								toast({
									title: "Error",
									description: "Failed to update reading list",
									status: "error",
									duration: 3000,
									isClosable: true,
								});
							}
						}}
					>
						{isInReadingList ? "Remove from List" : "Add to List"}
					</Button>
				</HStack>
			</Stack>
		</Flex>
	);
}