'use client'

import {
  Box,
  Input,
  VStack,
  HStack,
  Image,
  Text,
  Spinner,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useBookSearch } from '@/hooks/useOpenLibrary'
import { OpenLibraryService } from '@/lib/services/openLibrary'
import { useDebounce } from '@/hooks/useDebounce'

interface BookSearchProps {
  onSelect?: (book: any) => void
}

export function BookSearch({ onSelect }: BookSearchProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const { data, isLoading } = useBookSearch(debouncedQuery)
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen} variant="outline" w="full">
        Search Books
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search Books</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Input
                placeholder="Search by title, author, or ISBN..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              {isLoading && <Spinner />}

              {data?.docs.map((book) => (
                <Box
                  key={book.key}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{ bg: 'gray.50' }}
                  onClick={() => {
                    if (onSelect) onSelect(book)
                    onClose()
                  }}
                >
                  <HStack spacing={4}>
                    {book.cover_i && (
                      <Image
                        src={OpenLibraryService.getCoverUrl(book.cover_i, 'M')}
                        alt={book.title}
                        boxSize="100px"
                        objectFit="cover"
                        fallbackSrc="/empty-book-cover.svg"
                      />
                    )}
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{book.title}</Text>
                      <Text color="gray.600">
                        {book.author_name?.[0]}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        First published: {book.first_publish_year}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
} 