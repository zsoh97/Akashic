"use client";

import {
	HStack,
	VStack,
	Text,
	Avatar,
	Link,
	Icon,
	IconButton,
	Button,
} from "@chakra-ui/react";
import { FiArrowUp, FiArrowDown, FiMessageSquare } from "react-icons/fi";
import { useVoteComment } from "@/hooks/useVoteComment";
import { formatDate } from "@/utils/date";
import { SocialMediaShare } from "./SocialMediaShare";
import { Comment } from "@/types/discussion";

interface CommentCardProps {
	id: string;
	author: {
		id: string;
		name: string;
		image: string;
	};
	content: string;
	replies?: Comment[];
	userVote?: 'UP' | 'DOWN' | 'NONE' | null;
	likes?: number;
	dislikes?: number;
	createdAt: string;
}

export function CommentCard({ id, author, content, createdAt, userVote = 'NONE', likes = 0, dislikes = 0, replies = [] }: CommentCardProps) {
	const { voteComment } = useVoteComment();

	const handleVote = async (vote: 'UP' | 'DOWN' | 'NONE') => {
		await voteComment({
			variables: { id, vote }
		});
	};

	console.log(likes, dislikes)
	return (
		<VStack p={6} align="stretch" spacing={4}>
			<HStack spacing={3}>
				<Avatar size="sm" name={author.name} src={author.image} />
				<VStack align="start" spacing={0}>
					<Link
						fontWeight="medium"
						_hover={{ color: "sepia.500" }}
						onClick={(e) => e.stopPropagation()}
						cursor="pointer"
					>
						{author.name}
					</Link>
					<Text fontSize="sm" color="warmGray.500">
						{formatDate(createdAt)}
					</Text>
				</VStack>
			</HStack>

			<Text>{content}</Text>

			<HStack spacing={6}>
				<HStack spacing={2} borderRadius="24px" border="1px" borderColor="sepia.500">
					<IconButton
						borderRadius="100%"
						aria-label="Upvote"
						icon={<Icon as={FiArrowUp} />}
						variant="ghost"
						size="sm"
						color={userVote === 'UP' ? "sepia.500" : "warmGray.500"}
						_hover={{ color: "sepia.500" }}
						onClick={() => handleVote(userVote === 'UP' ? 'NONE' : 'UP')}
					/>
					<Text color="warmGray.500" fontWeight="medium">
						{likes - dislikes}
					</Text>
					<IconButton
						borderRadius="100%"
						aria-label="Downvote"
						icon={<Icon as={FiArrowDown} />}
						variant="ghost"
						size="sm"
						color={userVote === 'DOWN' ? "sepia.500" : "warmGray.500"}
						_hover={{ color: "sepia.500" }}
						onClick={() => handleVote(userVote === 'DOWN' ? 'NONE' : 'DOWN')}
					/>
				</HStack>

				<Button
					borderRadius="24px" border="1px" borderColor="sepia.500"
					variant="ghost"
					size="sm"
					leftIcon={<Icon as={FiMessageSquare} />}
					color="warmGray.500"
					_hover={{ color: "sepia.500" }}
					onClick={(e) => e.stopPropagation()}
				>
					{replies.length || 0} {replies.length || 0 > 1 ? 'Comments' : 'Comment'}
				</Button>

				<SocialMediaShare content={content}/>
			</HStack>
		</VStack>
	);
}
