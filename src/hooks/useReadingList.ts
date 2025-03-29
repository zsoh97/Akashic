import { gql, useMutation } from '@apollo/client';

const ADD_TO_READING_LIST = gql`
  mutation AddBookToReadingList($bookId: ID!) {
    addBookToReadingList(bookId: $bookId) {
      id
    }
  }
`;

export const useReadingList = () => {
  const [addToReadingList, { loading: isAddingToList, error: addToListError }] = useMutation(
    ADD_TO_READING_LIST,
    {
      update(cache, { data: { addBookToReadingList } }) {
        // Update the book's isInReadingList field
        const bookId = addBookToReadingList.id;
        cache.modify({
          id: `Book:${bookId}`,
          fields: {
            isInReadingList() {
              return true;
            }
          }
        });
      },
      onError: (error) => {
        console.error('Error adding book to reading list:', error);
      }
    }
  );

  return {
    addToReadingList,
    isAddingToList,
    addToListError
  };
};