import { gql, useMutation } from "@apollo/client";

// Add a mutation to create a book in your backend
const CREATE_BOOK = gql`
  mutation CreateBook(
    $isbn: String!,
    $title: String!,
    $authors: [String!]!,
    $description: String,
    $coverImage: String,
    $publisher: String,
    $publishedDate: String,
    $pageCount: Int,
    $categories: [String!]
  ) {
    createBook(
      isbn: $isbn,
      title: $title,
      authors: $authors,
      description: $description,
      coverImage: $coverImage,
      publisher: $publisher,
      publishedDate: $publishedDate,
      pageCount: $pageCount,
      categories: $categories
    ) {
      id
      isbn
      title
    }
  }
`;
export const useCreateBooks = () => {
	// Add the mutation hook
	const [createBook, { loading: isCreatingBook, error: createBookError }] = useMutation(CREATE_BOOK, {
		onError: (error) => {
			console.error('Error creating book:', error);
		}
	});

	return {
		createBook,
		isCreatingBook,
		createBookError,
	};
};