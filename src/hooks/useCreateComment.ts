import { gql, useMutation } from "@apollo/client";

const CREATE_COMMENT = gql`
  mutation CreateComment($parentId: ID!, $content: String!, $parentType: String!) {
    createComment(parentId: $parentId, content: $content, parentType: $parentType) {
      id
      content
      createdAt
      author {
        id
        name
        avatar
      }
      parentId
      replies {
        id
        content
        author {
          id
          name
          avatar
        }
      }
    }
  }
`;

export const useCreateComment = () => {
  const [createComment, { loading: isCreateCommentLoading, error: isCreateCommentError }] = useMutation(
    CREATE_COMMENT,
    {
      update(cache, { data: { createComment: newComment } }) {
        const parentId = newComment.parentId;
        const parentType = newComment.parentType;

        if (parentType === 'Comment') {
          // Update parent comment's replies
          cache.modify({
            id: cache.identify({ __typename: 'Comment', id: parentId }),
            fields: {
              replies(existingReplies = []) {
                const newReplyRef = cache.writeFragment({
                  data: newComment,
                  fragment: gql`
                    fragment NewComment on Comment {
                      id
                      content
                      createdAt
                      author {
                        id
                        name
                        avatar
                      }
                      parentId
                      replies
                    }
                  `
                });
                return [newReplyRef, ...existingReplies];
              }
            }
          });
        } else if (parentType === 'Discussion') {
          // Update discussion's top-level comments
          cache.modify({
            id: cache.identify({ __typename: 'Discussion', id: parentId }),
            fields: {
              comments(existingComments = []) {
                const newCommentRef = cache.writeFragment({
                  data: newComment,
                  fragment: gql`
                    fragment NewComment on Comment {
                      id
                      content
                      createdAt
                      author {
                        id
                        name
                        avatar
                      }
                      parentId
                      replies
                    }
                  `
                });
                return [newCommentRef, ...existingComments];
              }
            }
          });
        }
      }
    }
  );

  return {
    createComment,
    isCreateCommentLoading,
    isCreateCommentError,
  };
};