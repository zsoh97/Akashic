import { gql, useQuery } from "@apollo/client";

const GET_DISCUSSIONS = gql`
  query GetDiscussions($bookId: ID!, $limit: Int, $offset: Int) {
    discussions(bookId: $bookId, limit: $limit, offset: $offset) {
      id
      title
      content
      createdAt
      likes
      dislikes
      userVote
      author {
        id
        name
      }
      comments {
        id
      }
    }
  }
`;

export function useDiscussions(bookId?: string) {
	const { data, loading: isGetDiscussionsLoading, error: isGetDiscussionsError, refetch } = useQuery(GET_DISCUSSIONS, {
		variables: { bookId, limit: 20, offset: 0 },
		skip: !bookId,
		pollInterval: 600000, // 10 minutes
	});

	const discussions = data?.discussions || [];

	return { discussions, isGetDiscussionsError, isGetDiscussionsLoading, refetch };
}
