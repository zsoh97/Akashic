"use client";

import {
	Container,
	VStack,
	Divider,
	Heading,
} from "@chakra-ui/react";
import { CommentForm } from "@/components/dashboard/CommentForm";
import { DiscussionEmptyState } from "@/components/dashboard/DiscussionEmptyState";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/dashboard/PostCard";
import { CommentCard } from "@/components/dashboard/CommentCard";
import { useParams } from "next/navigation";
import { useGetDiscussion } from "@/hooks/useGetDiscussion";
import _ from "lodash";
import { useState } from "react";
import { CommentThread } from "@/components/dashboard/CommentThread";

export type Comment = {
	id: string;
	content: string;
	created_at: string;
	author: {
		id: string;
		username: string;
		avatar_url: string;
	};
}

export default function PostPage() {
	const params = useParams();
	const postId = _.get(params, "id") as string;

	
	const { discussion, isGetDiscussionLoading } = useGetDiscussion(postId);
	console.log(discussion)
	const [targetParentId, setTargetParentId] = useState<string | null>(null);

	return (
		<>
			<Navbar />
			{isGetDiscussionLoading ? <></> :

				<Container maxW="container.md" py={8} pt={{ base: "70px", md: "80px" }}>
					<VStack spacing={8} align="stretch">
						{/* Original Post */}
						<PostCard post={discussion} />

						<Divider />

						{/* Comments Section */}
						<VStack spacing={6} align="stretch">
							<Heading size="md">Comments ({!!discussion?.replies ? discussion?.replies.length : 0})</Heading>
							
							{/* Comment Form */}
							<CommentForm
								postId={postId}
								onCommentSubmit={() => setTargetParentId(null)}
							/>

							{/* Comments List */}
							<VStack spacing={4} align="stretch">
								{!!discussion?.replies && discussion?.replies?.length > 0 ? (
									discussion.replies.map((comment) => (
										<CommentThread key={comment.id} comment={comment} depth={0} maxDepth={2}/>
										// <CommentCard key={comment.id} {...comment} />
									))
								) : (
									<DiscussionEmptyState />
								)}
							</VStack>
						</VStack>
					</VStack>
				</Container>
			}
		</>
	);
}
