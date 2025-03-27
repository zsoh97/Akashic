'use client'

import { useEffect, useState } from 'react'
import {
  Container,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  Center,
  Box,
} from '@chakra-ui/react'
import { createBrowserClient } from '@supabase/ssr'
import { BookCard } from '@/components/dashboard/BookCard'
import { Book, Genre } from '@/types/book'

export default function GenrePage({ params }: { params: { id: string } }) {
  const [genre, setGenre] = useState<Genre | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchGenreAndBooks = async () => {
      try {
        // Fetch genre details using the ID or slug
        const { data: genreData } = await supabase
          .from('genres')
          .select('*')
          .eq('id', params.id)
          .single()

        if (genreData) {
          setGenre(genreData)

          // Fetch books in this genre
          const { data: booksData } = await supabase
            .from('books')
            .select(`
              *,
              book_genres!inner(genre_id)
            `)
            .eq('book_genres.genre_id', params.id)

          setBooks(booksData || [])
        }
      } catch (error) {
        console.error('Error fetching genre data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGenreAndBooks()
  }, [params.id, supabase])

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="sepia.500" />
      </Center>
    )
  }

  if (!genre) {
    return (
      <Center h="100vh">
        <Text>Genre not found</Text>
      </Center>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>{genre.name}</Heading>
          <Text color="gray.600">{genre.description}</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={6}>
          {books.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  )
} 