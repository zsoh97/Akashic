'use client'

import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  Text,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { FcGoogle } from 'react-icons/fc'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/navigation'
import { getOrigin } from '@/utils/client'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard/discover')
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
      setError('Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getOrigin()}/auth/callback`
        }
      })

      if (error) throw error
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to sign in with Google')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack spacing={6} w="full">
      <Button
        w="full"
        variant="outline"
        leftIcon={<Icon as={FcGoogle} boxSize="18px" />}
        onClick={handleGoogleSignIn}
        isLoading={isLoading}
      >
        Continue with Google
      </Button>

      <HStack w="full">
        <Divider />
        <Text fontSize="sm" color="gray.500" whiteSpace="nowrap" px={3}>
          or sign in with email
        </Text>
        <Divider />
      </HStack>

      <VStack as="form" onSubmit={handleSubmit} spacing={4} w="full">
        <FormControl isRequired isInvalid={!!error}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired isInvalid={!!error}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>

        <Button
          type="submit"
          colorScheme="sepia"
          w="full"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </VStack>
      </VStack>
      )
}