import { gql, useMutation } from "@apollo/client";

const VOTE_DISCUSSION = gql`
  mutation VoteDiscussion($id: ID!, $vote: VoteType!) {
    voteDiscussion(id: $id, vote: $vote) {
      id
      userVote
      likes
      dislikes
    }
  }
`;

export const useVoteDiscussion = () => {
  const [voteDiscussion] = useMutation(VOTE_DISCUSSION, {
    update(cache, { data: { voteDiscussion: updatedDiscussion } }) {
      cache.modify({
        id: cache.identify({ __typename: 'Discussion', id: updatedDiscussion.id }),
        fields: {
          userVote: () => updatedDiscussion.userVote,
          likes: () => updatedDiscussion.likes,
          dislikes: () => updatedDiscussion.dislikes
        }
      });
    }
  });
  return {
    voteDiscussion,
  };
}