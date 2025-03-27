import axios from 'axios';

const BASE_URL = 'https://openlibrary.org';

export interface OpenLibraryBook {
  key: string;
  title: string;
  authors: Array<{ name: string }>;
  covers?: number[];
  description?: { value: string } | string;
  subjects?: string[];
  first_publish_date?: string;
}

export interface OpenLibrarySearchResult {
  numFound: number;
  start: number;
  docs: Array<{
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    isbn?: string[];
    cover_i?: number;
  }>;
}

export class OpenLibraryService {
  static async searchBooks(query: string): Promise<OpenLibrarySearchResult> {
    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: {
        q: query,
        fields: 'key,title,author_name,first_publish_year,isbn,cover_i',
        limit: 10
      }
    });
    return response.data;
  }

  static async getBookByISBN(isbn: string): Promise<OpenLibraryBook> {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}.json`);
    const workResponse = await axios.get(`${BASE_URL}${response.data.works[0].key}.json`);
    return {
      ...workResponse.data,
      isbn: isbn
    };
  }

  static async getBookByKey(key: string): Promise<OpenLibraryBook> {
    const response = await axios.get(`${BASE_URL}${key}.json`);
    return response.data;
  }

  static getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'L'): string {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }

  static getISBNCoverUrl(isbn: string, size: 'S' | 'M' | 'L' = 'L'): string {
    return `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`;
  }
} 