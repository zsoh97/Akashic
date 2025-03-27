import { semanticColors } from "@/theme/colors";
import { Stack, Box, Flex, useColorModeValue, Skeleton, SkeletonText } from "@chakra-ui/react";

export const BookDiscussionSkeleton = () => {
	const borderColor = useColorModeValue(semanticColors.border.light, 'gray.700');
	const tabBg = useColorModeValue('white', 'gray.800');
	return (
		<Stack spacing={4}>
			{[1, 2, 3].map(i => (
				<Box
					key={i}
					bg={tabBg}
					borderRadius="lg"
					boxShadow="sm"
					border="1px"
					borderColor={borderColor}
					overflow="hidden"
				>
					<Flex>
						{/* Vote Column */}
						<Flex
							direction="column"
							align="center"
							p={2}
							bg={useColorModeValue('gray.50', 'gray.800')}
							minW="60px"
						>
							<Skeleton height="24px" width="24px" mb={2} />
							<Skeleton height="18px" width="30px" mb={2} />
							<Skeleton height="24px" width="24px" />
						</Flex>

						{/* Content Column */}
						<Box p={4} width="100%">
							<Flex mb={2} align="center">
								<Skeleton height="24px" width="24px" borderRadius="full" mr={2} />
								<SkeletonText noOfLines={1} skeletonHeight={3} width="120px" />
								<Skeleton height="10px" width="10px" mx={2} borderRadius="full" />
								<SkeletonText noOfLines={1} skeletonHeight={3} width="80px" />
							</Flex>
							<SkeletonText noOfLines={1} skeletonHeight={5} width="90%" mb={3} />
							<SkeletonText noOfLines={2} spacing={2} skeletonHeight={4} mb={3} />
							<Flex>
								<Skeleton height="24px" width="70px" mr={3} />
								<Skeleton height="24px" width="70px" />
							</Flex>
						</Box>
					</Flex>
				</Box>
			))}
		</Stack>
	);
};