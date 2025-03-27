'use client'

import { useQuery } from '@tanstack/react-query'
import { getUserBooks } from '@/lib/actions'
import { queryKeys } from '@/lib/query/keys'

export function useBooks() {
  return useQuery({
    queryKey: queryKeys.books.user,
    queryFn: getUserBooks
  })
} 