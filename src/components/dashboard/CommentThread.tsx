"use client";

import { useState } from 'react';
import { Box, Button, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import { CommentCard } from './CommentCard';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  content: string;
  timestamp: string;
  replies?: Comment[];
}

interface CommentThreadProps {
  comment: Comment;
  depth?: number;
  maxDepth?: number;
}

export function CommentThread({ comment, depth = 0, maxDepth = 4 }: CommentThreadProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hasReplies = comment.replies && comment.replies.length > 0;

  // If we've exceeded maxDepth, render comments without nesting
  if (depth >= maxDepth) {
    return (
      <Box mb={4}>
        <CommentCard
          author={comment.author}
          content={comment.content}
          timestamp={comment.timestamp}
        />
        {hasReplies && (
          <Box pl={4} mt={2}>
            {comment.replies?.map((reply) => (
              <Box key={reply.id} mb={4}>
                <CommentCard
                  author={reply.author}
                  content={reply.content}
                  timestamp={reply.timestamp}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box mb={4}>
      <Flex align="start">
        {depth > 0 && (
          <Box
            w="2px"
            bg={borderColor}
            mr={4}
            ml={depth * 4}
            minH="full"
            position="relative"
          />
        )}
        <Box flex={1}>
          <CommentCard
            author={comment.author}
            content={comment.content}
            timestamp={comment.timestamp}
          />
          {hasReplies && (
            <Box mt={2}>
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<Icon as={isCollapsed ? FiChevronDown : FiChevronUp} />}
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? 'Show Replies' : 'Hide Replies'}
                <Text ml={2} color="gray.500">
                  ({comment.replies?.length})
                </Text>
              </Button>
              {!isCollapsed && (
                <Box mt={2}>
                  {comment.replies?.map((reply) => (
                    <CommentThread
                      key={reply.id}
                      comment={reply}
                      depth={depth + 1}
                      maxDepth={maxDepth}
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
}