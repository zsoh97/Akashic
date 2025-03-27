"use client";

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNYTBestsellers, fetchNYTLists, NYTBestsellerList } from '@/services/nytBooksService';

interface UseNYTBestsellersResult {
  data: NYTBestsellerList | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Simple in-memory cache
const cache: Record<string, { data: NYTBestsellerList; timestamp: number }> = {};
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export function useNYTBestsellers(listName: string): UseNYTBestsellersResult {
  const [data, setData] = useState<NYTBestsellerList | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check cache first
        const now = Date.now();
        const cachedData = cache[listName];
        
        if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
          if (isMounted) {
            setData(cachedData.data);
            setIsLoading(false);
          }
          return;
        }
        
        // If not in cache or expired, fetch new data
        const result = await fetchNYTBestsellers(listName);
        
        // Update cache
        cache[listName] = {
          data: result,
          timestamp: now
        };
        
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(`Error fetching NYT bestseller list ${listName}:`, err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch bestsellers'));
          setIsLoading(false);
          
          // Try to use cached data even if expired
          const cachedData = cache[listName];
          if (cachedData) {
            setData(cachedData.data);
          }
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [listName, refreshKey]);

  const refetch = () => {
    setRefreshKey(prev => prev + 1);
  };

  return { data, isLoading, error, refetch };
}

// Hook for fetching all available lists
export function useNYTLists() {
  return useQuery<Array<{list_name: string, list_name_encoded: string}>, Error>({
    queryKey: ['nyt-lists'],
    queryFn: fetchNYTLists,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });
} 