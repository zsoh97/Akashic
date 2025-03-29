'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Alert,
  AlertIcon,
  Divider,
} from '@chakra-ui/react';
import { getOrigin } from '@/utils/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const supabase = createClientComponentClient();

  // Check for message parameter
  useEffect(() => {
    const message = searchParams?.get('message');
    if (message === 'check-email') {
      setMessage('Check your email for the confirmation link.');
    }
  }, [searchParams]);

  // Magic link authentication
  const handleMagicLinkSignIn = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    
    try {
      setMagicLinkLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${getOrigin()}/auth/callback`,
        },
      });
      
      if (error) throw error;
      
      setMessage('Check your email for the magic link to sign in!');
      toast({
        title: 'Magic link sent',
        description: 'Check your email for the login link',
        status: 'success',
        duration: 5000,
      });
    } catch (err: any) {
      console.error('Magic link error:', err);
      setError(err.message || 'Failed to send magic link');
    } finally {
      setMagicLinkLoading(false);
    }
  };

  // Regular login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={6}>
        <Heading>Sign In</Heading>
        
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        {message && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            {message}
          </Alert>
        )}
        
        <VStack spacing={4} align="flex-start" width="100%">
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
            />
          </FormControl>
          
          <Button
            colorScheme="sepia"
            width="full"
            isLoading={magicLinkLoading}
            loadingText="Sending Link"
            onClick={handleMagicLinkSignIn}
          >
            Sign In with Magic Link
          </Button>
          
          <Text fontSize="sm" color="gray.500" textAlign="center" width="100%">
            We'll email you a magic link for a password-free sign in
          </Text>
        </VStack>
        
        <Divider />
        
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <VStack spacing={4} align="flex-start" width="100%">
            <Heading size="sm">Or Sign In with Password</Heading>
            
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </FormControl>
            
            <Button
              type="submit"
              variant="outline"
              colorScheme="sepia"
              width="full"
              isLoading={loading}
              loadingText="Signing In"
            >
              Sign In with Password
            </Button>
          </VStack>
        </form>
        
        <Text>
          Don't have an account?{' '}
          <Link color="sepia.500" href="/signup">
            Sign up
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}