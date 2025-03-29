import { gql, useMutation } from '@apollo/client';

const ADD_TO_READING_LIST = gql`
  mutation AddBookToReadingList($bookId: ID!) {
    addBookToReadingList(bookId: $bookId) {
      id
      name
      description
      isPublic
      books {
        id
        title
        authors
        coverImage
      }
    }
  }
`;

export const useReadingList = () => {
  const [addToReadingList, { loading: isAddingToList, error: addToListError }] = useMutation(
    ADD_TO_READING_LIST,
    {
      update(cache, { data: { addBookToReadingList } }) {
        cache.modify({
          fields: {
            myReadingLists(existingLists = []) {
              const newListRef = cache.writeFragment({
                data: addBookToReadingList,
                fragment: gql`
                  fragment NewReadingList on ReadingList {
                    id
                    name
                    description
                    isPublic
                    books {
                      id
                      title
                      authors
                      coverImage
                    }
                  }
                `
              });
              return [...existingLists, newListRef];
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