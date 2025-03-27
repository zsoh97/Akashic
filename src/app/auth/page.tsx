'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Container,
  Box,
  VStack,
  Heading,
  Text,
} from '@chakra-ui/react'
import { SignUpForm } from '@/components/auth/SignUpForm'
import Link from 'next/link'
import { SignInForm } from '@/components/auth/SignInForm'
import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthPage() {
  const searchParams = useSearchParams()
  const mode = searchParams?.get('mode')
  const router = useRouter()

  const {session} = useAuth()
  useEffect(() => {
    if (session) {
      router.replace('/dashboard')
    }
  }, [session, router])

  return (
    <Container maxW="md" py={12}>
      <Box p={8} shadow="lg" rounded="xl" bg="white">
        <VStack spacing={8}>
          <VStack spacing={2} textAlign="center">
            <Heading size="xl">{mode === 'login' ? 'Welcome Back' : 'Join Akashic'}</Heading>
            <Text color="gray.600">
              {mode === 'login' ? 'Sign in to continue reading' : 'Your next great read awaits'}
            </Text>
          </VStack>

          {mode === 'login' ? (
            <>
              <SignInForm />
              <Text fontSize="sm" color="gray.600">
                Don't have an account?{' '}
                <Link href="/auth?mode=signup" style={{ color: 'sepia.500', textDecoration: 'underline' }}>
                  Sign up
                </Link>
              </Text>
            </>
          ) : (
            <>
              <SignUpForm />
              <Text fontSize="sm" color="gray.600">
                Already have an account?{' '}
                <Link href="/auth?mode=login" style={{ color: 'sepia.500', textDecoration: 'underline' }}>
                  Sign in
                </Link>
              </Text>
            </>
          )}
        </VStack>
      </Box>
    </Container>
  )
}