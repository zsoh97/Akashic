import { gql, useMutation } from "@apollo/client";

const VOTE_COMMENT = gql`
  mutation VoteComment($id: ID!, $vote: VoteType!) {
    voteComment(id: $id, vote: $vote) {
      id
      userVote
      likes
      dislikes
    }
  }
`;

export const useVoteComment = () => {
  const [voteComment] = useMutation(VOTE_COMMENT, {
    update(cache, { data: { voteComment: updatedComment } }) {
      cache.modify({
        id: cache.identify({ __typename: 'Comment', id: updatedComment.id }),
        fields: {
          userVote: () => updatedComment.userVote,
          likes: () => updatedComment.likes,
          dislikes: () => updatedComment.dislikes
        }
      });
    }
  });
  return {
    voteComment,
  };
}