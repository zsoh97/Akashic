'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Code,
  Divider,
} from '@chakra-ui/react';
import { getOrigin } from '@/utils/client';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkLoading, setMagicLinkLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const router = useRouter();
  const toast = useToast();
  const supabase = createClientComponentClient();

  // Magic link authentication (more reliable)
  const handleMagicLinkSignIn = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    
    try {
      setMagicLinkLoading(true);
      setError(null);
      setSuccess(null);
      setDebugInfo(null);
      
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${getOrigin()}/auth/callback`,
        },
      });
      
      setDebugInfo({ magicLink: { data, error } });
      
      if (error) throw error;
      
      setSuccess('Check your email for the magic link to sign in!');
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

  // Regular signup (may still have issues)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setDebugInfo(null);
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      setLoading(true);
      
      // Direct sign-up with minimal options
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      // Store debug info
      setDebugInfo({
        response: data,
        error: signUpError,
      });
      
      if (signUpError) {
        throw signUpError;
      }
      
      if (data.user) {
        setSuccess('Account created! Check your email for confirmation.');
        toast({
          title: 'Account created successfully',
          status: 'success',
          duration: 5000,
        });
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={6}>
        <Heading>Create an Account</Heading>
        
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            {success}
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
        
        <form onSubmit={handleSignUp} style={{ width: '100%' }}>
          <VStack spacing={4} align="flex-start" width="100%">
            <Heading size="sm">Or Sign Up with Password</Heading>
            
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
              <Text fontSize="sm" color="gray.500" mt={1}>
                Must be at least 6 characters
              </Text>
            </FormControl>
            
            <Button
              type="submit"
              variant="outline"
              colorScheme="sepia"
              width="full"
              isLoading={loading}
              loadingText="Creating Account"
            >
              Sign Up with Password
            </Button>
          </VStack>
        </form>
        
        <Text>
          Already have an account?{' '}
          <Link color="sepia.500" href="/login">
            Log in
          </Link>
        </Text>
        
        {debugInfo && (
          <Box mt={4} p={3} bg="gray.50" borderRadius="md" width="100%" overflowX="auto">
            <Text fontWeight="bold" mb={2}>Debug Information:</Text>
            <Code display="block" whiteSpace="pre" p={2}>
              {JSON.stringify(debugInfo, null, 2)}
            </Code>
          </Box>
        )}
      </VStack>
    </Box>
  );
}