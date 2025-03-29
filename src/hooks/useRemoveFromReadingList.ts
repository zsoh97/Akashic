
import { gql, useMutation } from '@apollo/client'

const REMOVE_BOOK_FROM_READING_LIST = gql`mutation RemoveBookFromReadingList($bookId: ID!) {
	removeBookFromReadingList(bookId: $bookId) {
		id
		title
		authors
		coverImage
	}	
}`

export const useRemoveBookFromReadingList = () => {
	const [removeBookFromReadingList, { loading: isRemovingFromList, error }] = useMutation(REMOVE_BOOK_FROM_READING_LIST, {
		update(cache, { data: { removeBookFromReadingList } }) {
			// Update the book's cache with the returned data
			cache.writeFragment({
				id: `Book:${removeBookFromReadingList.id}`,
				fragment: gql`
					fragment BookFields on Book {
						id
						title
						authors
						coverImage
					}
				`,
				data: removeBookFromReadingList
			});
			cache.modify({
				id: `Book:${removeBookFromReadingList.id}`,
				fields: {
					isInReadingList() {
						return false;
					}
				}
			})
		},
		onError: (error) => {
			console.error('Error removing book from reading list:', error);
		}
	})

	return {removeBookFromReadingList, isRemovingFromList, error}
}