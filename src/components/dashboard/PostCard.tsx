"use client";

import {
	Box,
	VStack,
	HStack,
	Text,
	Avatar,
	Link,
	Icon,
	IconButton,
	Button,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiHeart, FiMessageSquare, FiShare2, FiLink } from "react-icons/fi";
import {
	RiTelegramLine,
	RiWhatsappLine,
	RiFacebookCircleLine,
	RiTwitterXLine,
} from "react-icons/ri";

interface PostCardProps {
	id: string;
	author: {
		id: string;
		name: string;
		image: string;
	};
	content: string;
	timestamp: string;
	likes: number;
	commentCount: number;
}

export function PostCard({
	id,
	author,
	content,
	timestamp,
	likes,
	commentCount,
}: PostCardProps) {
	const router = useRouter();
	const toast = useToast();
	const [isLiked, setIsLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(likes);
	const borderColor = useColorModeValue("gray.100", "gray.700");

	const handleLike = () => {
		setIsLiked(!isLiked);
		setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
		// Here you would typically make an API call to update the like status
	};

	const handleShare = (method: string) => {
		const shareText = `${content} - shared via Akashic`;
		const shareUrl = window.location.href;

		switch (method) {
			case "copy":
				navigator.clipboard.writeText(shareUrl);
				toast({
					title: "Link Copied",
					status: "success",
					duration: 2000,
				});
				break;
			case "x":
				window.open(
					`https://twitter.com/intent/tweet?text=${encodeURIComponent(
						shareText
					)}&url=${encodeURIComponent(shareUrl)}`
				);
				break;
			case "telegram":
				window.open(
					`https://t.me/share/url?url=${encodeURIComponent(
						shareUrl
					)}&text=${encodeURIComponent(shareText)}`
				);
				break;
			case "whatsapp":
				window.open(
					`https://api.whatsapp.com/send?text=${encodeURIComponent(
						shareText + "\n" + shareUrl
					)}`
				);
				break;
			case "facebook":
				window.open(
					`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
						shareUrl
					)}`
				);
				break;
		}
	};

	const handlePostClick = (e: React.MouseEvent) => {
		// Prevent navigation if clicking on interactive elements
		if (
			(e.target as HTMLElement).closest("button") ||
			(e.target as HTMLElement).closest("a")
		) {
			return;
		}
		router.push(`/posts/${id}`);
	};

	return (
		<VStack align="stretch" spacing={4}>
			<Box
				p={6}
				bg="white"
				borderRadius="lg"
				borderWidth="1px"
				borderColor={borderColor}
				onClick={handlePostClick}
				cursor="pointer"
				_hover={{ borderColor: "sepia.500" }}
				transition="all 0.2s"
			>
				<VStack align="stretch" spacing={4}>
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
								{timestamp}
							</Text>
						</VStack>
					</HStack>

					<Text>{content}</Text>

					<HStack spacing={6}>
						<Button
							variant="ghost"
							size="sm"
							leftIcon={
								<Icon
									as={FiHeart}
									color={isLiked ? "red.500" : "warmGray.500"}
								/>
							}
							color="warmGray.500"
							onClick={(e) => {
								e.stopPropagation();
								handleLike();
							}}
							_hover={{ color: "sepia.500" }}
						>
							{likeCount}
						</Button>
						<Button
							variant="ghost"
							size="sm"
							leftIcon={<Icon as={FiMessageSquare} />}
							color="warmGray.500"
							onClick={(e) => {
								e.stopPropagation();
								handlePostClick(e);
							}}
							_hover={{ color: "sepia.500" }}
						>
							{commentCount}
						</Button>
						<Menu>
							<MenuButton
								as={IconButton}
								aria-label="Share options"
								icon={<Icon as={FiShare2} />}
								variant="ghost"
								size="sm"
								color="warmGray.500"
								_hover={{ color: "sepia.500" }}
							/>
							<MenuList>
								<MenuItem
									icon={<Icon as={FiLink} />}
									onClick={(e) => {
										e.stopPropagation();
										handleShare("copy");
									}}
								>
									Copy Link
								</MenuItem>
								<MenuItem
									icon={<Icon as={RiTelegramLine} />}
									onClick={(e) => {
										e.stopPropagation();
										handleShare("telegram");
									}}
								>
									Share on Telegram
								</MenuItem>
								<MenuItem
									icon={<Icon as={RiWhatsappLine} />}
									onClick={(e) => {
										e.stopPropagation();
										handleShare("whatsapp");
									}}
								>
									Share on WhatsApp
								</MenuItem>
								<MenuItem
									icon={<Icon as={RiTwitterXLine} />}
									onClick={(e) => {
										e.stopPropagation();
										handleShare("x");
									}}
								>
									Share on X
								</MenuItem>
								<MenuItem
									icon={<Icon as={RiFacebookCircleLine} />}
									onClick={(e) => {
										e.stopPropagation();
										handleShare("facebook");
									}}
								>
									Share on Facebook
								</MenuItem>
							</MenuList>
						</Menu>
					</HStack>
				</VStack>
			</Box>
		</VStack>
	);
}
