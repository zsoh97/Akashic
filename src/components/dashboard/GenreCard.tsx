"use client";

import { Box, Text, Icon, useColorModeValue } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface GenreCardProps {
	name: string;
	icon?: IconType;
	postCount?: number;
}

export function GenreCard({ name, icon, postCount }: GenreCardProps) {
	const borderColor = useColorModeValue("gray.100", "gray.700");

	return (
		<Box
			p={4}
			bg="white"
			borderRadius="lg"
			borderWidth="1px"
			borderColor={borderColor}
			textAlign="center"
			transition="all 0.2s"
			_hover={{
				transform: "translateY(-2px)",
				shadow: "md",
			}}
		>
			{icon && <Icon as={icon} boxSize={5} mb={2} color="sepia.500" />}
			<Text fontWeight="medium">{name}</Text>
			{postCount && (
				<Text fontSize="sm" color="warmGray.500" mt={1}>
					{postCount} posts
				</Text>
			)}
		</Box>
	);
}
