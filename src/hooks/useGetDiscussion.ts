import { DiscussionPost } from "@/types/discussion"
import { useQuery } from "@apollo/client"
import gql from "graphql-tag"

const GET_DISCUSSION = gql`
  query GetDiscussion($id: ID!) {
    discussion(id: $id) {
      id
      title
      content
      createdAt
      likes
      dislikes
      userVote
      replies {
        id
        content
        createdAt
        likes
        dislikes
        userVote
        author {
          id
          name
          avatar
        }
        replies {
          id
          content
          createdAt
          likes
          dislikes
          userVote
          author {
            id
            name
            avatar
          }
          replies {
            id
            content
            createdAt
            likes
            dislikes
            userVote
            author {
              id
              name
              avatar
            }
          }
        }
      }
    }
  }`

export const useGetDiscussion = (id: string) => {
  const { data, loading: isGetDiscussionLoading, error: isGetDiscussionError } = useQuery(GET_DISCUSSION, {
    variables: { id }, 
    skip: !id
  })

  const discussion = data?.discussion as DiscussionPost

  return { discussion, isGetDiscussionLoading, isGetDiscussionError}
}