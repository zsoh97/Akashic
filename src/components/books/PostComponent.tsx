import { formatDate } from "@/utils/date";
import { Box, Flex, Text, useColorModeValue, IconButton, Avatar, Icon, Heading, Button, FormControl, Textarea, HStack, useToast } from "@chakra-ui/react";
import { FiChevronUp, FiChevronDown, FiClock, FiMessageSquare, FiShare2 } from "react-icons/fi";
import { CommentThread } from "../dashboard/CommentThread";
import { semanticColors } from "@/theme/colors";
import { z } from "zod";
import { useVoteDiscussion } from "@/hooks/useVoteDiscussion";
import { useCreateComment } from "@/hooks/useCreateComment";
import { useRouter } from "next/navigation";
import { getOrigin } from "@/utils/client";
import { DiscussionPost } from "@/types/discussion";

export type PostComponentProps = {
	post: DiscussionPost;
	activeCommentId: string | null; // Add this prop to track the active comment
	setActiveCommentId: (id: string | null) => void;
};

export const PostComponent = ({ post, setActiveCommentId, activeCommentId }: PostComponentProps) => {
	const router = useRouter();
	const toast = useToast();
	const borderColor = useColorModeValue(semanticColors.border.light, 'gray.700');
	const tabBg = useColorModeValue('white', 'gray.800');
	const voteBgActive = useColorModeValue('gray.100', 'gray.700');
	const textColor = useColorModeValue('gray.600', 'gray.400');

	const commentSchema = z.object({
		content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long")
	  });
	type CommentFormData = z.infer<typeof commentSchema>;
	const { createComment, isCreateCommentLoading } = useCreateComment();

	// Get content preview (first 150 characters)
	const getContentPreview = (content: string): string => {
		if (content.length <= 150) return content;
		return content.substring(0, 150) + '...';
	  };

	// Handle posting a new comment
	const handlePostComment = async (discussionId: string, data: CommentFormData) => {
		try {
			await createComment({
				variables: {
					parentId: discussionId,
					content: data.content,
					parentType: 'DISCUSSION',
				}
			});
			setActiveCommentId(null);
		} catch (error) {
			console.error('Error posting comment:', error);
		}
	};

	const { voteDiscussion } = useVoteDiscussion();
	// Handle voting on a discussion
	const handleVote = async (id: string, vote: 'UP' | 'DOWN' | 'NONE') => {
		await voteDiscussion({
		variables: { id, vote }
		});
	};


	return (
		<Box
			key={post.id}
			bg={tabBg}
			borderRadius="lg"
			boxShadow="sm"
			border="1px"
			borderColor={borderColor}
			overflow="hidden"
			transition="all 0.2s"
			_hover={{ borderColor: 'sepia.300' }}
		>
			<Flex>
				{/* Vote Column */}
				<Flex
					direction="column"
					align="center"
					py={4}
					px={2}
					bg={useColorModeValue('gray.50', 'gray.800')}
					minW="60px"
				>
					<IconButton
						aria-label="Upvote"
						icon={<FiChevronUp />}
						size="sm"
						variant="ghost"
						colorScheme={post.userVote === 'UP' ? 'sepia' : 'gray'}
						bg={post.userVote === 'UP' ? voteBgActive : 'transparent'}
						onClick={() => handleVote(post.id, post.userVote === 'UP' ? 'NONE' : 'UP')}
					/>
					<Text
						fontWeight="bold"
						color={post.userVote === 'UP'
							? 'sepia.500'
							: post.userVote === 'DOWN'
								? 'red.500'
								: 'inherit'
						}
						py={1}
					>
						{post.likes - post.dislikes}
					</Text>
					<IconButton
						aria-label="Downvote"
						icon={<FiChevronDown />}
						size="sm"
						variant="ghost"
						colorScheme={post.userVote === 'DOWN' ? 'sepia' : 'gray'}
						bg={post.userVote === 'DOWN' ? voteBgActive : 'transparent'}
						onClick={() => handleVote(post.id, post.userVote === 'DOWN' ? 'NONE' : 'DOWN')}
					/>
				</Flex>

				{/* Content Column */}
				<Box p={4} width="100%">
					{/* Post Metadata */}
					<Flex mb={2} align="center" fontSize="sm" color={textColor}>
						<Avatar
							src={post.userAvatar}
							name={post.userName}
							size="xs"
							mr={2}
						/>
						<Text fontWeight="medium">
							{post.userName}
						</Text>
						<Box as="span" mx={2} fontSize="xs">•</Box>
						<Flex align="center">
							<Icon as={FiClock} mr={1} fontSize="xs" />
							<Text>{formatDate(post.createdAt)}</Text>
						</Flex>
					</Flex>

					{/* Post Title */}
					<Box onClick={() => router.push(`/posts/${post.id}`)} cursor="pointer" _hover={{ opacity: 0.8 }}>
						<Heading size="md" mb={2} lineHeight="1.2">
							{post.title}
						</Heading>

						{/* Post Content Preview */}
						<Text mb={3} color={textColor}>
							{getContentPreview(post.content)}
						</Text>
					</Box>

					{/* Post Actions */}
					<Flex align="center">
						<Button
							size="sm"
							leftIcon={<Icon as={FiMessageSquare} />}
							variant="ghost"
							mr={3}
							onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)}
						>
							Comment
						</Button>
						<Button
							size="sm"
							leftIcon={<Icon as={FiShare2} />}
							variant="ghost"
							onClick={async () => {
								const url = `${getOrigin()}/posts/${post.id}`;
								try {
									await navigator.clipboard.writeText(url);
									toast({
										title: "Link copied to clipboard",
										status: "success",
										duration: 2000,
                                        colorScheme: "sepia"
									});
								} catch (error) {
									toast({
										title: "Failed to copy link",
										status: "error",
										duration: 2000,
                                        colorScheme: "sepia"
									});
								}
							}}
						>
							Share
						</Button>
					</Flex>

					{/* Comments Section */}
					{post.replies && post.replies.length > 0 && (
						<Box mt={4}>
							{post.replies.map((comment) => (
								<CommentThread
									key={comment.id}
									comment={comment}
									maxDepth={4}
								/>
							))}
						</Box>
					)}

					{/* Comment Input Section */}
					{activeCommentId === post.id && (
						<Box mt={4}>
							<form onSubmit={(e) => {
								e.preventDefault();
								const formData = new FormData(e.currentTarget);
								const content = formData.get('content') as string;
								if (content) {
									handlePostComment(post.id, { content });
									e.currentTarget.reset();
								}
							}}>
								<FormControl>
									<Textarea
										name="content"
										resize="vertical"
										rows={2}
										mb={2}
									/>
								</FormControl>
								<Flex justify="flex-end">
									<HStack spacing={2}>
										<Button
											size="sm"
											colorScheme="sepia"
											onClick={() => setActiveCommentId(null)}
										>
											Cancel
										</Button>
										<Button
											type="submit"
											size="sm"
											colorScheme="sepia"
											isLoading={isCreateCommentLoading}
										>
											Post Comment
										</Button>
									</HStack>
								</Flex>
							</form>
						</Box>
					)}
				</Box>
			</Flex>
		</Box>
	);
};