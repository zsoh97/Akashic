import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const fileParams = await params
    const path = fileParams.path.join('/');
    const url = new URL(request.url);
    const searchParams = new URLSearchParams();
    
    // Copy all search parameters from the request
    url.searchParams.forEach((value, key) => {
      searchParams.append(key, value);
    });
    
    // Build the OpenLibrary API URL
    const openLibraryUrl = `https://openlibrary.org/${path}?${searchParams.toString()}`;
    
    // Fetch data from OpenLibrary
    const response = await fetch(openLibraryUrl);
    
    if (!response.ok) {
      throw new Error(`OpenLibrary API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to OpenLibrary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from OpenLibrary' },
      { status: 500 }
    );
  }
} 