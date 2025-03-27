import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the path from the URL search params
    const url = new URL(request.url);
    const path = url.searchParams.get('path');
    
    if (!path) {
      return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
    }
    
    console.log('Fetching from OpenLibrary:', path);
    
    // Forward the request to Open Library
    const response = await fetch(`https://openlibrary.org/${path}`, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request to Open Library:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Open Library' },
      { status: 500 }
    );
  }
} 