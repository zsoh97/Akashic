"use client";

import { VStack, Text, Icon } from "@chakra-ui/react";
import { FiMessageSquare } from "react-icons/fi";

export function DiscussionEmptyState() {
    return (
        <VStack
            spacing={4}
            py={8}
            px={4}
            borderWidth="1px"
            borderRadius="lg"
            borderStyle="dashed"
            borderColor="warmGray.300"
        >
            <Icon as={FiMessageSquare} boxSize={8} color="warmGray.400" />
            <VStack spacing={1}>
                <Text fontSize="lg" fontWeight="medium" color="warmGray.700">
                    No comments yet
                </Text>
                <Text color="warmGray.500" textAlign="center">
                    Be the first one to start the discussion!
                </Text>
            </VStack>
        </VStack>
    );
}