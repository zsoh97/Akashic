import { ReadingList } from '@/types/user';
import { gql, useQuery } from '@apollo/client';

const GET_MY_READING_LISTS = gql`
  query GetMyReadingList {
    myReadingList {
      id
      name
      description
      isPublic
      books {
        id
        isbn
        isbn13
        title
        authors
        coverImage
        averageRating
        categories
      }
    }
  }
`;

export const useGetReadingList = () => {
  const { data, loading, error } = useQuery(GET_MY_READING_LISTS);

  // Extract all books from all reading lists
  const readingList = data?.myReadingList as ReadingList
  return {
    readingList,
    loading,
    error
  };
};