'use client'

import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { createBrowserClient } from '@supabase/ssr'

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const toast = useToast()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            display_name: username
          }
        },
      })

      if (error) throw error

      setIsEmailSent(true)
      toast({
        title: 'Verification email sent',
        description: 'Please check your email to complete signup',
        status: 'success',
        duration: 5000,
      })
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <VStack spacing={4} p={4} textAlign="center">
        <Text fontSize="lg">Verification email sent!</Text>
        <Text color="gray.600">
          Please check your email to complete your registration.
          The link will expire in 24 hours.
        </Text>
      </VStack>
    )
  }

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} w="full">
      <FormControl isRequired isInvalid={!!error}>
        <FormLabel>Username</FormLabel>
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a display name"
        />
      </FormControl>

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
      </FormControl>

      <FormControl isRequired isInvalid={!!error}>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>

      <Button
        type="submit"
        colorScheme="sepia"
        w="full"
        isLoading={isLoading}
      >
        Create Account
      </Button>
    </VStack>
  )
}