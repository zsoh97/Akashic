"use client";

import {
	VStack,
	Textarea,
	Button,
	useToast,
	Flex,
	FormControl,
	FormErrorMessage,
	HStack
} from "@chakra-ui/react";
import { useCreateComment } from "@/hooks/useCreateComment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CommentFormProps {
	parentId: string;
	parentType: 'DISCUSSION' | 'COMMENT';
	onCommentSubmit: () => void;
	userAvatar?: string;
}

export function CommentForm({ parentId, onCommentSubmit, parentType }: CommentFormProps) {

	const commentSchema = z.object({
		content: z.string().min(1, "Content cannot be empty").max(1000, "Content is too long")
	});

	type CommentFormData = z.infer<typeof commentSchema>;

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<CommentFormData>({
		resolver: zodResolver(commentSchema)
	});
	const { createComment, isCreateCommentLoading } = useCreateComment();
	const toast = useToast();

	const handleCreateComment = async (data: CommentFormData) => {
		if (!data.content.trim()) return;

		try {
			createComment({
				variables: {
					parentId: parentId,
					content: data.content,
					parentType,
				}
			});
			toast({
				title: "Successfully created comment",
				status: "error",
				duration: 2000,
				colorScheme: "sepia"
			});
			onCommentSubmit();
			reset();
		} catch (e) {
			toast({
				title: "Failed to create comment",
				status: "error",
				duration: 2000,
				colorScheme: "sepia"
			});
		}
	};

	return (
		<form onSubmit={handleSubmit(handleCreateComment)}>
			<VStack spacing={2} align="stretch">
				<FormControl>
					<Textarea
						resize="vertical"
						rows={3}
						{...register('content')}
					/>
					<FormErrorMessage>{errors.content?.message}</FormErrorMessage>
				</FormControl>
				<HStack spacing="8px" justify="flex-end">
					<Button
						size="sm"
						colorScheme="sepia"
						isLoading={isCreateCommentLoading}
						onClick={() =>onCommentSubmit()}
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
			</VStack>
		</form>
	);
}