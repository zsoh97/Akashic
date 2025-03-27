import { gql, useMutation } from "@apollo/client"

const CREATE_DISCUSSION = gql`
mutation CreateDiscussion($bookId: ID!, $title: String!, $content: String!) {
  createDiscussion(bookId: $bookId, title: $title, content: $content) {
	id
	title
	content
  }
}
`;

export const useCreateDiscussion = () => {
	const [createDiscussion, {loading: isPosting, error: isErrorPostin }] = useMutation(
		CREATE_DISCUSSION, {
			update(cache, { data: { newDiscussion } }) {
				cache.modify({
					id: cache.identify({ __typename: 'Book', id: newDiscussion.bookId }),
					fields: {
						discussions(existingDiscussions = []) {
							return [newDiscussion, ...existingDiscussions]
						}
					}
				});	
			}
		}
		
	)
	return {
		createDiscussion,
		isPosting,
		isErrorPostin
	}
}