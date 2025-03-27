import { gql, useQuery } from "@apollo/client";

const GET_DISCUSSION_COMMENTS = gql`
  query GetDiscussionComments($discussionId: ID!, $limit: Int, $offset: Int) {
    commentsByDiscussion(discussionId: $discussionId, limit: $limit, offset: $offset) {
      id
      content
      createdAt
      author {
        id
        name
        avatar
      }
      likes
      dislikes
      userVote
    }
  }
`;

export const useDiscussionComments = (discussionId: string) => {
  const { data, loading: isLoading, error } = useQuery(GET_DISCUSSION_COMMENTS, {
    variables: {
      discussionId,
      limit: 50,
      offset: 0
    }
  });

  return {
    comments: data?.commentsByDiscussion || [],
    isLoading,
    error
  };
};