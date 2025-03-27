'use client'

import { useQuery } from '@tanstack/react-query'
import { OpenLibraryService } from '@/lib/services/openLibrary'

export function useBookSearch(query: string) {
  return useQuery({
    queryKey: ['bookSearch', query],
    queryFn: () => OpenLibraryService.searchBooks(query),
    enabled: query.length > 2, // Only search when query is at least 3 characters
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  })
}

export function useBookDetails(isbn: string) {
  return useQuery({
    queryKey: ['book', isbn],
    queryFn: () => OpenLibraryService.getBookByISBN(isbn),
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
  })
} 