"use client";

// Add a simple cache
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour in milliseconds
const bestsellersCache: Record<string, {data: NYTBestsellerList, timestamp: number}> = {};

// NYT Books API service
export interface NYTBook {
  rank: number;
  rank_last_week: number;
  weeks_on_list: number;
  primary_isbn10: string;
  primary_isbn13: string;
  publisher: string;
  description: string;
  price: string;
  title: string;
  author: string;
  contributor: string;
  contributor_note: string;
  book_image: string;
  amazon_product_url: string;
  age_group: string;
  book_review_link: string;
  buy_links: Array<{
    name: string;
    url: string;
  }>;
}

export interface NYTBestsellerList {
  list_name: string;
  list_name_encoded: string;
  bestsellers_date: string;
  published_date: string;
  books: NYTBook[];
}

// List of available NYT bestseller lists
export const NYT_LISTS = [
  { id: "hardcover-fiction", name: "Hardcover Fiction" },
  { id: "hardcover-nonfiction", name: "Hardcover Nonfiction" },
  { id: "trade-fiction-paperback", name: "Paperback Trade Fiction" },
  { id: "paperback-nonfiction", name: "Paperback Nonfiction" },
  { id: "young-adult-hardcover", name: "Young Adult" },
  { id: "childrens-middle-grade-hardcover", name: "Children's Middle Grade" },
  { id: "business-books", name: "Business" },
  { id: "science", name: "Science" },
  { id: "advice-how-to-and-miscellaneous", name: "Advice & Self-Help" }
];

// Pure data fetching functions without caching logic
export async function fetchNYTBestsellers(listName = "hardcover-fiction"): Promise<NYTBestsellerList> {
  const apiKey = process.env.NEXT_PUBLIC_NYT_API_KEY;
  
  if (!apiKey) {
    throw new Error("NYT API key is not configured");
  }
  
  const response = await fetch(
    `https://api.nytimes.com/svc/books/v3/lists/current/${listName}.json?api-key=${apiKey}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch bestsellers: ${response.statusText}`);
  }
  
  const data = await response.json();
  return {
    list_name: data.results.list_name,
    list_name_encoded: data.results.list_name_encoded,
    bestsellers_date: data.results.bestsellers_date,
    published_date: data.results.published_date,
    books: data.results.books
  };
}

export async function fetchNYTLists(): Promise<Array<{list_name: string, list_name_encoded: string}>> {
  const apiKey = process.env.NEXT_PUBLIC_NYT_API_KEY;
  
  if (!apiKey) {
    throw new Error("NYT API key is not configured");
  }
  
  const response = await fetch(
    `https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=${apiKey}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch lists: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.results;
} 