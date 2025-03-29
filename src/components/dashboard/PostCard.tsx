"use client";

import {
	VStack,
	HStack,
	Text,
	Avatar,
	Link,
	Icon,
	IconButton,
	Button,
	useToast,
} from "@chakra-ui/react";
import { FiArrowUp, FiArrowDown, FiMessageSquare } from "react-icons/fi";
import { DiscussionPost } from "@/types/discussion";
import { formatDate } from "@/utils/date";
import { useVoteDiscussion } from "@/hooks/useVoteDiscussion";
import { SocialMediaShare } from "./SocialMediaShare";

interface PostCardProps {
	post: DiscussionPost
}

export function PostCard({
	post
}: PostCardProps) {
	const toast = useToast();

	const { voteDiscussion } = useVoteDiscussion();
	// Handle voting on a discussion
	const handleVote = async (id: string, vote: 'UP' | 'DOWN' | 'NONE') => {
		await voteDiscussion({
			variables: { id, vote }
		});
	};

	return (
		<VStack p={6} align="stretch" spacing={4}>
			<HStack spacing={3}>
				<Avatar size="sm" name={post.userName} src={post.userAvatar} />
				<VStack align="start" spacing={0}>
					<Link
						fontWeight="medium"
						_hover={{ color: "sepia.500" }}
						onClick={(e) => e.stopPropagation()}
						cursor="pointer"
					>
						{post.userName}
					</Link>
					<Text fontSize="sm" color="warmGray.500">
						{formatDate(post.createdAt)}
					</Text>
				</VStack>
			</HStack>

			<Text>{post.content}</Text>

			<HStack spacing={6}>
				<HStack spacing={2} borderRadius="24px" border="1px" borderColor="sepia.500">
					<IconButton
						borderRadius="100%"
						aria-label="Upvote"
						icon={<Icon as={FiArrowUp} />}
						variant="ghost"
						size="sm"
						color={post.userVote === 'UP' ? "sepia.500" : "warmGray.500"}
						_hover={{ color: "sepia.500" }}
						onClick={() => handleVote(post.id, post.userVote === 'UP' ? 'NONE' : 'UP')}
					/>
					<Text color="warmGray.500" fontWeight="medium">
						{post.likes - post.dislikes}
					</Text>
					<IconButton
						borderRadius="100%"
						aria-label="Downvote"
						icon={<Icon as={FiArrowDown} />}
						variant="ghost"
						size="sm"
						color={post.userVote === 'DOWN' ? "sepia.500" : "warmGray.500"}
						_hover={{ color: "sepia.500" }}
						onClick={() => handleVote(post.id, post.userVote === 'DOWN' ? 'NONE' : 'DOWN')}
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
					{post.replies.length || 0} {post.replies.length || 0 > 1 ? 'Comments' : 'Comment'}
				</Button>

				<SocialMediaShare content={post.content}/>
			</HStack>
		</VStack>
	);
}