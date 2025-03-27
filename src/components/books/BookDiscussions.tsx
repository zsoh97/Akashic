"use client";

import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  Stack,
  HStack,
  Button,
  useColorModeValue,
  Icon,
  Avatar,
  Textarea,
  Input,
  FormControl,
  FormLabel,
  IconButton,
  Card,
  CardBody,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter
} from "@chakra-ui/react";
import {
  FiMessageSquare,
  FiSend,
  FiChevronUp,
  FiChevronDown,
  FiShare2,
  FiClock,
  FiUser,
  FiLock
} from "react-icons/fi";
import { semanticColors } from '@/theme/colors';
import { useRouter } from 'next/navigation';
import { useCreateDiscussion } from "@/hooks/useCreateDiscussion";
import { useDiscussions } from "@/hooks/useDiscussions";
import { BookDiscussionSkeleton } from "./BookDiscussionSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import _ from "lodash";
import { useVoteDiscussion } from "@/hooks/useVoteDiscussion";
import { formatDate } from "@/utils/date";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useCreateComment } from "@/hooks/useCreateComment";
import { CommentThread } from "@/components/dashboard/CommentThread";
import { PostComponent } from "./PostComponent";

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

export type DiscussionPost = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
  userVote?: 'UP' | 'DOWN' | null;
}

interface BookDiscussionsProps {
  bookId: string;
}

export function BookDiscussions({ bookId }: BookDiscussionsProps) {
  const borderColor = useColorModeValue(semanticColors.border.light, 'gray.700');
  const tabBg = useColorModeValue('white', 'gray.800');
  const { session, user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const discussionSchema = z.object({
    title: z.string().min(1, "Title cannot be empty").max(100, "Title is too long"),
    content: z.string().min(1, "Content cannot be empty").max(1000, "Content is too long")
  });

  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  type DiscussionFormData = z.infer<typeof discussionSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<DiscussionFormData>({
    resolver: zodResolver(discussionSchema)
  });

  // Query discussions
  const { discussions, isGetDiscussionsLoading } = useDiscussions(bookId);

  // Create discussion mutation
  const { createDiscussion, isPosting } = useCreateDiscussion()

  // Handle posting a new discussion
  const handlePostDiscussion = async (data: DiscussionFormData) => {
    await createDiscussion({
      variables: {
        bookId,
        title: data.title,
        content: data.content
      }
    });
    reset();
  };

  const bookDiscussions = discussions || [];

  const handleSignIn = () => {
    router.push('/auth');
  };

  return (
    <>
      {/* Only show create discussion form if logged in */}
      {session ? (
        <Box
          p={6}
          bg={tabBg}
          borderRadius="lg"
          boxShadow="sm"
          border="1px"
          borderColor={borderColor}
          mt={6}
        >
          <Flex mb={4} align="center">
            {/* <Avatar
              src={effectiveUser?.avatar}
              name={effectiveUser?.name || 'User'}
              mr={4}
              size="sm"
            /> */}
            <Text fontWeight="bold">{_.get(user?.user_metadata, 'name') || 'You'}</Text>
          </Flex>

          <form onSubmit={handleSubmit(handlePostDiscussion)}>
            <FormControl mb={4} isInvalid={!!errors.title}>
              <FormLabel>Discussion Title</FormLabel>
              <Input
                placeholder="Enter a title for your discussion..."
                {...register('title')}
              />
              {errors.title && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.title.message}
                </Text>
              )}
            </FormControl>

            <FormControl mb={4} isInvalid={!!errors.content}>
              <FormLabel>Discussion</FormLabel>
              <Textarea
                placeholder="Share your thoughts about this book..."
                resize="vertical"
                rows={3}
                {...register('content')}
              />
              {errors.content && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.content.message}
                </Text>
              )}
            </FormControl>

            <Flex justify="flex-end">
              <Button
                type="submit"
                leftIcon={<FiSend />}
                colorScheme="sepia"
                isLoading={isPosting}
              >
                Post Discussion
              </Button>
            </Flex>
          </form>
        </Box>
      ) : (
        <Card
          mt={6}
          bg={useColorModeValue('gray.50', 'gray.700')}
          variant="outline"
          borderRadius="lg"
          boxShadow="md"
          borderColor={borderColor}
        >
          <CardBody>
            <Flex direction="column" align="center" textAlign="center">
              <Icon as={FiMessageSquare} boxSize={12} color="sepia.500" mb={4} />
              <Heading size="md" mb={2}>Join the Conversation</Heading>
              <Text mb={4}>
                Sign in to share your thoughts and participate in discussions about this book.
              </Text>
              <HStack spacing={4}>
                <Button
                  leftIcon={<FiUser />}
                  colorScheme="sepia"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Button
                  leftIcon={<FiLock />}
                  variant="outline"
                  colorScheme="sepia"
                  onClick={() => router.push('/auth?mode=signup')}
                >
                  Create Account
                </Button>
              </HStack>
            </Flex>
          </CardBody>
        </Card>
      )}
      {/* Always show discussions */}
      <VStack paddingTop={6} spacing={6} align="stretch">
        {/* Discussion Posts */}
        {isGetDiscussionsLoading ? (
          <BookDiscussionSkeleton />
        ) : bookDiscussions.length > 0 ? (
          <Stack spacing={4}>
            {discussions.map((post: DiscussionPost) => (
              <PostComponent key={post.id} post={post} setActiveCommentId={setActiveCommentId} activeCommentId={activeCommentId} />
            ))}
          </Stack>
        ) : (
          <Box
            p={6}
            bg={tabBg}
            borderRadius="lg"
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
            textAlign="center"
          >
            <Text>No discussions yet. Be the first to start a conversation!</Text>
          </Box>
        )}
      </VStack>

      {/* Login Modal - Alternative approach */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign in to join the discussion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              You need to be signed in to post discussions, comment, and vote.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="sepia" mr={3} onClick={() => router.push('/auth')}>
              Sign In
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}