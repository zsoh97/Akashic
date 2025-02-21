"use client";

import {
	Box,
	Container,
	HStack,
	Heading,
	IconButton,
	useColorModeValue,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { useRouter } from "next/navigation";

export function Navbar() {
	const router = useRouter();
	const bg = useColorModeValue("white", "gray.800");
	const borderColor = useColorModeValue("gray.100", "gray.700");

	return (
		<Box
			as="nav"
			position="fixed"
			w="100%"
			zIndex={100}
			bg={bg}
			borderBottom="1px"
			borderColor={borderColor}
		>
			<Container maxW="container.xl" py={4}>
				<HStack justify="space-between">
					<Heading
						size="lg"
						color="sepia.500"
						cursor="pointer"
						onClick={() => router.push("/dashboard")}
					>
						Akashic
					</Heading>
					<IconButton
						aria-label="Menu"
						icon={<FiMenu />}
						variant="ghost"
						colorScheme="sepia"
					/>
				</HStack>
			</Container>
		</Box>
	);
}
