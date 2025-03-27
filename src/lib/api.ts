import { Book } from '@/types/book';

export async function fetchOpenLibrarySearch(
  query: string, 
  offset: number = 0, 
  limit: number = 20
): Promise<{ books: Book[], totalResults: number }> {
  try {
    const response = await fetch(
      `/api/openlibrary/search.json?q=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`OpenLibrary API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the OpenLibrary data to our Book type
    const books: Book[] = data.docs.map((doc: any) => ({
      id: doc.key?.replace('/works/', '') || '',
      title: doc.title || 'Unknown Title',
      author: doc.author_name?.[0] || 'Unknown Author',
      coverImage: doc.cover_i 
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` 
        : '/images/default-cover.jpg',
      description: doc.description || '',
      publishYear: doc.first_publish_year || null,
    }));
    
    return {
      books,
      totalResults: data.numFound || books.length
    };
  } catch (error) {
    console.error('Error fetching from OpenLibrary:', error);
    return { books: [], totalResults: 0 };
  }
} 