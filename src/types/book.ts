import { IsString, IsUUID, IsOptional, IsEnum } from 'class-validator'

export enum BookStatus {
  READING = 'reading',
  COMPLETED = 'completed',
  WANT_TO_READ = 'want_to_read'
}

export type Genre = {
  id: string
  name: string
  description?: string
  created_at: Date
  updated_at: Date
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: Date;
  description: string;
  pageCount: number;
  categories: string[];
  coverImage: string;
  isbn: string;
  isbn13: string;
  rating?: number;
}

export type UserBook = {
  user_id: string         // UUID from auth.users
  book_id: string        // TEXT from books
  status: BookStatus
  created_at: Date
  updated_at: Date
}

export type BookReview = {
  id: string             // UUID
  book_id: string       // TEXT from books
  user_id: string       // UUID from auth.users
  rating: number        // 1-5
  review?: string
  created_at: Date
  updated_at: Date
}
