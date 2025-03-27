import { gql, useQuery } from "@apollo/client";

const GET_BOOK = gql`
  query GetBook($isbn: String) {
    book(isbn: $isbn) {
      id
      title
      authors
      publisher
      publishedDate
      description
      pageCount
      categories
      coverImage
      isbn
      isbn13
    }
  }
`;

export function useGetBook(isbn: string) {
	const { data, loading: isGetBookLoading, error: isGetBookError, refetch } = useQuery(GET_BOOK, {
		variables: { isbn },
		skip: !isbn,
    nextFetchPolicy: 'cache-first',
		pollInterval: 600000, // 10 minutes
	  });

	return { data, isGetBookLoading, isGetBookError, refetch };
}