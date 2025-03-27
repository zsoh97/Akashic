 /**
 * Gets the ISBN from a book object
 */
export function getISBN(book: any): string {
	// Handle Google Books API structure
	if (book?.volumeInfo?.industryIdentifiers) {
	  const isbn13 = book.volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13');
	  const isbn10 = book.volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_10');
	  return isbn13?.identifier || isbn10?.identifier || 'N/A';
	}
	
	// Handle NYT Books API structure
	if (book?.primary_isbn13 || book?.primary_isbn10) {
	  return book.primary_isbn13 || book.primary_isbn10;
	}
	
	return 'N/A';
  }
  
  /**
   * Gets the book route using ISBN when available
   */
  export function getBookRoute(book: any): string {
	// Try to get ISBN first
	let isbn = null;
	
	// Handle Google Books API structure
	if (book.volumeInfo?.industryIdentifiers) {
	  const isbn13 = book.volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_13');
	  const isbn10 = book.volumeInfo.industryIdentifiers.find(id => id.type === 'ISBN_10');
	  isbn = isbn13?.identifier || isbn10?.identifier;
	}
	
	// Handle NYT Books API structure
	if (!isbn && (book.primary_isbn13 || book.primary_isbn10)) {
	  isbn = book.primary_isbn13 || book.primary_isbn10;
	}
	
	// Always return ISBN route, even if we need to do an additional lookup
	return `/dashboard/books/isbn/${isbn || book.id}`;
  }