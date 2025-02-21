"use client";

import {
	Box,
	Container,
	VStack,
	Divider,
	Heading,
	Input,
	Button,
	Icon,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiSend } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/dashboard/PostCard";
import { CommentCard } from "@/components/dashboard/CommentCard";

// Sample post data (replace with API call)
const samplePost = {
	id: "1",
	author: {
		id: "1",
		name: "Jane Smith",
		image: "/avatars/jane.jpg",
	},
	content:
		"Just finished reading 'The Midnight Library' - absolutely mind-blowing!",
	timestamp: "2h ago",
	likes: 24,
	commentCount: 8,
};

const sampleComments = [
	{
		id: "1",
		author: {
			id: "3",
			name: "Alice Johnson",
			image: "/avatars/alice.jpg",
		},
		content: "Couldn't agree more! The character development was incredible.",
		timestamp: "1h ago",
	},
	// ... more comments
];

export default function PostPage() {
	const [comments, setComments] = useState(sampleComments);
	const [newComment, setNewComment] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();
	const borderColor = useColorModeValue("gray.100", "gray.700");

	const handleAddComment = async () => {
		if (!newComment.trim()) return;

		setIsLoading(true);
		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 500));

			const newCommentObj = {
				id: Date.now().toString(),
				author: {
					id: "current-user-id",
					name: "Current User",
					image: "/avatars/current-user.jpg",
				},
				content: newComment,
				timestamp: "Just now",
			};

			setComments((prev) => [newCommentObj, ...prev]);
			setNewComment("");
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e) {
			toast({
				title: "Error adding comment",
				status: "error",
				duration: 3000,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<Navbar />
			<Container maxW="container.md" py={8} pt={{ base: "70px", md: "80px" }}>
				<VStack spacing={8} align="stretch">
					{/* Original Post */}
					<PostCard {...samplePost} />

					<Divider />

					{/* Comments Section */}
					<VStack spacing={6} align="stretch">
						<Heading size="md">Comments ({comments.length})</Heading>

						{/* Add Comment */}
						<Box
							p={4}
							bg="white"
							borderRadius="lg"
							borderWidth="1px"
							borderColor={borderColor}
						>
							<VStack spacing={4}>
								<Input
									placeholder="Add a comment..."
									value={newComment}
									onChange={(e) => setNewComment(e.target.value)}
									onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
								/>
								<Button
									alignSelf="flex-end"
									leftIcon={<Icon as={FiSend} />}
									colorScheme="sepia"
									isLoading={isLoading}
									onClick={handleAddComment}
									isDisabled={!newComment.trim()}
								>
									Comment
								</Button>
							</VStack>
						</Box>

						{/* Comments List */}
						<VStack spacing={4} align="stretch">
							{comments.map((comment) => (
								<CommentCard key={comment.id} {...comment} />
							))}
						</VStack>
					</VStack>
				</VStack>
			</Container>
		</>
	);
}
