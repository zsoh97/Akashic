"use client";

import {
	Box,
	Container,
	VStack,
	HStack,
	Heading,
	Text,
	Avatar,
	Button,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiUserPlus, FiUserCheck } from "react-icons/fi";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/dashboard/PostCard";

// Sample user data (replace with real data later)
const sampleUserPosts = [
	{
		id: "1",
		author: {
			id: "1",
			name: "Jane Smith",
			image: "/avatars/jane.jpg",
		},
		content: "Currently reading 'Project Hail Mary'...",
		timestamp: "1d ago",
		likes: 42,
		commentCount: 12,
	},
	{
		id: "2",
		author: {
			id: "1",
			name: "Jane Smith",
			image: "/avatars/jane.jpg",
		},
		content: "Just finished 'The Midnight Library'...",
		timestamp: "3d ago",
		likes: 89,
		commentCount: 24,
	},
	// Add more sample posts
];

export default function UserProfile() {
	const borderColor = useColorModeValue("gray.100", "gray.700");
	const [isFollowing, setIsFollowing] = useState(false);
	const toast = useToast();

	const handleFollowClick = () => {
		setIsFollowing(!isFollowing);
		toast({
			title: isFollowing ? "Unfollowed" : "Following",
			description: isFollowing
				? "You have unfollowed Jane Smith"
				: "You are now following Jane Smith",
			status: "success",
			duration: 3000,
			isClosable: true,
		});
		// Here you would typically make an API call to update the follow status
	};

	return (
		<>
			<Navbar />
			<Container maxW="container.xl" py={8} pt={{ base: "70px", md: "80px" }}>
				<VStack spacing={8} align="stretch">
					{/* User Profile Header */}
					<Box
						p={8}
						bg="white"
						borderRadius="lg"
						borderWidth="1px"
						borderColor={borderColor}
					>
						<VStack spacing={6}>
							<Avatar size="2xl" name="Jane Smith" src="/avatars/jane.jpg" />
							<VStack spacing={4}>
								<VStack spacing={2}>
									<Heading size="lg">Jane Smith</Heading>
									<HStack spacing={4} color="warmGray.500">
										<Text>42 Books Read</Text>
										<Text>•</Text>
										<Text>128 Reviews</Text>
										<Text>•</Text>
										<Text>1.2k Followers</Text>
									</HStack>
									<Text maxW="2xl" textAlign="center" color="warmGray.600">
										Book enthusiast and sci-fi lover. Always looking for the
										next great read!
									</Text>
								</VStack>

								<Button
									leftIcon={isFollowing ? <FiUserCheck /> : <FiUserPlus />}
									colorScheme={isFollowing ? "gray" : "sepia"}
									variant={isFollowing ? "outline" : "solid"}
									size="md"
									onClick={handleFollowClick}
									px={8}
								>
									{isFollowing ? "Following" : "Follow"}
								</Button>
							</VStack>
						</VStack>
					</Box>

					{/* User Posts */}
					<VStack spacing={6} align="stretch">
						<Heading size="lg">Posts</Heading>
						{sampleUserPosts.map((post, index) => (
							<PostCard key={index} {...post} />
						))}
					</VStack>
				</VStack>
			</Container>
		</>
	);
}
