import { NextResponse } from 'next/server';
import { Book } from '@/types/Book';

export async function GET() {
  try {
    // Fetch trending books from OpenLibrary
    const response = await fetch('https://openlibrary.org/trending/daily.json');
    
    if (!response.ok) {
      throw new Error(`OpenLibrary API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the OpenLibrary data to our Book type
    const books: Book[] = data.works.map((work: any) => ({
      id: work.key?.replace('/works/', '') || '',
      title: work.title || 'Unknown Title',
      author: work.author_names?.[0] || 'Unknown Author',
      coverImage: work.cover_i 
        ? `https://covers.openlibrary.org/b/id/${work.cover_i}-M.jpg` 
        : '/images/default-cover.jpg',
      description: work.description || '',
      publishYear: work.first_publish_year || null,
    }));
    
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching trending books:', error);
    return NextResponse.json({ error: 'Failed to fetch trending books' }, { status: 500 });
  }
} 