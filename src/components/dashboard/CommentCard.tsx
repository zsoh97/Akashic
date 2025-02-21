"use client";

import { HStack, VStack, Text, Avatar, Link } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface CommentCardProps {
	author: {
		id: string;
		name: string;
		image: string;
	};
	content: string;
	timestamp: string;
}

export function CommentCard({ author, content, timestamp }: CommentCardProps) {
	const router = useRouter();

	return (
		<HStack align="start" spacing={3} width="full">
			<Avatar size="sm" name={author.name} src={author.image} />
			<VStack align="start" spacing={1} flex={1}>
				<HStack spacing={2}>
					<Link
						fontWeight="medium"
						_hover={{ color: "sepia.500" }}
						onClick={() => router.push(`/users/${author.id}`)}
						cursor="pointer"
					>
						{author.name}
					</Link>
					<Text fontSize="sm" color="warmGray.500">
						{timestamp}
					</Text>
				</HStack>
				<Text color="warmGray.700">{content}</Text>
			</VStack>
		</HStack>
	);
}
